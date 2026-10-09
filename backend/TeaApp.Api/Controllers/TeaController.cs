using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
using TeaApp.Api.DTOs;
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
    public async Task<ActionResult<IEnumerable<TeaResponseDTO>>> GetTeas(
        TeaType? uType
    )
    {

        var query = _dbContext.TeaDbSet.AsQueryable();

        if (uType.HasValue)
        {
            query = query.Where(xTea => xTea.Type == uType.Value);
        }

        var teas = await query.Select(xTea => new TeaResponseDTO
        {
            ID = xTea.ID,
            Name = xTea.Name,
            Type = xTea.Type,
            Price = xTea.Price,
            Origin = xTea.Origin,
            Shop = xTea.Shop,
            Description = xTea.Description
        })
        .ToListAsync();

        return Ok(teas);
    }

    [HttpGet("{uID:int}")]
    public async Task<ActionResult<TeaResponseDTO>> GetTea(int uID)
    {
        var tea = await _dbContext.TeaDbSet
        .Where(xTea => xTea.ID == uID)
        .Select(xTea => new TeaResponseDTO
        {
            ID = xTea.ID,
            Name = xTea.Name,
            Type = xTea.Type,
            Price = xTea.Price,
            Origin = xTea.Origin,
            Shop = xTea.Shop,
            Description = xTea.Description
        })
        .FirstOrDefaultAsync();

        if (tea == null)
        {
            return NotFound();
        }

        return Ok(tea);
    }

    [HttpPost]
    public async Task<ActionResult<TeaResponseDTO>> CreateTea(TeaDTO uDTO)
    {
        var tea = new Tea
        {
            Name = uDTO.Name,
            Type = uDTO.Type!.Value,
            Price = uDTO.Price!.Value,
            Origin = uDTO.Origin,
            Shop = uDTO.Shop,
            Description = uDTO.Description
        };

        _dbContext.TeaDbSet.Add(tea);
        await _dbContext.SaveChangesAsync();

        var response = new TeaResponseDTO
        {
            ID = tea.ID,
            Name = tea.Name,
            Type = tea.Type,
            Price = tea.Price,
            Origin = tea.Origin,
            Shop = tea.Shop,
            Description = tea.Description    
        };

        return CreatedAtAction(
            nameof(GetTea),
            new {uID = tea.ID},
            response
        );
    }

    [HttpPut("{uID:int}")]
    public async Task<IActionResult> UpdateTea(int uID, TeaDTO uDTO)
    {
        var tea = await _dbContext.TeaDbSet.FindAsync(uID);

        if (tea == null)
        {
            return NotFound();
        }

        tea.Name = uDTO.Name;        
        tea.Type = uDTO.Type!.Value;        
        tea.Price = uDTO.Price!.Value;        
        tea.Origin = uDTO.Origin;        
        tea.Shop = uDTO.Shop;        
        tea.Description = uDTO.Description;        

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{uID:int}")]
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