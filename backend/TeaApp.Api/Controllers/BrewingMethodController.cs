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

    public BrewingMethodController(TeaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BrewingMethodResponseDTO>>> GetBrewingMethods(
        int? teaId
    )
    {
        var query = _dbContext.BrewingMethodDbSet.AsQueryable();

        if (teaId.HasValue)
        {
            query = query.Where(brewingMethod => brewingMethod.TeaId == teaId.Value);
        }

        var brewingMethods = await query.Select(brewingMethod => new BrewingMethodResponseDTO
        {
            Id = brewingMethod.Id,
            TeaId = brewingMethod.TeaId,
            Method = brewingMethod.Method,
            Temperature = brewingMethod.Temperature,
            AmountPerHundred = brewingMethod.AmountPerHundred,
            BrewingTimes = brewingMethod.BrewingTimes,
            GongfuBrewingTimeIncrement = brewingMethod.GongfuBrewingTimeIncrement
        })
        .ToListAsync();

        return Ok(brewingMethods);
    }

    [HttpPost]
    public async Task<ActionResult<BrewingMethodResponseDTO>> CreateBrewingMethod(BrewingMethodDTO DTO)
    {
        var teaExists = await _dbContext.TeaDbSet.AnyAsync(tea => tea.Id == DTO.TeaId!.Value);

        if (!teaExists)
        {
            return BadRequest("The specified tea does not exist.");
        }

        var brewingMethod = new BrewingMethod
        {
            TeaId = DTO.TeaId!.Value,
            Method = DTO.Method!.Value,
            Temperature = DTO.Temperature!.Value,
            AmountPerHundred = DTO.AmountPerHundred!.Value,
            BrewingTimes = DTO.BrewingTimes,
            GongfuBrewingTimeIncrement = DTO.GongfuBrewingTimeIncrement
        };

        _dbContext.BrewingMethodDbSet.Add(brewingMethod);
        await _dbContext.SaveChangesAsync();

        var response = new BrewingMethodResponseDTO
        {
            Id = brewingMethod.Id,
            TeaId = brewingMethod.TeaId,
            Method = brewingMethod.Method,
            Temperature = brewingMethod.Temperature,
            AmountPerHundred = brewingMethod.AmountPerHundred,
            BrewingTimes = brewingMethod.BrewingTimes,
            GongfuBrewingTimeIncrement = brewingMethod.GongfuBrewingTimeIncrement
        };

        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateBrewingMethod(int id, BrewingMethodDTO DTO)
    {
        var brewingMethod = await _dbContext.BrewingMethodDbSet.FindAsync(id);

        if(brewingMethod == null)
        {
            return NotFound();
        }
        
        var teaExists = await _dbContext.TeaDbSet.AnyAsync(tea => tea.Id == DTO.TeaId!.Value);

        if (!teaExists)
        {
            return BadRequest("The specified tea does not exist.");
        }

        brewingMethod.TeaId = DTO.TeaId!.Value;
        brewingMethod.Method = DTO.Method!.Value;
        brewingMethod.Temperature = DTO.Temperature!.Value;
        brewingMethod.AmountPerHundred = DTO.AmountPerHundred!.Value;
        brewingMethod.BrewingTimes = DTO.BrewingTimes;
        brewingMethod.GongfuBrewingTimeIncrement = DTO.GongfuBrewingTimeIncrement;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBrewingMethod(int id)
    {
        var brewingMethod = await _dbContext.BrewingMethodDbSet.FindAsync(id);

        if(brewingMethod == null)
        {
            return NotFound();
        }

        _dbContext.BrewingMethodDbSet.Remove(brewingMethod);

        await _dbContext.SaveChangesAsync();
        
        return NoContent();
    }
}