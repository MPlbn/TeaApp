using TeaApp.Api.Models;

namespace TeaApp.Api.Services.Requests.Handlers;

public interface IRequestHandler {
    RequestType Type { get; }
    Task HandleAsync(
        Request request,
        RequestStatus status,
        CancellationToken cancellationToken = default
        );
    Task<bool> IsPendingRequestAlreadyPresent(
        string targetId,
        CancellationToken cancellationToken
    );
}