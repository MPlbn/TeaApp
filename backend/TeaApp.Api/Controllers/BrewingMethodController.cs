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
        int? uTeaID
    )
    {
        var query = _dbContext.BrewingMethodDbSet.AsQueryable();

        if (uTeaID.HasValue)
        {
            query = query.Where(xBrewingMethod => xBrewingMethod.TeaId == uTeaID.Value);
        }

        var brewingMethods = await query.Select(xBrewingMethod => new BrewingMethodResponseDTO
        {
            ID = xBrewingMethod.ID,
            TeaId = xBrewingMethod.TeaId,
            Method = xBrewingMethod.Method,
            Temperature = xBrewingMethod.Temperature,
            BrewingTimes = xBrewingMethod.BrewingTimes,
            GongfuBrewingTimeIncrement = xBrewingMethod.GongfuBrewingTimeIncrement
        })
        .ToListAsync();

        return Ok(brewingMethods);
    }

    [HttpPost]
    public async Task<ActionResult<BrewingMethodResponseDTO>> CreateBrewingMethod(BrewingMethodDTO uDTO)
    {
        var teaExists = await _dbContext.TeaDbSet.AnyAsync(xTea => xTea.ID == uDTO.TeaId!.Value);

        if (!teaExists)
        {
            return BadRequest("The specified tea does not exist.");
        }

        var brewingMethod = new BrewingMethod
        {
            TeaId = uDTO.TeaId!.Value,
            Method = uDTO.Method!.Value,
            Temperature = uDTO.Temperature!.Value,
            BrewingTimes = uDTO.BrewingTimes,
            GongfuBrewingTimeIncrement = uDTO.GongfuBrewingTimeIncrement
        };

        _dbContext.BrewingMethodDbSet.Add(brewingMethod);
        await _dbContext.SaveChangesAsync();

        var response = new BrewingMethodResponseDTO
        {
            ID = brewingMethod.ID,
            TeaId = brewingMethod.TeaId,
            Method = brewingMethod.Method,
            Temperature = brewingMethod.Temperature,
            BrewingTimes = brewingMethod.BrewingTimes,
            GongfuBrewingTimeIncrement = brewingMethod.GongfuBrewingTimeIncrement
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

        brewingMethod.TeaId = uDTO.TeaId!.Value;
        brewingMethod.Method = uDTO.Method!.Value;
        brewingMethod.Temperature = uDTO.Temperature!.Value;
        brewingMethod.BrewingTimes = uDTO.BrewingTimes;
        brewingMethod.GongfuBrewingTimeIncrement = uDTO.GongfuBrewingTimeIncrement;

        await _dbContext.SaveChangesAsync();

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