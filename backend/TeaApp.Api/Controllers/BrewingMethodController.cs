using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
using TeaApp.Api.Models;

namespace TeaApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class BrewingMethodController : ControllerBase
{
    private readonly TeaDbContext _dbContext;

    public BrewingMethodController(TeaDbContext uDbContext)
    {
        _dbContext = uDbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BrewingMethod>>> GetBrewingMethods(
        int? uTeaID
    )
    {
        var query = _dbContext.BrewingMethodDbSet.AsQueryable();

        if (uTeaID.HasValue)
        {
            query = query.Where(xBrewingMethod => xBrewingMethod.TeaId == uTeaID.Value);
        }

        var brewingMethods = await query.ToListAsync();

        return Ok(brewingMethods);
    }

    [HttpPost]
    //TODO
    public async Task<ActionResult<BrewingMethod>> CreateBrewingMethod()
    {
        return NoContent();
    }

    [HttpPut]
    //TODO
    public async Task<IActionResult> UpdateBrewingMethod()
    {
        return NoContent();
    }

    [HttpDelete("{uID}")]
    public async Task<IActionResult> DeleteBrewingMethod(int uID)
    {
        var brewingMethod = await _dbContext.BrewingMethodDbSet.FindAsync(uID);

        if(brewingMethod == null)
        {
            return NotFound();
        }

        _dbContext.BrewingMethodDbSet.Remove(brewingMethod);

        await _dbContext.SaveChangesAsync();
        
        return NoContent();
    }
}