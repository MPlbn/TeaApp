using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Data;

namespace TeaApp.Api.Services;

public class RefreshTokenCleanupService(IServiceScopeFactory scopeFactory, ILogger<RefreshTokenCleanupService> logger) : BackgroundService {
    private const int RetentionDays = 5;
    private static readonly TimeSpan CleanupInterval = TimeSpan.FromDays(1);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
        logger.LogInformation("Refresh token cleanup service started.");
        try {
            await CleanupExpiredTokensAsync(stoppingToken);

            using var timer = new PeriodicTimer(CleanupInterval);

            while (await timer.WaitForNextTickAsync(stoppingToken)) {
                await CleanupExpiredTokensAsync(stoppingToken);
            }
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) {

        }
    }

    private async Task CleanupExpiredTokensAsync(CancellationToken stoppingToken) {
        try {
            using var scope = scopeFactory.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<TeaDbContext>();

            var cutoffDate = DateTime.UtcNow.AddDays(-RetentionDays);

            var deletedCount = await context.RefreshTokenSet
                .Where(token =>
                    (token.RevokedAtUtc != null &&
                    token.RevokedAtUtc < cutoffDate) ||
                    token.ExpiresAtUtc < cutoffDate)
                .ExecuteDeleteAsync(stoppingToken);

            if (deletedCount > 0) {
                logger.LogInformation(
                    "Refresh token cleanup removed {Count} records.",
                    deletedCount
                );
            }
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) {

        }
        catch (Exception exception) {
            logger.LogError(exception, "Refresh token cleanup failed.");
        }
    }
}