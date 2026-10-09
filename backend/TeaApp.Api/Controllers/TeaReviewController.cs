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
        int? uTeaID,
        int? uUserID
    )
    {
        var query = _dbContext.TeaReviewDbSet.AsQueryable();

        if (uTeaID.HasValue)
        {
            query = query.Where(xReview => xReview.TeaId == uTeaID.Value);
        }

        if (uUserID.HasValue)
        {
            query = query.Where(xReview => xReview.UserId == uUserID.Value);
        }

        var reviews = await query.Select(xReview => new TeaReviewResponseDTO
        {
            ID = xReview.ID,
            TeaId = xReview.TeaId,
            UserId = xReview.UserId,
            Review = xReview.Review,
            Rating = xReview.Rating
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