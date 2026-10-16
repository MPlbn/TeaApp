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
            query = query.Where(review => review.teaId == TeaID.Value);
        }

        if (UserID.HasValue)
        {
            query = query.Where(review => review.userId == UserID.Value);
        }

        var reviews = await query.Select(review => new TeaReviewResponseDTO
        {
            id = review.id,
            teaId = review.teaId,
            userId = review.userId,
            review = review.review,
            rating = review.rating
        })
        .ToListAsync();

        return Ok(reviews);
    }
    [HttpPost]
    public async Task<ActionResult<TeaReviewResponseDTO>> CreateTeaReview(TeaReviewDTO uDTO)
    {
        var teaExists = await _dbContext.TeaDbSet.AnyAsync(xTea => xTea.id == uDTO.teaId!.Value);

        if (!teaExists)
        {
            return BadRequest("The specified tea does not exist.");
        }

        var review = new TeaReview
        {
            teaId = uDTO.teaId!.Value,
            userId = uDTO.userId!.Value,
            review = uDTO.review,
            rating = uDTO.rating
        };

        _dbContext.TeaReviewDbSet.Add(review);
        await _dbContext.SaveChangesAsync();

        var response = new TeaReviewResponseDTO
        {
            id = review.id,
            teaId = review.teaId,
            userId = review.userId,
            review = review.review,
            rating = review.rating            
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
        
        var teaExists = await _dbContext.TeaDbSet.AnyAsync(xTea => xTea.id == uDTO.teaId!.Value);

        if (!teaExists)
        {
            return BadRequest("The specified tea does not exist.");
        }

        review.teaId = uDTO.teaId!.Value;
        review.userId = uDTO.userId!.Value;
        review.review = uDTO.review;
        review.rating = uDTO.rating;

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