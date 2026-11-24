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
public class TeaWareController(TeaDbContext dbContext) : ControllerBase {
    private readonly TeaDbContext _dbContext = dbContext;
    private const int MAX_TEAWARE_PER_USER = 50;

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeaWareResponseDTO>>> GetTeaWare() {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var query = _dbContext.TeaWareSet.Where(teaWare => teaWare.OwnerId == userId);

        var teaWares = await query.Select(teaWare => new TeaWareResponseDTO {
            Id = teaWare.Id,
            Name = teaWare.Name,
            Capacity = teaWare.Capacity
        })
        .ToListAsync();

        return Ok(teaWares);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateTeaWare(TeaWareDTO DTO) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null) return Forbid();

        var userTeaWareCount = await _dbContext.TeaWareSet.CountAsync(teaware => teaware.OwnerId == userId);

        if (userTeaWareCount >= MAX_TEAWARE_PER_USER) return Conflict("You have reached the maximum number of teaware items.");

        var teaWare = new TeaWare {
            OwnerId = userId,
            Name = DTO.Name,
            Capacity = DTO.Capacity
        };

        _dbContext.TeaWareSet.Add(teaWare);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> EditTeaWare(int id, TeaWareDTO DTO) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var teaWare = await _dbContext.TeaWareSet.FindAsync(id);

        if (teaWare == null) return NotFound();

        if (userId != teaWare.OwnerId) return Forbid();

        teaWare.Name = DTO.Name;
        teaWare.Capacity = DTO.Capacity;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTeaWare(int id) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var teaWare = await _dbContext.TeaWareSet.FindAsync(id);

        if (teaWare == null) return NotFound();

        if (userId != teaWare.OwnerId) return Forbid();

        _dbContext.Remove(teaWare);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}