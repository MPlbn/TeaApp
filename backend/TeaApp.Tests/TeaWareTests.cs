
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using TeaApp.Tests.Helpers;
using Xunit;

namespace TeaApp.Tests;

public class TeaWareTests(TeaAppFactory factory) : IClassFixture<TeaAppFactory> {
    private readonly HttpClient _client = factory.CreateClient();
    private readonly AuthTestHelper _authHelper = new(factory.CreateClient(), factory);

    [Fact]
    public async Task GetTeaWare_ShouldRequireAuthentication() {
        using var response = await _client.GetAsync("/api/teaware");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetTeaWare_ShouldReturnOnlyOwnTeaWare() {
        var firstUser = await _authHelper.CreateAuthenticatedTestUserAsync();
        var secondUser = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var firstTeaWareId = await CreateTeaWareAsync(firstUser, "First teaware");
            var secondTeaWareId = await CreateTeaWareAsync(secondUser, "Second teaware");

            using var response = await SendAsync(firstUser, HttpMethod.Get, "/api/teaware");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.ReadFromJsonAsync<JsonElement>();
            var returnedIds = result.EnumerateArray()
                .Select(xTeaWare => xTeaWare.GetProperty("id").GetInt32())
                .ToList();

            Assert.Contains(firstTeaWareId, returnedIds);
            Assert.DoesNotContain(secondTeaWareId, returnedIds);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(firstUser);
            await _authHelper.CleanupTestUserAsync(secondUser);
        }
    }

    [Fact]
    public async Task CreateTeaWare_ShouldRequireAuthentication() {
        using var response = await _client.PostAsJsonAsync(
            "/api/teaware", CreateTeaWareDTO("Unauthenticated teaware"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateTeaWare_ShouldWorkCorrectly() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();
        var teaWareName = $"Test teaware {Guid.NewGuid()}";

        try {
            using var response = await SendAsync(
                user, HttpMethod.Post, "/api/teaware", CreateTeaWareDTO(teaWareName));

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            var teaWareId = await GetTeaWareIdByNameAsync(user, teaWareName);

            using var getResponse = await SendAsync(
                user, HttpMethod.Get, "/api/teaware");

            var result = await getResponse.Content.ReadFromJsonAsync<JsonElement>();
            var teaWare = result.EnumerateArray()
                .Single(xTeaWare => xTeaWare.GetProperty("id").GetInt32() == teaWareId);

            Assert.Equal(teaWareName, teaWare.GetProperty("name").GetString());
            Assert.Equal(150, teaWare.GetProperty("capacity").GetInt32());
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task CreateTeaWare_ShouldReturnConflictWhenLimitReached() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            for (var i = 0; i < 50; i++) {
                using var response = await SendAsync(
                    user,
                    HttpMethod.Post,
                    "/api/teaware",
                    CreateTeaWareDTO($"Test teaware {i}"));

                Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
            }

            using var conflictResponse = await SendAsync(
                user,
                HttpMethod.Post,
                "/api/teaware",
                CreateTeaWareDTO("51st teaware"));

            Assert.Equal(HttpStatusCode.Conflict, conflictResponse.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task EditTeaWare_ShouldAllowOwner() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();
        var teaWareId = await CreateTeaWareAsync(user, "Original teaware");
        var updatedName = $"Updated teaware {Guid.NewGuid()}";

        try {
            using var response = await SendAsync(
                user,
                HttpMethod.Put,
                $"/api/teaware/{teaWareId}",
                CreateTeaWareDTO(updatedName, 250));

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            using var getResponse = await SendAsync(user, HttpMethod.Get, "/api/teaware");

            var result = await getResponse.Content.ReadFromJsonAsync<JsonElement>();
            var teaWare = result.EnumerateArray()
                .Single(xTeaWare => xTeaWare.GetProperty("id").GetInt32() == teaWareId);

            Assert.Equal(updatedName, teaWare.GetProperty("name").GetString());
            Assert.Equal(250, teaWare.GetProperty("capacity").GetInt32());
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task EditTeaWare_ShouldForbidOtherUser() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var otherUser = await _authHelper.CreateAuthenticatedTestUserAsync();
        var teaWareId = await CreateTeaWareAsync(owner, "Original teaware");

        try {
            using var response = await SendAsync(
                otherUser,
                HttpMethod.Put,
                $"/api/teaware/{teaWareId}",
                CreateTeaWareDTO("Unauthorized update"));

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(otherUser);
        }
    }

    [Fact]
    public async Task DeleteTeaWare_ShouldAllowOwner() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();
        var teaWareId = await CreateTeaWareAsync(user, "Teaware to delete");

        try {
            using var response = await SendAsync(
                user, HttpMethod.Delete, $"/api/teaware/{teaWareId}");

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            using var getResponse = await SendAsync(user, HttpMethod.Get, "/api/teaware");

            var result = await getResponse.Content.ReadFromJsonAsync<JsonElement>();
            var returnedIds = result.EnumerateArray()
                .Select(xTeaWare => xTeaWare.GetProperty("id").GetInt32())
                .ToList();

            Assert.DoesNotContain(teaWareId, returnedIds);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task DeleteTeaWare_ShouldForbidOtherUser() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var otherUser = await _authHelper.CreateAuthenticatedTestUserAsync();
        var teaWareId = await CreateTeaWareAsync(owner, "Teaware to delete");

        try {
            using var response = await SendAsync(
                otherUser, HttpMethod.Delete, $"/api/teaware/{teaWareId}");

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(otherUser);
        }
    }

    private async Task<int> CreateTeaWareAsync(TestUser user, string name) {
        using var response = await SendAsync(
            user, HttpMethod.Post, "/api/teaware", CreateTeaWareDTO(name));

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        return await GetTeaWareIdByNameAsync(user, name);
    }

    private async Task<int> GetTeaWareIdByNameAsync(TestUser user, string name) {
        using var response = await SendAsync(user, HttpMethod.Get, "/api/teaware");

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<JsonElement>();

        return result.EnumerateArray()
            .Where(xTeaWare => xTeaWare.GetProperty("name").GetString() == name)
            .Select(xTeaWare => xTeaWare.GetProperty("id").GetInt32())
            .Single();
    }

    private static object CreateTeaWareDTO(string name, int capacity = 150) {
        return new {
            name,
            capacity
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
