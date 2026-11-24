using System.Security.Claims;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using TeaApp.Api.Data;
using TeaApp.Api.DTOs;
using TeaApp.Api.Models;

namespace TeaApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeaController(TeaDbContext dbContext) : ControllerBase {
    private readonly TeaDbContext _dbContext = dbContext;

    [HttpGet("public")]
    public async Task<ActionResult<PagintatedResponseDTO<TeaListItemResponseDTO>>> GetPublicTeas(
        [FromQuery(Name = "Page")] int Page,
        [FromQuery(Name = "PageSize")] int PageSize,
        [FromQuery(Name = "Type")] TeaType? Type
    ) {
        var query = _dbContext.TeaDbSet.Where(tea => tea.IsPublic);

        if (Type.HasValue) {
            query = query.Where(tea => tea.Type == Type.Value);
        }

        var totalCount = await query.CountAsync();

        var pageSize = Math.Clamp(PageSize, 1, 50);
        var page = Math.Max(Page, 1);

        var teas = await query
            .OrderBy(tea => tea.Name)
            .ThenBy(tea => tea.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(tea => new TeaListItemResponseDTO {
                Id = tea.Id,
                Name = tea.Name,
                Type = tea.Type,
                Origin = tea.Origin
            })
            .ToListAsync();

        return Ok(new PagintatedResponseDTO<TeaListItemResponseDTO> {
            Items = teas,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        });
    }

    [Authorize]
    [HttpGet("private")]
    public async Task<ActionResult<PagintatedResponseDTO<TeaListItemResponseDTO>>> GetPrivateTeas(
        [FromQuery(Name = "Page")] int Page,
        [FromQuery(Name = "PageSize")] int PageSize,
        [FromQuery(Name = "Type")] TeaType? Type
    ) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var query = _dbContext.TeaDbSet.Where(tea => tea.OwnerId == userId);

        if (Type.HasValue) {
            query = query.Where(tea => tea.Type == Type.Value);
        }

        var totalCount = await query.CountAsync();

        var pageSize = Math.Clamp(PageSize, 1, 50);
        var page = Math.Max(Page, 1);

        var teas = await query
            .OrderBy(tea => tea.Name)
            .ThenBy(tea => tea.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(tea => new TeaListItemResponseDTO {
                Id = tea.Id,
                Name = tea.Name,
                Type = tea.Type,
                Origin = tea.Origin
            })
            .ToListAsync();

        return Ok(new PagintatedResponseDTO<TeaListItemResponseDTO> {
            Items = teas,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        });
    }

    [HttpGet("public/{id:int}")]
    public async Task<ActionResult<TeaResponseDTO>> GetPublicTea(int id) {
        var tea = await _dbContext.TeaDbSet
        .Where(tea => tea.Id == id && tea.IsPublic)
        .Select(tea => new TeaResponseDTO {
            Id = tea.Id,
            Name = tea.Name,
            Type = tea.Type,
            Price = tea.Price,
            Origin = tea.Origin,
            Shop = tea.Shop,
            Description = tea.Description,
            Flavors = tea.Flavors
            .Select(flavor => flavor.FlavorType)
            .ToList(),
            OwnerId = tea.OwnerId,
            IsPublic = tea.IsPublic
        })
        .FirstOrDefaultAsync();

        if (tea == null) return NotFound();

        return Ok(tea);
    }

    [Authorize]
    [HttpGet("private/{id:int}")]
    public async Task<ActionResult<TeaResponseDTO>> GetPrivateTea(int id) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");

        var tea = await _dbContext.TeaDbSet
        .Where(tea => tea.Id == id)
        .Select(tea => new TeaResponseDTO {
            Id = tea.Id,
            Name = tea.Name,
            Type = tea.Type,
            Price = tea.Price,
            Origin = tea.Origin,
            Shop = tea.Shop,
            Description = tea.Description,
            Flavors = tea.Flavors
            .Select(flavor => flavor.FlavorType)
            .ToList(),
            OwnerId = tea.OwnerId,
            IsPublic = tea.IsPublic
        })
        .FirstOrDefaultAsync();

        if (tea == null) return NotFound();

        if (userId != tea.OwnerId && !isAdmin) {
            return Unauthorized();
        }

        return Ok(tea);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateTea(TeaDTO DTO) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");
        var isPublic = isAdmin && DTO.IsPublic;


        var tea = new Tea {
            Name = DTO.Name,
            Type = DTO.Type!.Value,
            Price = DTO.Price!.Value,
            Origin = DTO.Origin,
            Shop = DTO.Shop,
            Description = DTO.Description,
            OwnerId = isPublic ? null : userId,
            Flavors = DTO.Flavors
            .Distinct()
            .Select(flavorType => new Flavor {
                FlavorType = flavorType
            })
            .ToList(),
            IsPublic = isPublic
        };

        _dbContext.TeaDbSet.Add(tea);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTea(int id, TeaDTO DTO) {
        var tea = await _dbContext.TeaDbSet.FindAsync(id);

        if (tea == null) return NotFound();

        if (!CanManageTea(tea)) return Forbid();

        var hasPendingRequest = await _dbContext.PublishRequestSet
        .AnyAsync(publishRequest => publishRequest.TeaId == id && publishRequest.Request.Status == RequestStatus.Pending);

        if (hasPendingRequest) return Conflict("Tea has a pending publish request.");

        tea.Name = DTO.Name;
        tea.Type = DTO.Type!.Value;
        tea.Price = DTO.Price!.Value;
        tea.Origin = DTO.Origin;
        tea.Shop = DTO.Shop;
        tea.Description = DTO.Description;

        var existingFlavors = await _dbContext.FlavorSet.Where(flavor => flavor.TeaId == id).ToListAsync();

        _dbContext.FlavorSet.RemoveRange(existingFlavors);

        tea.Flavors = DTO.Flavors.Distinct().Select(flavor => new Flavor {
            TeaId = tea.Id,
            FlavorType = flavor
        })
        .ToList();

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpPatch("{id:int}/unpublish")]
    public async Task<IActionResult> UnpublishTea(int id) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var tea = await _dbContext.TeaDbSet.FindAsync(id);

        if (tea == null) return NotFound();

        if (tea.OwnerId == null) return BadRequest();

        if (tea.OwnerId != userId) return Forbid();

        tea.IsPublic = false;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTea(int id) {
        var tea = await _dbContext.TeaDbSet.FindAsync(id);

        if (tea == null) return NotFound();
        if (!CanManageTea(tea)) return Forbid();

        _dbContext.TeaDbSet.Remove(tea);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }


    private bool CanManageTea(Tea tea) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");
        if (tea.IsPublic && isAdmin) return true;
        if (tea.OwnerId == userId) return true;

        return false;
    }
}