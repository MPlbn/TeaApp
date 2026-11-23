using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
using TeaApp.Api.DTOs;
using TeaApp.Api.Models;

namespace TeaApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class TeaReviewController(TeaDbContext uDbContext) : ControllerBase {
    private readonly TeaDbContext _dbContext = uDbContext;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeaReviewResponseDTO>>> GetReviews(
        int? teaId
    ) {
        var query = _dbContext.TeaReviewDbSet.AsQueryable();

        if (teaId.HasValue)
            query = query.Where(review => review.TeaId == teaId.Value);

        var reviews = await query.Select(review => new TeaReviewResponseDTO {
            Id = review.Id,
            TeaId = review.TeaId,
            UserId = review.UserId,
            UserName = review.User.UserName,
            Review = review.Review,
            Rating = review.Rating
        })
        .ToListAsync();

        return Ok(reviews);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<TeaReviewResponseDTO>> CreateTeaReview(TeaReviewDTO DTO) {
        var teaExists = await _dbContext.TeaDbSet.AnyAsync(tea => tea.Id == DTO.TeaId!.Value);
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userName = await _dbContext.Users.Where(user => user.Id == userId).Select(user => user.UserName).FirstAsync(); // that may be not needed in the future

        if (userId == null)
            return Unauthorized();

        if (!teaExists)
            return BadRequest("The specified tea does not exist.");

        var review = new TeaReview {
            TeaId = DTO.TeaId!.Value,
            UserId = userId,
            Review = DTO.Review,
            Rating = DTO.Rating
        };

        _dbContext.TeaReviewDbSet.Add(review);
        await _dbContext.SaveChangesAsync();

        var response = new TeaReviewResponseDTO {
            Id = review.Id,
            TeaId = review.TeaId,
            UserId = review.UserId,
            UserName = userName,
            Review = review.Review,
            Rating = review.Rating
        };

        return StatusCode(StatusCodes.Status201Created, response);
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTeaReview(int id, TeaReviewDTO DTO) {
        var review = await _dbContext.TeaReviewDbSet.FindAsync(id);
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (review == null)
            return NotFound();

        if (userId == null)
            return Unauthorized();

        if (review.UserId != userId)
            return Forbid();

        var teaExists = await _dbContext.TeaDbSet.AnyAsync(tea => tea.Id == DTO.TeaId!.Value);

        if (!teaExists)
            return BadRequest("The specified tea does not exist.");

        review.TeaId = DTO.TeaId!.Value;
        review.Review = DTO.Review;
        review.Rating = DTO.Rating;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTeaReview(int id) {
        var review = await _dbContext.TeaReviewDbSet.FindAsync(id);
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (review == null)
            return NotFound();

        if (userId == null)
            return Unauthorized();

        if (review.UserId != userId)
            return Forbid();


        _dbContext.TeaReviewDbSet.Remove(review);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}