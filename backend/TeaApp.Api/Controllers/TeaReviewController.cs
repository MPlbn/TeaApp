using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
using TeaApp.Api.DTOs;
using TeaApp.Api.Models;

namespace TeaApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class TeaReviewController : ControllerBase
{
    private readonly TeaDbContext _dbContext;

    public TeaReviewController(TeaDbContext uDbContext)
    {
        _dbContext = uDbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeaReviewResponseDTO>>> GetReviews(
        int? TeaID,
        int? UserID
    )
    {
        var query = _dbContext.TeaReviewDbSet.AsQueryable();

        if (TeaID.HasValue)
        {
            query = query.Where(review => review.TeaId == TeaID.Value);
        }

        if (UserID.HasValue)
        {
            query = query.Where(review => review.UserId == UserID.Value);
        }

        var reviews = await query.Select(review => new TeaReviewResponseDTO
        {
            ID = review.ID,
            TeaId = review.TeaId,
            UserId = review.UserId,
            Review = review.Review,
            Rating = review.Rating
        })
        .ToListAsync();

        return Ok(reviews);
    }
    [HttpPost]
    public async Task<ActionResult<TeaReviewResponseDTO>> CreateTeaReview(TeaReviewDTO uDTO)
    {
        var teaExists = await _dbContext.TeaDbSet.AnyAsync(xTea => xTea.ID == uDTO.TeaId!.Value);

        if (!teaExists)
        {
            return BadRequest("The specified tea does not exist.");
        }

        var review = new TeaReview
        {
            TeaId = uDTO.TeaId!.Value,
            UserId = uDTO.UserId!.Value,
            Review = uDTO.Review,
            Rating = uDTO.Rating
        };

        _dbContext.TeaReviewDbSet.Add(review);
        await _dbContext.SaveChangesAsync();

        var response = new TeaReviewResponseDTO
        {
            ID = review.ID,
            TeaId = review.TeaId,
            UserId = review.UserId,
            Review = review.Review,
            Rating = review.Rating            
        };

        return StatusCode(StatusCodes.Status201Created, response);
    }
    [HttpPut("{uID:int}")]
    public async Task<IActionResult> UpdateTeaReview(int uID, TeaReviewDTO uDTO)
    {
        var review = await _dbContext.TeaReviewDbSet.FindAsync(uID);

        if(review == null)
        {
            return NotFound();
        }
        
        var teaExists = await _dbContext.TeaDbSet.AnyAsync(xTea => xTea.ID == uDTO.TeaId!.Value);

        if (!teaExists)
        {
            return BadRequest("The specified tea does not exist.");
        }

        review.TeaId = uDTO.TeaId!.Value;
        review.UserId = uDTO.UserId!.Value;
        review.Review = uDTO.Review;
        review.Rating = uDTO.Rating;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
    [HttpDelete("{uID:int}")]
    public async Task<IActionResult> DeleteTeaReview(int uID)
    {
        var review = await _dbContext.TeaReviewDbSet.FindAsync(uID);

        if(review == null)
        {
            return NotFound();
        }

        _dbContext.TeaReviewDbSet.Remove(review);

        await _dbContext.SaveChangesAsync();
        
        return NoContent();
    }
}