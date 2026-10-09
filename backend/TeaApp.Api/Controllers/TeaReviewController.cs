using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
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
    public async Task<ActionResult<IEnumerable<TeaReview>>> GetReviews(
        int? uTeaID
    )
    {
        var query = _dbContext.TeaReviewDbSet.AsQueryable();

        if(uTeaID.HasValue)
        {
            query = query.Where(xTeaReview => xTeaReview.TeaId == uTeaID.Value);
        }

        var reviews = await query.ToListAsync();

        return Ok(reviews);
    }
    [HttpPost]
    //TODO
    public async Task<ActionResult<TeaReview>> CreateTeaReview(TeaReview uReview)
    {
        return NoContent();
    }
    [HttpPut]
    //TODO
    public async Task<IActionResult> UpdateTeaReview()
    {
        return NoContent();
    }
    [HttpDelete("{uID}")]
    public async Task<IActionResult> DeleteTeaReview(int uID)
    {
        var review = await _dbContext.TeaReviewDbSet.FindAsync(uID);

        if (review == null)
        {
            return NotFound();
        }

        _dbContext.TeaReviewDbSet.Remove(review);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}