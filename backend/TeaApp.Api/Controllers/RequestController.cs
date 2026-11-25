using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TeaApp.Api.DTOs.Request;
using TeaApp.Api.Models;
using TeaApp.Api.Services.Requests;

namespace TeaApp.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
public class RequestController(RequestService requestService) : ControllerBase {
    private readonly RequestService _requestService = requestService;

    [Authorize(Roles = "Admin")]
    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingRequests(CancellationToken cancellationToken) {
        var requests = await _requestService.GetPendingRequestsAsync(cancellationToken);

        return Ok(requests);
    }

    [Authorize]
    [HttpGet("pending/is-present-check/{type}/{targetId}")]
    public async Task<IActionResult> GetIsPendingRequestAlreadyPresent(
        string targetId,
        RequestType type,
        CancellationToken cancellationToken) {

        if (!Enum.IsDefined<RequestType>(type)) {
            return BadRequest("Invalid request type.");
        }

        var result = await _requestService.IsPendingRequestAlreadyPresent(type, targetId, cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpGet("mine")]
    public async Task<IActionResult> GetUserRequests(
        RequestType? RequestType,
        CancellationToken cancellationToken) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null) return Unauthorized();

        var requests = await _requestService.GetUserRequestsAsync(userId, RequestType, cancellationToken);

        return Ok(requests);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateRequest(CreateRequestDTO DTO, CancellationToken cancellationToken) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null) return Unauthorized();

        var isAdmin = User.IsInRole("Admin");

        try {
            await _requestService.CreateRequestAsync(
                DTO.Type,
                DTO.Details,
                userId,
                isAdmin,
                cancellationToken
            );

            return NoContent();
        }
        catch (InvalidOperationException exception) {
            return BadRequest(exception.Message);
        }
        catch (KeyNotFoundException exception) {
            return NotFound(exception.Message);
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("resolve/{id:int}")]
    public async Task<IActionResult> ResolveRequest(
        int id,
        ResolveRequestDTO DTO,
        CancellationToken cancellationToken
    ) {
        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (adminId == null) return Unauthorized();

        var resolutionMessage = DTO.ResolutionMessage ?? "No message provided.";

        await _requestService.ResolveRequestAsync(id, DTO.Status, adminId, resolutionMessage, cancellationToken);

        return NoContent();


    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> CancelRequest(int id, CancellationToken cancellationToken) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null) return Unauthorized();
        try {
            await _requestService.DeleteRequestAsync(id, userId, cancellationToken);
            return NoContent();

        }
        catch (KeyNotFoundException exception) {
            return NotFound(exception.Message);
        }
        catch (InvalidOperationException exception) {
            return BadRequest(exception.Message);
        }
    }
}