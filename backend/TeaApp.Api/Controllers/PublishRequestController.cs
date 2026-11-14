using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
using TeaApp.Api.DTOs.PublishRequest;
using TeaApp.Api.Models;

namespace TeaApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublishRequestController(TeaDbContext dbContext) : ControllerBase {
    private readonly TeaDbContext _dbContext = dbContext;

    [Authorize(Roles = "Admin")]
    [HttpGet("pending")]
    public async Task<ActionResult<IEnumerable<PublishRequestListResponseDTO>>> GetPendingPublishRequests() {
        var query = _dbContext.PublishRequestSet.Where(publishRequest => publishRequest.Status == Models.PublishRequestStatus.Pending);

        var publishRequests = await query.Select(publishRequest => new PublishRequestListResponseDTO {
            Id = publishRequest.Id,
            TeaId = publishRequest.TeaId,
            CreatedAt = publishRequest.CreatedAt,
            OwnerId = publishRequest.Tea.OwnerId,
            OwnerUserName = _dbContext.Users
            .Where(user => user.Id == publishRequest.Tea.OwnerId)
            .Select(user => user.UserName)
            .FirstOrDefault()
        })
        .ToListAsync();

        return Ok(publishRequests);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<IEnumerable<PublishRequestListResponseDTO>>> GetUserPublishRequests() {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var query = _dbContext.PublishRequestSet.Where(publishRequest => publishRequest.Tea.OwnerId == userId);

        var publishRequests = await query.Select(publishRequest => new PublishRequestListResponseDTO {
            Id = publishRequest.Id,
            TeaId = publishRequest.TeaId,
            CreatedAt = publishRequest.CreatedAt,
            OwnerId = publishRequest.Tea.OwnerId,
            OwnerUserName = _dbContext.Users
            .Where(user => user.Id == publishRequest.Tea.OwnerId)
            .Select(user => user.UserName)
            .FirstOrDefault()
        })
        .ToListAsync();

        return Ok(publishRequests);
    }

    [Authorize]
    [HttpPost("{teaId:int}")]
    public async Task<IActionResult> CreatePublishRequest(int teaId) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var tea = await _dbContext.TeaDbSet.FirstOrDefaultAsync(tea => tea.Id == teaId);
        if (tea == null) return NotFound();

        if (tea.IsPublic) return Conflict("Tea is already public.");

        var teaOwnerId = tea.OwnerId;
        if (userId != teaOwnerId) return Forbid();

        var hasPendingRequest = await _dbContext.PublishRequestSet
        .AnyAsync(publishRequest => publishRequest.TeaId == teaId && publishRequest.Status == PublishRequestStatus.Pending);

        var isAdmin = User.IsInRole("Admin");

        var publishRequest = new PublishRequest {
            TeaId = teaId,
            ResolutionMessage = isAdmin ? "Automatically accepted." : null,
            ResolvingAdminId = isAdmin ? userId : null,
            Status = isAdmin ? PublishRequestStatus.Accepted : PublishRequestStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            ResolvedAt = isAdmin ? DateTime.UtcNow : null
        };

        _dbContext.PublishRequestSet.Add(publishRequest);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("resolve/{requestId:int}")]
    public async Task<IActionResult> ResolvePublishRequest(int requestId, ResolvePublishRequestDTO DTO) {
        if (DTO.Status != PublishRequestStatus.Accepted || DTO.Status != PublishRequestStatus.Rejected) {
            return BadRequest("Invalid publish request status.");
        }

        var request = await _dbContext.PublishRequestSet
        .Include(publishRequest => publishRequest.Tea)
        .FirstOrDefaultAsync(publishRequest => publishRequest.Id == requestId);

        if (request == null) return NotFound();

        if (request.Status != PublishRequestStatus.Pending) {
            return Conflict("This request has already been resolved.");
        }

        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        request.Status = DTO.Status;
        request.ResolutionMessage = DTO.ResolutionMessage;
        request.ResolvingAdminId = adminId;
        request.ResolvedAt = DateTime.UtcNow;

        if (DTO.Status == PublishRequestStatus.Accepted) {
            request.Tea.IsPublic = true;
        }

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> CancellPublishRequest(int id) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var request = await _dbContext.PublishRequestSet.FirstOrDefaultAsync(publishRequest => publishRequest.Id == id);

        if (request == null) return NotFound();

        if (userId != request.Tea.OwnerId) return Forbid();
        if (request.Status != PublishRequestStatus.Pending) return BadRequest("Publish request is resolved.");

        _dbContext.PublishRequestSet.Remove(request);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}