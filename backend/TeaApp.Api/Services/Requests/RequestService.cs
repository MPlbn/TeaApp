using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
using TeaApp.Api.DTOs.PublishRequest;
using TeaApp.Api.DTOs.Request;
using TeaApp.Api.Models;
using TeaApp.Api.Services.Requests.Handlers;
using TeaApp.Api.Services.Requests.Mappers;

namespace TeaApp.Api.Services.Requests;

public class RequestService(
        TeaDbContext dbContext,
        IEnumerable<IRequestHandler> handlers,
        IEnumerable<IRequestCreationHandler> creationHandlers,
        IEnumerable<IRequestResponseMapper> mappers
    ) {
    private readonly TeaDbContext _dbContext = dbContext;
    private readonly IEnumerable<IRequestHandler> _handlers = handlers;
    private readonly IEnumerable<IRequestCreationHandler> _creationHandlers = creationHandlers;
    private readonly IEnumerable<IRequestResponseMapper> _mappers = mappers;

    private readonly string _AUTOMATIC_ACCEPT_MESSAGE = "Zaakceptowano automatycznie.";

    public async Task ResolveRequestAsync(
        int requestId,
        RequestStatus status,
        string adminId,
        string resolutionMessage,
        CancellationToken cancellationToken = default
    ) {
        if (status != RequestStatus.Accepted && status != RequestStatus.Rejected) {
            throw new ArgumentException("Invalid resolution status.", nameof(status));
        }

        var request = await _dbContext.RequestSet.FirstOrDefaultAsync(xRequest => xRequest.Id == requestId, cancellationToken)
        ?? throw new KeyNotFoundException("Request not found.");

        if (request.Status != RequestStatus.Pending) {
            throw new InvalidOperationException("Request has already been resolved.");
        }

        var handler = _handlers.FirstOrDefault(xRequest => xRequest.Type == request.Type)
        ?? throw new KeyNotFoundException($"Hanlder for request Type {request.Type} not found");

        await handler.HandleAsync(request, status, cancellationToken);

        request.Status = status;
        request.ResolvingAdminId = adminId;
        request.ResolvedAt = DateTime.UtcNow;
        request.ResolutionMessage = resolutionMessage;

        await _dbContext.SaveChangesAsync(cancellationToken);
    }
    public async Task<List<RequestListResponseDTO>> GetPendingRequestsAsync(CancellationToken cancellationToken = default) {
        var requests = await _dbContext.RequestSet
            .Include(request => request.Owner)
            .Where(request => request.Status == RequestStatus.Pending)
            .OrderBy(request => request.CreatedAt)
            .ToListAsync(cancellationToken);

        return await MapRequestsToDTOAsync(requests, cancellationToken);
    }

    public async Task<List<RequestListResponseDTO>> GetUserRequestsAsync(
        string ownerId,
        RequestType? requestType,
        CancellationToken cancellationToken = default) {

        var query = _dbContext.RequestSet
            .Include(request => request.Owner)
            .Where(request => request.OwnerId == ownerId);

        if (requestType.HasValue) {
            query = query.Where(request => request.Type == requestType.Value);
        }

        var requests = await _dbContext.RequestSet
            .OrderByDescending(request => request.CreatedAt)
            .ToListAsync(cancellationToken);

        return await MapRequestsToDTOAsync(requests, cancellationToken);
    }

    public async Task CreateRequestAsync(
        RequestType type,
        JsonElement details,
        string ownerId,
        bool isAdmin,
        CancellationToken cancellationToken
    ) {

        if (!Enum.IsDefined<RequestType>(type)) {
            throw new ArgumentException("Invalid request type.");
        }

        var handler = _creationHandlers.FirstOrDefault(xHandler => xHandler.Type == type)
        ?? throw new InvalidOperationException($"No creation handler registered for request type {type}");

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        var owner = await _dbContext.Users
            .Where(user => user.Id == ownerId)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new KeyNotFoundException("User not found.");

        var request = new Request {
            Type = type,
            Status = RequestStatus.Pending,
            OwnerId = ownerId,
            Owner = owner,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.RequestSet.Add(request);

        await handler.CreateDetailsAsync(request, details, cancellationToken);

        await _dbContext.SaveChangesAsync(cancellationToken);

        if (isAdmin) {
            await ResolveRequestAsync(request.Id, RequestStatus.Accepted, ownerId, _AUTOMATIC_ACCEPT_MESSAGE, cancellationToken);
        }

        await transaction.CommitAsync(cancellationToken);
    }
    public async Task DeleteRequestAsync(int requestId, string userId, CancellationToken cancellationToken) {
        var request = await _dbContext.RequestSet
            .Where(xRequest => xRequest.Id == requestId && xRequest.OwnerId == userId)
            .FirstOrDefaultAsync(cancellationToken);

        if (request == null) {
            throw new KeyNotFoundException("Request not found.");
        }

        if (request.Status != RequestStatus.Pending) {
            throw new InvalidOperationException("Only pending requests can be deleted.");
        }

        _dbContext.RequestSet.Remove(request);

        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task<RequestListResponseDTO> MapRequestToDTOAsync(Request request, CancellationToken cancellationToken = default) {
        var mapper = _mappers.FirstOrDefault(xRequest => xRequest.Type == request.Type);

        if (mapper == null) {
            throw new InvalidOperationException($"Mapper for requested type {request.Type} not found.");
        }

        var details = await mapper.MapAsync(request, cancellationToken);

        return new RequestListResponseDTO {
            Id = request.Id,
            Type = request.Type,
            Status = request.Status,
            OwnerId = request.OwnerId,
            OwnerUserName = request.Owner.UserName!,
            CreatedAt = request.CreatedAt,
            ResolvedAt = request.ResolvedAt,
            ResolutionMessage = request.ResolutionMessage,
            Details = details
        };
    }

    private async Task<List<RequestListResponseDTO>> MapRequestsToDTOAsync(List<Request> requests, CancellationToken cancellationToken) {
        var mappedRequests = new List<RequestListResponseDTO>();

        foreach (var request in requests) {
            mappedRequests.Add(await MapRequestToDTOAsync(request, cancellationToken));
        }

        return mappedRequests;
    }
}