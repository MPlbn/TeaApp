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
            query = query.Where(tea => tea.Type == Type.Value);
        }

        var teas = await query.Select(tea => new TeaListItemResponseDTO
        {
            Id = tea.Id,
            Name = tea.Name,
            Type = tea.Type,
            Origin = tea.Origin,
        })
        .ToListAsync();

        return Ok(teas);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TeaResponseDTO>> GetTea(int id)
    {
        var tea = await _dbContext.TeaDbSet
        .Where(tea => tea.Id == id)
        .Select(tea => new TeaResponseDTO
        {
            Id = tea.Id,
            Name = tea.Name,
            Type = tea.Type,
            Price = tea.Price,
            Origin = tea.Origin,
            Shop = tea.Shop,
            Description = tea.Description,
            Flavors = tea.Flavors
            .Select(flavor => flavor.FlavorType)
            .ToList()
        })
        .FirstOrDefaultAsync();

        if (tea == null)
        {
            return NotFound();
        }

        return Ok(tea);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTea(TeaDTO DTO)
    {
        var tea = new Tea
        {
            Name = DTO.Name,
            Type = DTO.Type!.Value,
            Price = DTO.Price!.Value,
            Origin = DTO.Origin,
            Shop = DTO.Shop,
            Description = DTO.Description,
            Flavors = DTO.Flavors
            .Distinct()
            .Select(flavorType => new Flavor
            {
                FlavorType = flavorType
            })
            .ToList()
        };

        _dbContext.TeaDbSet.Add(tea);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTea(int id, TeaDTO DTO)
    {
        var tea = await _dbContext.TeaDbSet.FindAsync(id);

        if (tea == null)
        {
            return NotFound();
        }

        tea.Name = DTO.Name;        
        tea.Type = DTO.Type!.Value;        
        tea.Price = DTO.Price!.Value;        
        tea.Origin = DTO.Origin;        
        tea.Shop = DTO.Shop;        
        tea.Description = DTO.Description;     

        var existingFlavors = await _dbContext.FlavorSet.Where(flavor => flavor.TeaId == id).ToListAsync();   

        _dbContext.FlavorSet.RemoveRange(existingFlavors);

        tea.Flavors = DTO.Flavors.Distinct().Select(flavor => new Flavor
        {
            TeaId = tea.Id,
            FlavorType = flavor
        })
        .ToList();

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