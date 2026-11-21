using TeaApp.Api.Data;
using TeaApp.Api.DTOs.PublishRequest;
using TeaApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace TeaApp.Api.Services.Requests.Mappers;

public class PublishRequestResponseMapper(TeaDbContext dbContext) : IRequestResponseMapper {
    private readonly TeaDbContext _dbContext = dbContext;
    public RequestType Type => RequestType.Publish;
    public async Task<object> MapAsync(Request request, CancellationToken cancellationToken) {
        var publishRequest = await _dbContext.PublishRequestSet
           .Include(xRequest => xRequest.Tea)
           .FirstOrDefaultAsync(
               xRequest => xRequest.Id == request.Id,
               cancellationToken
           );

        if (publishRequest == null) {
            throw new InvalidOperationException("Publish request details not found.");
        }

        return new PublishRequestDetailsDTO {
            TeaId = publishRequest.TeaId,
        };
    }
}