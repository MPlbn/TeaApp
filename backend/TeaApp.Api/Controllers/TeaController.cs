using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
using TeaApp.Api.Models;

namespace TeaApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeaController : ControllerBase
{
    private readonly TeaDbContext _dbContext;

    public TeaController(TeaDbContext uDbContext)
    {
        _dbContext = uDbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tea>>> GetTeas(
        TeaType? uType
    )
    {

        var query = _dbContext.TeaDbSet.AsQueryable();

        if (uType.HasValue)
        {
            query = query.Where(xTea => xTea.Type == uType.Value);
        }

        var teas = await query.ToListAsync();

        return Ok(teas);
    }

    [HttpGet("{uID}")]
    public async Task<ActionResult<Tea>> GetTea(int uID)
    {
        var tea = await _dbContext.TeaDbSet.FindAsync(uID);

        if (tea == null)
        {
            return NotFound();
        }

        return Ok(tea);
    }

    [HttpPost]
    public async Task<ActionResult<Tea>> CreateTea(Tea uTea)
    {
        _dbContext.TeaDbSet.Add(uTea);

        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetTea),
            new {uID = uTea.ID},
            uTea
        );
    }

    [HttpPut("{uID}")]
    public async Task<IActionResult> UpdateTea(int uID, Tea uTea)
    {
        if (uID != uTea.ID)
        {
            return BadRequest();
        }

        _dbContext.TeaDbSet.Update(uTea);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{uID}")]
    public async Task<IActionResult> DeleteTea(int uID)
    {
        var tea = await _dbContext.TeaDbSet.FindAsync(uID);

        if (tea == null)
        {
            return NotFound();
        }

        _dbContext.TeaDbSet.Remove(tea);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}