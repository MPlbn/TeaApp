using System.Text.Json;
using TeaApp.Api.Models;

namespace TeaApp.Api.Services.Requests.Handlers;

public interface IRequestCreationHandler {
    RequestType Type { get; }

    Task CreateDetailsAsync(
        Request request,
        JsonElement details,
        CancellationToken cancellationToken
    );
}