using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
using TeaApp.Api.DTOs;
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
    public async Task<ActionResult<IEnumerable<BrewingMethodResponseDTO>>> GetBrewingMethods(
        int? TeaID
    )
    {
        var query = _dbContext.BrewingMethodDbSet.AsQueryable();

        if (TeaID.HasValue)
        {
            query = query.Where(brewingMethod => brewingMethod.teaId == TeaID.Value);
        }

        var brewingMethods = await query.Select(brewingMethod => new BrewingMethodResponseDTO
        {
            id = brewingMethod.id,
            teaId = brewingMethod.teaId,
            method = brewingMethod.method,
            temperature = brewingMethod.temperature,
            brewingTimes = brewingMethod.brewingTimes,
            gongfuBrewingTimeIncrement = brewingMethod.gongfuBrewingTimeIncrement
        })
        .ToListAsync();

        return Ok(brewingMethods);
    }

    [HttpPost]
    public async Task<ActionResult<BrewingMethodResponseDTO>> CreateBrewingMethod(BrewingMethodDTO uDTO)
    {
        var teaExists = await _dbContext.TeaDbSet.AnyAsync(xTea => xTea.id == uDTO.teaId!.Value);

        if (!teaExists)
        {
            return BadRequest("The specified tea does not exist.");
        }

        var brewingMethod = new BrewingMethod
        {
            teaId = uDTO.teaId!.Value,
            method = uDTO.method!.Value,
            temperature = uDTO.temperature!.Value,
            brewingTimes = uDTO.brewingTimes,
            gongfuBrewingTimeIncrement = uDTO.gongfuBrewingTimeIncrement
        };

        _dbContext.BrewingMethodDbSet.Add(brewingMethod);
        await _dbContext.SaveChangesAsync();

        var response = new BrewingMethodResponseDTO
        {
            id = brewingMethod.id,
            teaId = brewingMethod.teaId,
            method = brewingMethod.method,
            temperature = brewingMethod.temperature,
            brewingTimes = brewingMethod.brewingTimes,
            gongfuBrewingTimeIncrement = brewingMethod.gongfuBrewingTimeIncrement
        };

        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpPut("{uID:int}")]
    public async Task<IActionResult> UpdateBrewingMethod(int uID, BrewingMethodDTO uDTO)
    {
        var brewingMethod = await _dbContext.BrewingMethodDbSet.FindAsync(uID);

        if(brewingMethod == null)
        {
            return NotFound();
        }
        
        var teaExists = await _dbContext.TeaDbSet.AnyAsync(xTea => xTea.id == uDTO.teaId!.Value);

        if (!teaExists)
        {
            return BadRequest("The specified tea does not exist.");
        }

        brewingMethod.teaId = uDTO.teaId!.Value;
        brewingMethod.method = uDTO.method!.Value;
        brewingMethod.temperature = uDTO.temperature!.Value;
        brewingMethod.brewingTimes = uDTO.brewingTimes;
        brewingMethod.gongfuBrewingTimeIncrement = uDTO.gongfuBrewingTimeIncrement;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{uID:int}")]
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