using TeaApp.Api.Data;
using TeaApp.Api.DTOs.PublishRequest;
using TeaApp.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TeaApp.Api.DTOs.Request;

namespace TeaApp.Api.Services.Requests.Handlers;

public class PublishRequestCreationHandler(TeaDbContext dbContext) : IRequestCreationHandler {
    private readonly TeaDbContext _dbContext = dbContext;
    public RequestType Type => RequestType.Publish;
    public async Task CreateDetailsAsync(Request request, JsonElement details, CancellationToken cancellationToken) {
        var publishRequestDTO = details.Deserialize<PublishRequestDetailsDTO>(
            new JsonSerializerOptions(JsonSerializerDefaults.Web)
        )
        ?? throw new ArgumentException("Invalid PublishRequest details.");

        var tea = await _dbContext.TeaDbSet
            .Where(xTea => xTea.Id == publishRequestDTO.TeaId)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new KeyNotFoundException("Tea not found.");

        if (tea.IsPublic) {
            throw new InvalidOperationException("Tea is already public.");
        }

        var publishRequest = new PublishRequest {
            Id = request.Id,
            Request = request,
            TeaId = tea.Id,
            Tea = tea
        };

        await _dbContext.PublishRequestSet.AddAsync(publishRequest, cancellationToken);

    }
}