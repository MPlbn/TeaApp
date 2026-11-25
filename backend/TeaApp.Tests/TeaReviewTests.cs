using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using TeaApp.Tests.Helpers;
using Xunit;

namespace TeaApp.Tests;

public class TeaReviewTests(TeaAppFactory factory) : IClassFixture<TeaAppFactory> {
    private readonly HttpClient _client = factory.CreateClient();
    private readonly AuthTestHelper _authHelper = new(factory.CreateClient(), factory);
    private readonly RequestTestHelper _requestHelper = new(factory.CreateClient());

    [Fact]
    public async Task GetReviews_ShouldReturnAllReviews() {
        var firstUser = await _authHelper.CreateAuthenticatedTestUserAsync();
        var secondUser = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var firstTeaId = await _requestHelper.CreatePrivateTeaAsync(firstUser);
            var secondTeaId = await _requestHelper.CreatePrivateTeaAsync(secondUser);

            var firstReviewId = await CreateReviewAsync(firstUser, firstTeaId);
            var secondReviewId = await CreateReviewAsync(secondUser, secondTeaId);

            using var response = await _client.GetAsync("/api/teareview");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var reviews = await response.Content.ReadFromJsonAsync<JsonElement>();
            var returnedIds = reviews.EnumerateArray()
                .Select(xReview => xReview.GetProperty("id").GetInt32())
                .ToList();

            Assert.Contains(firstReviewId, returnedIds);
            Assert.Contains(secondReviewId, returnedIds);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(firstUser);
            await _authHelper.CleanupTestUserAsync(secondUser);
        }
    }

    [Fact]
    public async Task GetReviews_ShouldFilterByTeaId() {
        var firstUser = await _authHelper.CreateAuthenticatedTestUserAsync();
        var secondUser = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var firstTeaId = await _requestHelper.CreatePrivateTeaAsync(firstUser);
            var secondTeaId = await _requestHelper.CreatePrivateTeaAsync(secondUser);

            var firstReviewId = await CreateReviewAsync(firstUser, firstTeaId);
            await CreateReviewAsync(secondUser, secondTeaId);

            using var response = await _client.GetAsync(
                $"/api/teareview?teaId={firstTeaId}");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var reviews = await response.Content.ReadFromJsonAsync<JsonElement>();
            var returnedIds = reviews.EnumerateArray()
                .Select(xReview => xReview.GetProperty("id").GetInt32())
                .ToList();

            Assert.Contains(firstReviewId, returnedIds);
            Assert.All(reviews.EnumerateArray(), xReview =>
                Assert.Equal(firstTeaId, xReview.GetProperty("teaId").GetInt32()));
        }
        finally {
            await _authHelper.CleanupTestUserAsync(firstUser);
            await _authHelper.CleanupTestUserAsync(secondUser);
        }
    }

    [Fact]
    public async Task CreateTeaReview_ShouldRequireAuthentication() {
        using var response = await _client.PostAsJsonAsync(
            "/api/teareview",
            CreateReviewDTO(1));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateTeaReview_ShouldWorkCorrectly() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);

            using var response = await SendAsync(
                user,
                HttpMethod.Post,
                "/api/teareview",
                CreateReviewDTO(teaId));

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            var review = await response.Content.ReadFromJsonAsync<JsonElement>();

            Assert.Equal(teaId, review.GetProperty("teaId").GetInt32());
            Assert.Equal(user.UserId, review.GetProperty("userId").GetString());
            Assert.Equal(user.UserName, review.GetProperty("userName").GetString());
            Assert.Equal("Test review", review.GetProperty("review").GetString());
            Assert.Equal(5, review.GetProperty("rating").GetInt32());
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task CreateTeaReview_ShouldRejectNonexistentTea() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            using var response = await SendAsync(
                user,
                HttpMethod.Post,
                "/api/teareview",
                CreateReviewDTO(999999999));

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task UpdateTeaReview_ShouldAllowOwner() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var firstTeaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var secondTeaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var reviewId = await CreateReviewAsync(user, firstTeaId);

            using var response = await SendAsync(
                user,
                HttpMethod.Put,
                $"/api/teareview/{reviewId}",
                CreateReviewDTO(secondTeaId, "Updated review", 4));

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            using var getResponse = await _client.GetAsync(
                $"/api/teareview?teaId={secondTeaId}");

            var reviews = await getResponse.Content.ReadFromJsonAsync<JsonElement>();
            var review = reviews.EnumerateArray()
                .Single(xReview => xReview.GetProperty("id").GetInt32() == reviewId);

            Assert.Equal("Updated review", review.GetProperty("review").GetString());
            Assert.Equal(4, review.GetProperty("rating").GetInt32());
            Assert.Equal(secondTeaId, review.GetProperty("teaId").GetInt32());
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task UpdateTeaReview_ShouldForbidOtherUser() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var otherUser = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);
            var reviewId = await CreateReviewAsync(owner, teaId);

            using var response = await SendAsync(
                otherUser,
                HttpMethod.Put,
                $"/api/teareview/{reviewId}",
                CreateReviewDTO(teaId, "Unauthorized update"));

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(otherUser);
        }
    }

    [Fact]
    public async Task UpdateTeaReview_ShouldReturnNotFoundForNonexistentReview() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);

            using var response = await SendAsync(
                user,
                HttpMethod.Put,
                "/api/teareview/999999999",
                CreateReviewDTO(teaId));

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task DeleteTeaReview_ShouldAllowOwner() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var reviewId = await CreateReviewAsync(user, teaId);

            using var response = await SendAsync(
                user, HttpMethod.Delete, $"/api/teareview/{reviewId}");

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            using var getResponse = await _client.GetAsync(
                $"/api/teareview?teaId={teaId}");

            var reviews = await getResponse.Content.ReadFromJsonAsync<JsonElement>();
            Assert.DoesNotContain(
                reviews.EnumerateArray(),
                xReview => xReview.GetProperty("id").GetInt32() == reviewId);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task DeleteTeaReview_ShouldForbidOtherUser() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var otherUser = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);
            var reviewId = await CreateReviewAsync(owner, teaId);

            using var response = await SendAsync(
                otherUser, HttpMethod.Delete, $"/api/teareview/{reviewId}");

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(otherUser);
        }
    }

    private async Task<int> CreateReviewAsync(TestUser user, int teaId) {
        using var response = await SendAsync(
            user,
            HttpMethod.Post,
            "/api/teareview",
            CreateReviewDTO(teaId));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var review = await response.Content.ReadFromJsonAsync<JsonElement>();

        return review.GetProperty("id").GetInt32();
    }

    private static object CreateReviewDTO(
        int teaId,
        string review = "Test review",
        int rating = 5
    ) {
        return new {
            teaId,
            review,
            rating
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