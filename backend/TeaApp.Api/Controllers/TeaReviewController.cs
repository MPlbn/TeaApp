using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
using TeaApp.Api.DTOs;
using TeaApp.Api.Models;

namespace TeaApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class TeaReviewController : ControllerBase {
    private readonly TeaDbContext _dbContext;

    public TeaReviewController(TeaDbContext uDbContext) {
        _dbContext = uDbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeaReviewResponseDTO>>> GetReviews(
        int? teaId
    ) {
        var query = _dbContext.TeaReviewDbSet.AsQueryable();

        if (teaId.HasValue) {
            query = query.Where(review => review.TeaId == teaId.Value);
        }

        var reviews = await query.Select(review => new TeaReviewResponseDTO {
            Id = review.Id,
            TeaId = review.TeaId,
            UserId = review.UserId,
            Review = review.Review,
            Rating = review.Rating
        })
        .ToListAsync();

        return Ok(reviews);
    }
    [HttpPost]
    public async Task<ActionResult<TeaReviewResponseDTO>> CreateTeaReview(TeaReviewDTO DTO) {
        var teaExists = await _dbContext.TeaDbSet.AnyAsync(xTea => xTea.Id == DTO.TeaId!.Value);

        if (!teaExists) {
            return BadRequest("The specified tea does not exist.");
        }

        var review = new TeaReview {
            TeaId = DTO.TeaId!.Value,
            UserId = DTO.UserId!,
            Review = DTO.Review,
            Rating = DTO.Rating
        };

        _dbContext.TeaReviewDbSet.Add(review);
        await _dbContext.SaveChangesAsync();

        var response = new TeaReviewResponseDTO {
            Id = review.Id,
            TeaId = review.TeaId,
            UserId = review.UserId,
            Review = review.Review,
            Rating = review.Rating
        };

        return StatusCode(StatusCodes.Status201Created, response);
    }
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTeaReview(int id, TeaReviewDTO DTO) {
        var review = await _dbContext.TeaReviewDbSet.FindAsync(id);

        if (review == null) {
            return NotFound();
        }

        var teaExists = await _dbContext.TeaDbSet.AnyAsync(xTea => xTea.Id == DTO.TeaId!.Value);

        if (!teaExists) {
            return BadRequest("The specified tea does not exist.");
        }

        review.TeaId = DTO.TeaId!.Value;
        review.UserId = DTO.UserId!;
        review.Review = DTO.Review;
        review.Rating = DTO.Rating;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTeaReview(int id) {
        var review = await _dbContext.TeaReviewDbSet.FindAsync(id);

        if (review == null) {
            return NotFound();
        }

        _dbContext.TeaReviewDbSet.Remove(review);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}