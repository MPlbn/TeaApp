using TeaApp.Api.Models;

namespace TeaApp.Api.Services.Requests.Mappers;

public interface IRequestResponseMapper {
    RequestType Type { get; }

    Task<object> MapAsync(Request request, CancellationToken cancellationToken = default);
}