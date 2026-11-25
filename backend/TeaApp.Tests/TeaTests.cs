
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using TeaApp.Api.Models;
using TeaApp.Tests.Helpers;

using Xunit;

namespace TeaApp.Tests;

public class TeaTests(TeaAppFactory factory) : IClassFixture<TeaAppFactory> {
    private readonly HttpClient _client = factory.CreateClient();
    private readonly AuthTestHelper _authHelper = new(factory.CreateClient(), factory);
    private readonly RequestTestHelper _requestHelper = new(factory.CreateClient());

    [Fact]
    public async Task GetPrivateTeas_ShouldRequireAuthentication() {
        var response = await _client.GetAsync("/api/tea/private?Page=1&PageSize=50");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetPrivateTeas_ShouldReturnOnlyOwnTeas() {
        var firstUser = await _authHelper.CreateAuthenticatedTestUserAsync();
        var secondUser = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var firstTeaId = await _requestHelper.CreatePrivateTeaAsync(firstUser);
            var secondTeaId = await _requestHelper.CreatePrivateTeaAsync(secondUser);

            using var response = await SendAsync(
                firstUser,
                HttpMethod.Get,
                "/api/tea/private?Page=1&PageSize=50"
            );

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.ReadFromJsonAsync<JsonElement>();
            var items = result.GetProperty("items");

            var returnedIds = items
                .EnumerateArray()
                .Select(xTea => xTea.GetProperty("id").GetInt32())
                .ToList();

            Assert.Contains(firstTeaId, returnedIds);
            Assert.DoesNotContain(secondTeaId, returnedIds);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(firstUser);
            await _authHelper.CleanupTestUserAsync(secondUser);
        }
    }

    [Fact]
    public async Task GetPrivateTea_ShouldAllowOwner() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);

            using var response = await SendAsync(
                owner,
                HttpMethod.Get,
                $"/api/tea/private/{teaId}"
            );

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
        }
    }

    [Fact]
    public async Task GetPrivateTea_ShouldNotAllowOtherUser() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var otherUser = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);

            using var response = await SendAsync(
                otherUser,
                HttpMethod.Get,
                $"/api/tea/private/{teaId}"
            );

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(otherUser);
        }
    }

    [Fact]
    public async Task GetPrivateTea_ShouldAllowAdmin() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var admin = await _authHelper.CreateAuthenticatedTestUserAsync(true);

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);

            using var response = await SendAsync(
                admin,
                HttpMethod.Get,
                $"/api/tea/private/{teaId}"
            );

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task GetPublicTea_ShouldReturnNotFoundForPrivateTea() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);

            using var response = await _client.GetAsync($"/api/tea/public/{teaId}");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
        }
    }

    [Fact]
    public async Task GetPublicTeas_ShouldReturnOnlyPublicTeas() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();
        var admin = await _authHelper.CreateAuthenticatedTestUserAsync(isAdmin: true);

        try {
            var privateTeaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var publicTeaId = await CreatePublicTeaAsync(admin);

            using var response = await _client.GetAsync("/api/tea/public?Page=1&PageSize=50");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.ReadFromJsonAsync<JsonElement>();
            var items = result.GetProperty("items");
            var returnedIds = items.EnumerateArray()
                .Select(xTea => xTea.GetProperty("id").GetInt32())
                .ToList();

            Assert.Contains(publicTeaId, returnedIds);
            Assert.DoesNotContain(privateTeaId, returnedIds);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
            await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task GetPublicTea_ShouldReturnNotFoundForNonexistentTea() {
        using var response = await _client.GetAsync("/api/tea/public/999999999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateTea_ShouldRequireAuthentication() {
        using var response = await _client.PostAsJsonAsync("/api/tea", CreateTeaDTO("Unauthenticated tea"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateTea_ShouldCreatePrivateTeaForUser() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();
        var teaName = $"Test tea {Guid.NewGuid()}";

        try {
            using var response = await SendAsync(
                user, HttpMethod.Post, "/api/tea", CreateTeaDTO(teaName));

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            var teaId = await GetPrivateTeaIdByNameAsync(user, teaName);

            using var teaResponse = await SendAsync(
                user, HttpMethod.Get, $"/api/tea/private/{teaId}");

            Assert.Equal(HttpStatusCode.OK, teaResponse.StatusCode);

            var tea = await teaResponse.Content.ReadFromJsonAsync<JsonElement>();
            Assert.False(tea.GetProperty("isPublic").GetBoolean());
            Assert.Equal(user.UserId, tea.GetProperty("ownerId").GetString());
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task CreateTea_ShouldNotAllowUserToCreatePublicTea() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();
        var teaName = $"Test tea {Guid.NewGuid()}";

        try {
            using var response = await SendAsync(
                user, HttpMethod.Post, "/api/tea",
                CreateTeaDTO(teaName, isPublic: true));

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            var teaId = await GetPrivateTeaIdByNameAsync(user, teaName);

            using var privateResponse = await SendAsync(
                user, HttpMethod.Get, $"/api/tea/private/{teaId}");

            Assert.Equal(HttpStatusCode.OK, privateResponse.StatusCode);

            var tea = await privateResponse.Content.ReadFromJsonAsync<JsonElement>();

            Assert.False(tea.GetProperty("isPublic").GetBoolean());
            Assert.Equal(user.UserId, tea.GetProperty("ownerId").GetString());

            using var publicResponse = await _client.GetAsync(
                $"/api/tea/public/{teaId}");

            Assert.Equal(HttpStatusCode.NotFound, publicResponse.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task CreateTea_ShouldAllowAdminToCreatePublicTea() {
        var admin = await _authHelper.CreateAuthenticatedTestUserAsync(isAdmin: true);
        var teaName = $"Test tea {Guid.NewGuid()}";

        try {
            using var response = await SendAsync(
                admin, HttpMethod.Post, "/api/tea", CreateTeaDTO(teaName, isPublic: true));

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            var teaId = await GetPublicTeaIdByNameAsync(teaName);
            using var teaResponse = await _client.GetAsync($"/api/tea/public/{teaId}");

            Assert.Equal(HttpStatusCode.OK, teaResponse.StatusCode);

            var tea = await teaResponse.Content.ReadFromJsonAsync<JsonElement>();
            Assert.True(tea.GetProperty("isPublic").GetBoolean());
            Assert.Null(tea.GetProperty("ownerId").GetString());
        }
        finally {
            await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task UpdateTea_ShouldAllowOwner() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();
        var teaId = await _requestHelper.CreatePrivateTeaAsync(user);
        var updatedName = $"Updated tea {Guid.NewGuid()}";

        try {
            using var response = await SendAsync(
                user, HttpMethod.Put, $"/api/tea/{teaId}", CreateTeaDTO(updatedName));

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            using var teaResponse = await SendAsync(
                user, HttpMethod.Get, $"/api/tea/private/{teaId}");

            Assert.Equal(HttpStatusCode.OK, teaResponse.StatusCode);

            var tea = await teaResponse.Content.ReadFromJsonAsync<JsonElement>();
            Assert.Equal(updatedName, tea.GetProperty("name").GetString());
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task UpdateTea_ShouldForbidOtherUser() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var otherUser = await _authHelper.CreateAuthenticatedTestUserAsync();
        var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);

        try {
            using var response = await SendAsync(
                otherUser, HttpMethod.Put, $"/api/tea/{teaId}", CreateTeaDTO("Unauthorized update"));

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(otherUser);
        }
    }

    [Fact]
    public async Task UpdateTea_ShouldAllowAdminToUpdatePublicTea() {
        var admin = await _authHelper.CreateAuthenticatedTestUserAsync(isAdmin: true);
        var teaId = await CreatePublicTeaAsync(admin);
        var updatedName = $"Updated public tea {Guid.NewGuid()}";

        try {
            using var response = await SendAsync(
                admin, HttpMethod.Put, $"/api/tea/{teaId}", CreateTeaDTO(updatedName));

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            using var teaResponse = await _client.GetAsync($"/api/tea/public/{teaId}");
            var tea = await teaResponse.Content.ReadFromJsonAsync<JsonElement>();

            Assert.Equal(updatedName, tea.GetProperty("name").GetString());
        }
        finally {
            await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task UpdateTea_ShouldReturnConflictForPendingPublishRequest() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();
        var teaId = await _requestHelper.CreatePrivateTeaAsync(user);

        try {
            await _requestHelper.CreatePublishRequestAsync(user, teaId);

            using var response = await SendAsync(
                user, HttpMethod.Put, $"/api/tea/{teaId}", CreateTeaDTO("Updated tea"));

            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task UnpublishTea_ShouldAllowOwner() {
        var admin = await _authHelper.CreateAuthenticatedTestUserAsync(isAdmin: true);
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var teaId = await CreatePublicTeaAsync(admin);

        // Admin-created public teas have no owner, so use a user's tea published
        // through the request flow for this scenario.
        try {
            var privateTeaId = await _requestHelper.CreatePrivateTeaAsync(owner);
            var request = await _requestHelper.CreatePublishRequestAsync(owner, privateTeaId);
            await _requestHelper.ResolveRequestAsync(admin, request.Id, RequestStatus.Accepted, "Approved");

            using var response = await SendAsync(
                owner, HttpMethod.Patch, $"/api/tea/{privateTeaId}/unpublish");

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            using var publicResponse = await _client.GetAsync($"/api/tea/public/{privateTeaId}");
            Assert.Equal(HttpStatusCode.NotFound, publicResponse.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task UnpublishTea_ShouldForbidOtherUser() {
        var admin = await _authHelper.CreateAuthenticatedTestUserAsync(isAdmin: true);
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var otherUser = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);
            var request = await _requestHelper.CreatePublishRequestAsync(owner, teaId);
            await _requestHelper.ResolveRequestAsync(admin, request.Id, RequestStatus.Accepted, "Approved");

            using var response = await SendAsync(
                otherUser, HttpMethod.Patch, $"/api/tea/{teaId}/unpublish");

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(otherUser);
            await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task UnpublishTea_ShouldRejectTeaWithoutOwner() {
        var admin = await _authHelper.CreateAuthenticatedTestUserAsync(isAdmin: true);
        var teaId = await CreatePublicTeaAsync(admin);

        try {
            using var response = await SendAsync(
                admin, HttpMethod.Patch, $"/api/tea/{teaId}/unpublish");

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task DeleteTea_ShouldAllowOwner() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();
        var teaId = await _requestHelper.CreatePrivateTeaAsync(user);

        try {
            using var response = await SendAsync(user, HttpMethod.Delete, $"/api/tea/{teaId}");

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            using var getResponse = await SendAsync(
                user, HttpMethod.Get, $"/api/tea/private/{teaId}");

            Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task DeleteTea_ShouldForbidOtherUser() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var otherUser = await _authHelper.CreateAuthenticatedTestUserAsync();
        var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);

        try {
            using var response = await SendAsync(
                otherUser, HttpMethod.Delete, $"/api/tea/{teaId}");

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(otherUser);
        }
    }

    [Fact]
    public async Task DeleteTea_ShouldAllowAdminToDeletePublicTea() {
        var admin = await _authHelper.CreateAuthenticatedTestUserAsync(isAdmin: true);
        var teaId = await CreatePublicTeaAsync(admin);

        try {
            using var response = await SendAsync(
                admin, HttpMethod.Delete, $"/api/tea/{teaId}");

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            using var getResponse = await _client.GetAsync($"/api/tea/public/{teaId}");
            Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(admin);
        }
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

    private async Task<int> CreatePublicTeaAsync(TestUser admin) {
        var teaName = $"Public tea {Guid.NewGuid()}";

        using var response = await SendAsync(
            admin, HttpMethod.Post, "/api/tea", CreateTeaDTO(teaName, isPublic: true));

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        return await GetPublicTeaIdByNameAsync(teaName);
    }

    private async Task<int> GetPublicTeaIdByNameAsync(string teaName) {
        using var response = await _client.GetAsync("/api/tea/public?Page=1&PageSize=50");
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        var items = result.GetProperty("items");

        return items.EnumerateArray()
            .Where(xTea => xTea.GetProperty("name").GetString() == teaName)
            .Select(xTea => xTea.GetProperty("id").GetInt32())
            .Single();
    }

    private async Task<int> GetPrivateTeaIdByNameAsync(TestUser user, string teaName) {
        using var response = await SendAsync(
            user, HttpMethod.Get, "/api/tea/private?Page=1&PageSize=50");

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        var items = result.GetProperty("items");

        return items.EnumerateArray()
            .Where(xTea => xTea.GetProperty("name").GetString() == teaName)
            .Select(xTea => xTea.GetProperty("id").GetInt32())
            .Single();
    }

    private static object CreateTeaDTO(string name, bool isPublic = false) {
        return new {
            name,
            type = TeaType.Green,
            price = 10.00m,
            origin = "Test origin",
            shop = "Test shop",
            description = "Test description",
            isPublic,
            flavors = Array.Empty<int>()
        };
    }
}
