using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace TeaApp.Tests;

public class TeaAppFactory : WebApplicationFactory<Program> {
    protected override void ConfigureWebHost(IWebHostBuilder builder) {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration((context, config) => {
            var connectionString = Environment.GetEnvironmentVariable("TEST_API_CONNECTION_STRING")
                ?? throw new InvalidOperationException("TEST_API_CONNECTION_STRING missing.");

            var jwtKey = Environment.GetEnvironmentVariable("TEST_JWT_KEY") ?? throw new InvalidOperationException("TEST_JWT_KEY missing.");
            var jwtIssuer = Environment.GetEnvironmentVariable("TEST_JWT_ISSUER") ?? throw new InvalidOperationException("TEST_JWT_ISSUER missing.");
            var jwtAudience = Environment.GetEnvironmentVariable("TEST_JWT_AUDIENCE") ?? throw new InvalidOperationException("TEST_JWT_AUDIENCE missing.");

            config.AddInMemoryCollection(new Dictionary<string, string?> {
                ["ConnectionStrings:TeaDatabase"] = connectionString,
                ["Jwt:Key"] = jwtKey,
                ["Jwt:Issuer"] = jwtIssuer,
                ["Jwt:Audience"] = jwtAudience
            });
        });
    }
}