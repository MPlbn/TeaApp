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
        int? teaId
    )
    {
        var query = _dbContext.BrewingMethodDbSet.AsQueryable();

        if (teaId.HasValue)
        {
            query = query.Where(brewingMethod => brewingMethod.teaId == teaId.Value);
        }

        var brewingMethods = await query.Select(brewingMethod => new BrewingMethodResponseDTO
        {
            id = brewingMethod.id,
            teaId = brewingMethod.teaId,
            method = brewingMethod.method,
            temperature = brewingMethod.temperature,
            amountPerHundred = brewingMethod.amountPerHundred,
            brewingTimes = brewingMethod.brewingTimes,
            gongfuBrewingTimeIncrement = brewingMethod.gongfuBrewingTimeIncrement
        })
        .ToListAsync();

        return Ok(brewingMethods);
    }

    [HttpPost]
    public async Task<ActionResult<BrewingMethodResponseDTO>> CreateBrewingMethod(BrewingMethodDTO DTO)
    {
        var teaExists = await _dbContext.TeaDbSet.AnyAsync(tea => tea.id == DTO.teaId!.Value);

        if (!teaExists)
        {
            return BadRequest("The specified tea does not exist.");
        }

        var brewingMethod = new BrewingMethod
        {
            teaId = DTO.teaId!.Value,
            method = DTO.method!.Value,
            temperature = DTO.temperature!.Value,
            amountPerHundred = DTO.amountPerHundred!.Value,
            brewingTimes = DTO.brewingTimes,
            gongfuBrewingTimeIncrement = DTO.gongfuBrewingTimeIncrement
        };

        _dbContext.BrewingMethodDbSet.Add(brewingMethod);
        await _dbContext.SaveChangesAsync();

        var response = new BrewingMethodResponseDTO
        {
            id = brewingMethod.id,
            teaId = brewingMethod.teaId,
            method = brewingMethod.method,
            temperature = brewingMethod.temperature,
            amountPerHundred = brewingMethod.amountPerHundred,
            brewingTimes = brewingMethod.brewingTimes,
            gongfuBrewingTimeIncrement = brewingMethod.gongfuBrewingTimeIncrement
        };

        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpPut("{uID:int}")]
    public async Task<IActionResult> UpdateBrewingMethod(int uID, BrewingMethodDTO DTO)
    {
        var brewingMethod = await _dbContext.BrewingMethodDbSet.FindAsync(uID);

        if(brewingMethod == null)
        {
            return NotFound();
        }
        
        var teaExists = await _dbContext.TeaDbSet.AnyAsync(tea => tea.id == DTO.teaId!.Value);

        if (!teaExists)
        {
            return BadRequest("The specified tea does not exist.");
        }

        brewingMethod.teaId = DTO.teaId!.Value;
        brewingMethod.method = DTO.method!.Value;
        brewingMethod.temperature = DTO.temperature!.Value;
        brewingMethod.amountPerHundred = DTO.amountPerHundred!.Value;
        brewingMethod.brewingTimes = DTO.brewingTimes;
        brewingMethod.gongfuBrewingTimeIncrement = DTO.gongfuBrewingTimeIncrement;

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