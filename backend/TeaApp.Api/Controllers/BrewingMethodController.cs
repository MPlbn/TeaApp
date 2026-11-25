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

public class BrewingMethodController(TeaDbContext dbContext) : ControllerBase {
    private readonly TeaDbContext _dbContext = dbContext;
    private const int MAX_BREWINGMETHODS_PER_TEA = 50;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BrewingMethodResponseDTO>>> GetBrewingMethods(
        int? teaId
    ) {
        var query = _dbContext.BrewingMethodDbSet.AsQueryable();

        if (teaId.HasValue) {
            query = query.Where(brewingMethod => brewingMethod.TeaId == teaId.Value);
        }

        var brewingMethods = await query.Select(brewingMethod => new BrewingMethodResponseDTO {
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

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BrewingMethodResponseDTO>> CreateBrewingMethod(BrewingMethodDTO DTO) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var isAdmin = User.IsInRole("Admin");

        var tea = await _dbContext.TeaDbSet.FirstOrDefaultAsync(tea => tea.Id == DTO.TeaId!.Value);

        if (tea == null) {
            return BadRequest("The specified tea does not exist.");
        }

        if (userId != tea.OwnerId && !isAdmin) return Unauthorized();

        var brewingMethodCount = await _dbContext.BrewingMethodDbSet.CountAsync(brewingMethod => brewingMethod.TeaId == tea.Id);

        if (brewingMethodCount >= MAX_BREWINGMETHODS_PER_TEA) return Conflict("Tea already has maximum amount of brewing methods");

        var brewingMethod = new BrewingMethod {
            TeaId = DTO.TeaId!.Value,
            Method = DTO.Method!.Value,
            Temperature = DTO.Temperature!.Value,
            AmountPerHundred = DTO.AmountPerHundred!.Value,
            BrewingTimes = DTO.BrewingTimes,
            GongfuBrewingTimeIncrement = DTO.GongfuBrewingTimeIncrement
        };

        _dbContext.BrewingMethodDbSet.Add(brewingMethod);
        await _dbContext.SaveChangesAsync();

        var response = new BrewingMethodResponseDTO {
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

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateBrewingMethod(int id, BrewingMethodDTO DTO) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var isAdmin = User.IsInRole("Admin");

        var brewingMethod = await _dbContext.BrewingMethodDbSet
            .Include(brewingMethod => brewingMethod.Tea)
            .FirstOrDefaultAsync(brewingMethod => brewingMethod.Id == id);

        if (brewingMethod == null) {
            return NotFound();
        }

        var teaExists = await _dbContext.TeaDbSet.AnyAsync(tea => tea.Id == DTO.TeaId!.Value);

        if (!teaExists) {
            return BadRequest("The specified tea does not exist.");
        }

        if (userId != brewingMethod.Tea.OwnerId && !isAdmin) return Unauthorized();

        brewingMethod.Method = DTO.Method!.Value;
        brewingMethod.Temperature = DTO.Temperature!.Value;
        brewingMethod.AmountPerHundred = DTO.AmountPerHundred!.Value;
        brewingMethod.BrewingTimes = DTO.BrewingTimes;
        brewingMethod.GongfuBrewingTimeIncrement = DTO.GongfuBrewingTimeIncrement;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBrewingMethod(int id) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var isAdmin = User.IsInRole("Admin");

        var brewingMethod = await _dbContext.BrewingMethodDbSet
            .Include(brewingMethod => brewingMethod.Tea)
            .FirstOrDefaultAsync(brewingMethod => brewingMethod.Id == id);

        if (brewingMethod == null) return NotFound();

        if (userId != brewingMethod.Tea.OwnerId && !isAdmin) return Unauthorized();

        _dbContext.BrewingMethodDbSet.Remove(brewingMethod);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}