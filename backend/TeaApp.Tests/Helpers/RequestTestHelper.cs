
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using TeaApp.Api.DTOs;
using TeaApp.Api.DTOs.Request;
using TeaApp.Api.Models;

namespace TeaApp.Tests.Helpers;

public class RequestTestHelper(HttpClient client) {
    private readonly HttpClient _client = client;

    private static readonly JsonSerializerOptions _jsonOptions =
        new(JsonSerializerDefaults.Web);

    public async Task<int> CreatePrivateTeaAsync(TestUser User) {
        var teaName = $"Test Tea {Guid.NewGuid()}";

        using var response = await SendAsync(
            User,
            HttpMethod.Post,
            "/api/tea",
            new {
                name = teaName,
                type = TeaType.Green,
                price = 10.00m,
                origin = "Test Origin",
                shop = "Test Shop",
                description = "Test Description",
                isPublic = false,
                flavors = Array.Empty<FlavorType>()
            }
        );

        response.EnsureSuccessStatusCode();

        // POST /api/tea returns NoContent, so find the created tea
        // through the private teas endpoint.
        var page = 1;

        while (true) {
            using var teasResponse = await SendAsync(
                User,
                HttpMethod.Get,
                $"/api/tea/private?Page={page}&PageSize=50"
            );

            teasResponse.EnsureSuccessStatusCode();

            using var json = await teasResponse.Content.ReadFromJsonAsync<JsonDocument>();

            var root = json!.RootElement;

            var teas = root.GetProperty("items")
                .Deserialize<List<TeaListItemResponseDTO>>(_jsonOptions)!;

            var createdTea = teas.FirstOrDefault(xTea => xTea.Name == teaName);

            if (createdTea != null) {
                return createdTea.Id;
            }

            var totalPages = root.GetProperty("totalPages").GetInt32();

            if (page >= totalPages) {
                throw new InvalidOperationException(
                    "Created tea could not be found through the API."
                );
            }

            page++;
        }
    }

    public async Task<TeaResponseDTO> GetPrivateTeaAsync(
        TestUser User,
        int TeaId
    ) {
        using var response = await SendAsync(
            User,
            HttpMethod.Get,
            $"/api/tea/private/{TeaId}"
        );

        response.EnsureSuccessStatusCode();

        return (await response.Content.ReadFromJsonAsync<TeaResponseDTO>(_jsonOptions))!;
    }

    public async Task<RequestListResponseDTO> CreatePublishRequestAsync(
        TestUser User,
        int TeaId
    ) {
        using var response = await SendAsync(
            User,
            HttpMethod.Post,
            "/api/request",
            new {
                type = RequestType.Publish,
                details = new {
                    teaId = TeaId
                }
            }
        );

        response.EnsureSuccessStatusCode();

        var requests = await GetUserRequestsAsync(User);

        return requests.FirstOrDefault(xRequest =>
            xRequest.Type == RequestType.Publish &&
            xRequest.Details is JsonElement details &&
            details.TryGetProperty("teaId", out var teaId) &&
            teaId.GetInt32() == TeaId
        ) ?? throw new InvalidOperationException(
            "Created publish request could not be found."
        );
    }

    public async Task<List<RequestListResponseDTO>> GetUserRequestsAsync(
        TestUser User,
        RequestType? Type = null
    ) {
        var url = "/api/request/mine";

        if (Type.HasValue) {
            url += $"?RequestType={Type.Value}";
        }

        using var response = await SendAsync(
            User,
            HttpMethod.Get,
            url
        );

        response.EnsureSuccessStatusCode();

        return (await response.Content.ReadFromJsonAsync<List<RequestListResponseDTO>>(
            _jsonOptions
        ))!;
    }

    public async Task<List<RequestListResponseDTO>> GetPendingRequestsAsync(
        TestUser Admin
    ) {
        using var response = await SendAsync(
            Admin,
            HttpMethod.Get,
            "/api/request/pending"
        );

        response.EnsureSuccessStatusCode();

        return (await response.Content.ReadFromJsonAsync<List<RequestListResponseDTO>>(
            _jsonOptions
        ))!;
    }

    public async Task ResolveRequestAsync(
        TestUser Admin,
        int RequestId,
        RequestStatus Status,
        string? ResolutionMessage = null
    ) {
        using var response = await SendAsync(
            Admin,
            HttpMethod.Patch,
            $"/api/request/resolve/{RequestId}",
            new {
                status = Status,
                resolutionMessage = ResolutionMessage
            }
        );

        response.EnsureSuccessStatusCode();
    }

    public async Task CancelRequestAsync(
        TestUser User,
        int RequestId
    ) {
        using var response = await SendAsync(
            User,
            HttpMethod.Delete,
            $"/api/request/{RequestId}"
        );

        response.EnsureSuccessStatusCode();
    }

    public async Task<HttpResponseMessage> GetPendingRequestsResponseAsync(TestUser user) {
        return await SendAsync(user, HttpMethod.Get, "/api/request/pending");
    }

    public async Task<HttpResponseMessage> ResolveRequestResponseAsync(
        TestUser user,
        int requestId,
        RequestStatus status
    ) {
        return await SendAsync(
            user,
            HttpMethod.Patch,
            $"/api/request/resolve/{requestId}",
            new ResolveRequestDTO {
                Status = status
            }
        );
    }

    public async Task<HttpResponseMessage> CancelRequestResponseAsync(TestUser user, int requestId) {
        return await SendAsync(user, HttpMethod.Delete, $"/api/request/{requestId}");
    }

    public async Task<HttpResponseMessage> CreatePublishRequestResponseAsync(TestUser user, int teaId)
    => await SendAsync(user, HttpMethod.Post, "/api/request", new CreateRequestDTO {
        Type = RequestType.Publish,
        Details = JsonSerializer.SerializeToElement(new { teaId })
    });

    private async Task<HttpResponseMessage> SendAsync(
        TestUser User,
        HttpMethod Method,
        string Url,
        object? Content = null
    ) {
        var request = new HttpRequestMessage(Method, Url);

        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            User.AccessToken
        );

        if (Content != null) {
            request.Content = JsonContent.Create(Content, options: _jsonOptions);
        }

        return await _client.SendAsync(request);
    }
}
