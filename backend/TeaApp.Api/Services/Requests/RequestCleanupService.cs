using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
using TeaApp.Api.Models;

namespace TeaApp.Api.Services.Requests;

public class RequestCleanupService(
    IServiceScopeFactory scopeFactory,
    ILogger<RequestCleanupService> logger
) : BackgroundService {
    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
    private readonly ILogger<RequestCleanupService> _logger = logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
        using var timer = new PeriodicTimer(TimeSpan.FromHours(24));

        do {

            try {
                await CleanupRequests(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) {
                break;
            }
            catch (Exception exception) {
                _logger.LogError(exception, "Error while cleaning up publish requests.");
            }

        } while (await timer.WaitForNextTickAsync(stoppingToken));
    }

    private async Task CleanupRequests(CancellationToken stoppingToken) {
        await using var scope = _scopeFactory.CreateAsyncScope();

        var dbContext = scope.ServiceProvider.GetRequiredService<TeaDbContext>();

        var expirationDate = DateTime.UtcNow.AddDays(-14);

        var deletedCount = await dbContext.RequestSet
        .Where(request => (request.Status == RequestStatus.Accepted || request.Status == RequestStatus.Rejected) &&
        request.ResolvedAt != null &&
        request.ResolvedAt < expirationDate)
        .ExecuteDeleteAsync(stoppingToken);

        _logger.LogInformation("Request cleanup completed. Deleted {Count} requests.", deletedCount);
    }
}