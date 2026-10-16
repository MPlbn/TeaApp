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
    public async Task<ActionResult<IEnumerable<TeaListItemResponseDTO>>> GetTeas(
        TeaType? Type
    )
    {
        var query = _dbContext.TeaDbSet.AsQueryable();

        if (Type.HasValue)
        {
            query = query.Where(tea => tea.type == Type.Value);
        }

        var teas = await query.Select(tea => new TeaListItemResponseDTO
        {
            id = tea.id,
            name = tea.name,
            type = tea.type,
            origin = tea.origin,
        })
        .ToListAsync();

        return Ok(teas);
    }

    [HttpGet("{uID:int}")]
    public async Task<ActionResult<TeaResponseDTO>> GetTea(int uID)
    {
        var tea = await _dbContext.TeaDbSet
        .Where(xTea => xTea.id == uID)
        .Select(xTea => new TeaResponseDTO
        {
            id = xTea.id,
            name = xTea.name,
            type = xTea.type,
            price = xTea.price,
            origin = xTea.origin,
            shop = xTea.shop,
            description = xTea.description
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
            name = uDTO.name,
            type = uDTO.type!.Value,
            price = uDTO.price!.Value,
            origin = uDTO.origin,
            shop = uDTO.shop,
            description = uDTO.description
        };

        _dbContext.TeaDbSet.Add(tea);
        await _dbContext.SaveChangesAsync();

        var response = new TeaResponseDTO
        {
            id = tea.id,
            name = tea.name,
            type = tea.type,
            price = tea.price,
            origin = tea.origin,
            shop = tea.shop,
            description = tea.description    
        };

        return CreatedAtAction(
            nameof(GetTea),
            new {uID = tea.id},
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

        tea.name = uDTO.name;        
        tea.type = uDTO.type!.Value;        
        tea.price = uDTO.price!.Value;        
        tea.origin = uDTO.origin;        
        tea.shop = uDTO.shop;        
        tea.description = uDTO.description;        

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