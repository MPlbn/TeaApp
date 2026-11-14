using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;
using TeaApp.Api.Models;

namespace TeaApp.Api.Services;

public class PublishRequestCleanupService(
    IServiceScopeFactory scopeFactory,
    ILogger<PublishRequestCleanupService> logger
) : BackgroundService {
    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
    private readonly ILogger<PublishRequestCleanupService> _logger = logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
        using var timer = new PeriodicTimer(TimeSpan.FromHours(24));

        do {

            try {
                await CleanupPublishRequests(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) {
                break;
            }
            catch (Exception exception) {
                _logger.LogError(exception, "Error while cleaning up publish requests.");
            }

        } while (await timer.WaitForNextTickAsync(stoppingToken));
    }

    private async Task CleanupPublishRequests(CancellationToken stoppingToken) {
        await using var scope = _scopeFactory.CreateAsyncScope();

        var dbContext = scope.ServiceProvider.GetRequiredService<TeaDbContext>();

        var expirationDate = DateTime.UtcNow.AddDays(-14);

        var deletedCount = await dbContext.PublishRequestSet
        .Where(publishRequest => (publishRequest.Status == PublishRequestStatus.Accepted || publishRequest.Status == PublishRequestStatus.Rejected) &&
        publishRequest.ResolvedAt != null &&
        publishRequest.ResolvedAt < expirationDate)
        .ExecuteDeleteAsync(stoppingToken);

        _logger.LogInformation("Publish request cleanup completed. Deleted {Count} requests.", deletedCount);
    }
}