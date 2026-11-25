
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using TeaApp.Api.Models;
using TeaApp.Tests.Helpers;
using Xunit;

namespace TeaApp.Tests;

public class BrewingMethodTests(TeaAppFactory factory) : IClassFixture<TeaAppFactory> {
    private readonly HttpClient _client = factory.CreateClient();
    private readonly AuthTestHelper _authHelper = new(factory.CreateClient(), factory);
    private readonly RequestTestHelper _requestHelper = new(factory.CreateClient());

    [Fact]
    public async Task GetBrewingMethods_ShouldReturnAllMethods() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var firstMethodId = await CreateBrewingMethodAsync(user, teaId);
            var secondMethodId = await CreateBrewingMethodAsync(user, teaId);

            using var response = await _client.GetAsync("/api/brewingmethod");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.ReadFromJsonAsync<JsonElement>();
            var returnedIds = result.EnumerateArray()
                .Select(xMethod => xMethod.GetProperty("id").GetInt32())
                .ToList();

            Assert.Contains(firstMethodId, returnedIds);
            Assert.Contains(secondMethodId, returnedIds);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task GetBrewingMethods_ShouldFilterByTeaId() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var firstTeaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var secondTeaId = await _requestHelper.CreatePrivateTeaAsync(user);

            var firstMethodId = await CreateBrewingMethodAsync(user, firstTeaId);
            var secondMethodId = await CreateBrewingMethodAsync(user, secondTeaId);

            using var response = await _client.GetAsync(
                $"/api/brewingmethod?teaId={firstTeaId}");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.ReadFromJsonAsync<JsonElement>();
            var returnedIds = result.EnumerateArray()
                .Select(xMethod => xMethod.GetProperty("id").GetInt32())
                .ToList();

            Assert.Contains(firstMethodId, returnedIds);
            Assert.DoesNotContain(secondMethodId, returnedIds);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task CreateBrewingMethod_ShouldRequireAuthentication() {
        using var response = await _client.PostAsJsonAsync(
            "/api/brewingmethod", CreateBrewingMethodDTO(1));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateBrewingMethod_ShouldAllowOwner() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);

            using var response = await SendAsync(
                user, HttpMethod.Post, "/api/brewingmethod",
                CreateBrewingMethodDTO(teaId));

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            var result = await response.Content.ReadFromJsonAsync<JsonElement>();

            Assert.Equal(teaId, result.GetProperty("teaId").GetInt32());
            Assert.Equal(95, result.GetProperty("temperature").GetInt32());
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task CreateBrewingMethod_ShouldForbidOtherUser() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var otherUser = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);

            using var response = await SendAsync(
                otherUser, HttpMethod.Post, "/api/brewingmethod",
                CreateBrewingMethodDTO(teaId));

            // Controller returns Unauthorized(), not Forbid().
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(otherUser);
        }
    }

    [Fact]
    public async Task CreateBrewingMethod_ShouldAllowAdmin() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var admin = await _authHelper.CreateAuthenticatedTestUserAsync(isAdmin: true);

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);

            using var response = await SendAsync(
                admin, HttpMethod.Post, "/api/brewingmethod",
                CreateBrewingMethodDTO(teaId));

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task CreateBrewingMethod_ShouldReturnConflictWhenLimitReached() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);

            for (var i = 0; i < 50; i++) {
                using var response = await SendAsync(
                    user, HttpMethod.Post, "/api/brewingmethod",
                    CreateBrewingMethodDTO(teaId));

                Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            }

            using var conflictResponse = await SendAsync(
                user, HttpMethod.Post, "/api/brewingmethod",
                CreateBrewingMethodDTO(teaId));

            Assert.Equal(HttpStatusCode.Conflict, conflictResponse.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task UpdateBrewingMethod_ShouldAllowOwner() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var methodId = await CreateBrewingMethodAsync(user, teaId);

            using var response = await SendAsync(
                user, HttpMethod.Put, $"/api/brewingmethod/{methodId}",
                CreateBrewingMethodDTO(teaId, temperature: 85));

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            using var getResponse = await _client.GetAsync(
                $"/api/brewingmethod?teaId={teaId}");

            var result = await getResponse.Content.ReadFromJsonAsync<JsonElement>();
            var method = result.EnumerateArray()
                .Single(xMethod => xMethod.GetProperty("id").GetInt32() == methodId);

            Assert.Equal(85, method.GetProperty("temperature").GetInt32());
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task UpdateBrewingMethod_ShouldForbidOtherUser() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var otherUser = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);
            var methodId = await CreateBrewingMethodAsync(owner, teaId);

            using var response = await SendAsync(
                otherUser, HttpMethod.Put, $"/api/brewingmethod/{methodId}",
                CreateBrewingMethodDTO(teaId));

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(otherUser);
        }
    }

    [Fact]
    public async Task DeleteBrewingMethod_ShouldAllowOwner() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var methodId = await CreateBrewingMethodAsync(user, teaId);

            using var response = await SendAsync(
                user, HttpMethod.Delete, $"/api/brewingmethod/{methodId}");

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            using var getResponse = await _client.GetAsync(
                $"/api/brewingmethod?teaId={teaId}");

            var result = await getResponse.Content.ReadFromJsonAsync<JsonElement>();
            var returnedIds = result.EnumerateArray()
                .Select(xMethod => xMethod.GetProperty("id").GetInt32())
                .ToList();

            Assert.DoesNotContain(methodId, returnedIds);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task DeleteBrewingMethod_ShouldForbidOtherUser() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var otherUser = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);
            var methodId = await CreateBrewingMethodAsync(owner, teaId);

            using var response = await SendAsync(
                otherUser, HttpMethod.Delete, $"/api/brewingmethod/{methodId}");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(otherUser);
        }
    }

    private async Task<int> CreateBrewingMethodAsync(TestUser user, int teaId) {
        using var response = await SendAsync(
            user, HttpMethod.Post, "/api/brewingmethod",
            CreateBrewingMethodDTO(teaId));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        return result.GetProperty("id").GetInt32();
    }

    private static object CreateBrewingMethodDTO(
        int teaId,
        int temperature = 95
    ) {
        return new {
            teaId,
            method = 0,
            temperature,
            amountPerHundred = 5,
            brewingTimes = new[] { 10, 15, 20 },
            gongfuBrewingTimeIncrement = 5
        };
    }

    private async Task<HttpResponseMessage> SendAsync(
        TestUser user,
        HttpMethod method,
        string url,
        object? body = null
    ) {
        using var request = new HttpRequestMessage(method, url);

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", user.AccessToken);

        if (body != null) {
            request.Content = JsonContent.Create(body);
        }

        return await _client.SendAsync(request);
    }
}
