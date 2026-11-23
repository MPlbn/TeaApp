
using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
using TeaApp.Api.Models;

namespace TeaApp.Api.Services.Requests.Handlers;

public class PublishRequestHandler(TeaDbContext dbContext) : IRequestHandler {
    private readonly TeaDbContext _dbContext = dbContext;

    public RequestType Type => RequestType.Publish;

    public async Task HandleAsync(
        Request request,
        RequestStatus status,
        CancellationToken cancellationToken = default
    ) {
        var publishRequest = await _dbContext.PublishRequestSet
        .Include(publishRequest => publishRequest.Tea)
        .FirstOrDefaultAsync(publishRequest => publishRequest.Id == request.Id, cancellationToken)
        ?? throw new InvalidOperationException("Publish request details not found.");

        switch (status) {
            case RequestStatus.Accepted:
                publishRequest.Tea.IsPublic = true;
                break;
            case RequestStatus.Rejected:
                break;

            default:
                throw new ArgumentException("Invalid request status.");
        }
    }

    public async Task<bool> IsPendingRequestAlreadyPresent(
        string targetId,
        CancellationToken cancellationToken
    ) {
        if (!int.TryParse(targetId, out var teaId)) {
            throw new ArgumentException("Invalid tea ID.");
        }

        return await _dbContext.PublishRequestSet
            .AnyAsync(request => request.TeaId == teaId && request.Request.Status == RequestStatus.Pending, cancellationToken);
    }
}