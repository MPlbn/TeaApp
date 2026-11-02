using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using TeaApp.Api.DTOs.Auth;
using TeaApp.Api.Models;

namespace TeaApp.Tests.Helpers;

public class AuthTestHelper(HttpClient uClient, TeaAppFactory uFactory) {
    private readonly HttpClient _client = uClient;
    private readonly TeaAppFactory _factory = uFactory;

    public async Task<TestUser> CreateAuthenticatedTestUserAsync() {
        var testUser = new TestUser {
            UserName = $"test_{Guid.NewGuid()}",
            Email = $"test_{Guid.NewGuid()}@test.test",
            Password = "Test1!"
        };

        try {
            var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequestDTO {
                UserName = testUser.UserName,
                Email = testUser.Email,
                Password = testUser.Password
            });

            Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);

            using var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequestDTO {
                Login = testUser.UserName,
                Password = testUser.Password
            });

            Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);

            using var loginJson = await loginResponse.Content.ReadFromJsonAsync<JsonDocument>();

            testUser.AccessToken = loginJson!.RootElement.GetProperty("token").GetString()!;
            testUser.RefreshToken = loginJson.RootElement.GetProperty("refreshToken").GetString()!;

            using var scope = _factory.Services.CreateScope();

            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var user = await userManager.FindByEmailAsync(testUser.Email);

            Assert.NotNull(user);

            testUser.UserId = user.Id;

            return testUser;
        }
        catch {
            await CleanupTestUserAsync(testUser);
            throw;
        }
    }

    public async Task CleanupTestUserAsync(TestUser uTestUser) {
        using var scope = _factory.Services.CreateScope();

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var user = await userManager.FindByNameAsync(uTestUser.UserName);

        if (user != null) {
            var result = await userManager.DeleteAsync(user);

            Assert.True(
                result.Succeeded,
                string.Join(", ", result.Errors.Select(x => x.Description))
            );
        }
    }
}