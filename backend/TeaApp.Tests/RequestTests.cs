using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http.HttpResults;
using TeaApp.Api.DTOs.Request;
using TeaApp.Api.Models;
using TeaApp.Tests.Helpers;

namespace TeaApp.Tests;

public class RequestTests(TeaAppFactory factory) : IClassFixture<TeaAppFactory> {
    private readonly HttpClient _client = factory.CreateClient();
    private readonly AuthTestHelper _authHelper = new(factory.CreateClient(), factory);
    private readonly RequestTestHelper _requestHelper = new(factory.CreateClient());

    [Fact]
    public async Task CreateRequest_ShouldWorkCorrectly() {
        TestUser? user = null;
        TestUser? admin = null;

        try {
            user = await _authHelper.CreateAuthenticatedTestUserAsync();
            admin = await _authHelper.CreateAuthenticatedTestUserAsync(true);

            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var createdRequest = await _requestHelper.CreatePublishRequestAsync(user, teaId);

            Assert.Equal(RequestType.Publish, createdRequest.Type);
            Assert.Equal(RequestStatus.Pending, createdRequest.Status);
            Assert.Equal(user.UserId, createdRequest.OwnerId);
            Assert.Equal(teaId, GetTeaId(createdRequest));

            var userRequests = await _requestHelper.GetUserRequestsAsync(user);
            var pendingRequests = await _requestHelper.GetPendingRequestsAsync(admin);

            Assert.Contains(userRequests, xRequest => xRequest.Id == createdRequest.Id);
            Assert.Contains(pendingRequests, xRequest => xRequest.Id == createdRequest.Id);
        }
        finally {
            if (user != null) await _authHelper.CleanupTestUserAsync(user);
            if (admin != null) await _authHelper.CleanupTestUserAsync(admin);
        }

    }

    [Fact]
    public async Task CancelRequest_ShouldWorkCorrectly() {
        TestUser? user = null;
        TestUser? admin = null;

        try {
            user = await _authHelper.CreateAuthenticatedTestUserAsync();
            admin = await _authHelper.CreateAuthenticatedTestUserAsync(true);

            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var createdRequest = await _requestHelper.CreatePublishRequestAsync(user, teaId);

            await _requestHelper.CancelRequestAsync(user, createdRequest.Id);

            var userRequests = await _requestHelper.GetUserRequestsAsync(user);
            var pendingRequests = await _requestHelper.GetPendingRequestsAsync(admin);

            Assert.DoesNotContain(userRequests, xRequest => xRequest.Id == createdRequest.Id);
            Assert.DoesNotContain(pendingRequests, xRequest => xRequest.Id == createdRequest.Id);
        }
        finally {
            if (user != null) await _authHelper.CleanupTestUserAsync(user);
            if (admin != null) await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task GetPendingRequests_ShouldWorkCorrectly() {
        TestUser? user = null;
        TestUser? admin = null;

        try {
            user = await _authHelper.CreateAuthenticatedTestUserAsync();
            admin = await _authHelper.CreateAuthenticatedTestUserAsync(true);

            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var createdRequest = await _requestHelper.CreatePublishRequestAsync(user, teaId);

            var pendingRequests = await _requestHelper.GetPendingRequestsAsync(admin);

            Assert.Contains(pendingRequests, xRequest => xRequest.Id == createdRequest.Id);
            Assert.Equal(RequestStatus.Pending,
                pendingRequests.First(xRequest => xRequest.Id == createdRequest.Id).Status);
        }
        finally {
            if (user != null) await _authHelper.CleanupTestUserAsync(user);
            if (admin != null) await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task GetUserRequests_ShouldWorkCorrectly() {
        TestUser? user = null;
        TestUser? admin = null;

        try {
            user = await _authHelper.CreateAuthenticatedTestUserAsync();
            admin = await _authHelper.CreateAuthenticatedTestUserAsync(true);

            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var createdRequest = await _requestHelper.CreatePublishRequestAsync(user, teaId);

            var userRequests = await _requestHelper.GetUserRequestsAsync(user);

            Assert.Contains(userRequests, xRequest => xRequest.Id == createdRequest.Id);
            Assert.Equal(user.UserId, userRequests.First(xRequest =>
                xRequest.Id == createdRequest.Id).OwnerId);
        }
        finally {
            if (user != null) await _authHelper.CleanupTestUserAsync(user);
            if (admin != null) await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task PublishRequestAcceptFlow_ShouldWorkCorrectly() {
        TestUser? user = null;
        TestUser? admin = null;

        try {
            user = await _authHelper.CreateAuthenticatedTestUserAsync();
            admin = await _authHelper.CreateAuthenticatedTestUserAsync(true);

            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var createdRequest = await _requestHelper.CreatePublishRequestAsync(user, teaId);

            var pendingRequests = await _requestHelper.GetPendingRequestsAsync(admin);
            Assert.Contains(pendingRequests, xRequest => xRequest.Id == createdRequest.Id);

            await _requestHelper.ResolveRequestAsync(
                admin,
                createdRequest.Id,
                RequestStatus.Accepted,
                "Test acceptance."
            );

            pendingRequests = await _requestHelper.GetPendingRequestsAsync(admin);
            var userRequests = await _requestHelper.GetUserRequestsAsync(user);
            var tea = await _requestHelper.GetPrivateTeaAsync(user, teaId);

            Assert.DoesNotContain(pendingRequests, xRequest => xRequest.Id == createdRequest.Id);

            var resolvedRequest = Assert.Single(userRequests,
                xRequest => xRequest.Id == createdRequest.Id);

            Assert.Equal(RequestStatus.Accepted, resolvedRequest.Status);
            Assert.Equal("Test acceptance.", resolvedRequest.ResolutionMessage);
            Assert.True(tea.IsPublic);
        }
        finally {
            if (user != null) await _authHelper.CleanupTestUserAsync(user);
            if (admin != null) await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task PublishRequestRejectFlow_ShouldWorkCorrectly() {
        TestUser? user = null;
        TestUser? admin = null;

        try {
            user = await _authHelper.CreateAuthenticatedTestUserAsync();
            admin = await _authHelper.CreateAuthenticatedTestUserAsync(true);

            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);
            var createdRequest = await _requestHelper.CreatePublishRequestAsync(user, teaId);

            var pendingRequests = await _requestHelper.GetPendingRequestsAsync(admin);
            Assert.Contains(pendingRequests, xRequest => xRequest.Id == createdRequest.Id);

            await _requestHelper.ResolveRequestAsync(
                admin,
                createdRequest.Id,
                RequestStatus.Rejected,
                "Test rejection."
            );

            pendingRequests = await _requestHelper.GetPendingRequestsAsync(admin);
            var userRequests = await _requestHelper.GetUserRequestsAsync(user);
            var tea = await _requestHelper.GetPrivateTeaAsync(user, teaId);

            Assert.DoesNotContain(pendingRequests, xRequest => xRequest.Id == createdRequest.Id);

            var resolvedRequest = Assert.Single(userRequests,
                xRequest => xRequest.Id == createdRequest.Id);

            Assert.Equal(RequestStatus.Rejected, resolvedRequest.Status);
            Assert.Equal("Test rejection.", resolvedRequest.ResolutionMessage);
            Assert.False(tea.IsPublic);
        }
        finally {
            if (user != null) await _authHelper.CleanupTestUserAsync(user);
            if (admin != null) await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task GetPendingRequests_ShouldRequireAdminRole() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var response = await _requestHelper.GetPendingRequestsResponseAsync(user);

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task ResolveRequest_ShouldRequireAdminRole() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);
            var request = await _requestHelper.CreatePublishRequestAsync(owner, teaId);

            var response = await _requestHelper.ResolveRequestResponseAsync(
                user,
                request.Id,
                RequestStatus.Accepted
            );

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task CancelRequest_ShouldNotAllowOtherUserToCancel() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var otherUser = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);
            var request = await _requestHelper.CreatePublishRequestAsync(owner, teaId);

            var response = await _requestHelper.CancelRequestResponseAsync(otherUser, request.Id);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(otherUser);
        }
    }

    [Fact]
    public async Task CancelRequest_ShouldNotAllowResolvedRequest() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var admin = await _authHelper.CreateAuthenticatedTestUserAsync(isAdmin: true);

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);
            var request = await _requestHelper.CreatePublishRequestAsync(owner, teaId);

            var resolveResponse = await _requestHelper.ResolveRequestResponseAsync(
                admin,
                request.Id,
                RequestStatus.Accepted
            );

            Assert.Equal(HttpStatusCode.NoContent, resolveResponse.StatusCode);

            var cancelResponse = await _requestHelper.CancelRequestResponseAsync(owner, request.Id);

            Assert.Equal(HttpStatusCode.BadRequest, cancelResponse.StatusCode);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    [Fact]
    public async Task CreatePublishRequest_ShouldNotAllowOtherUserTea() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var otherUser = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);

            var response = await _requestHelper.CreatePublishRequestResponseAsync(otherUser, teaId);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

            var requests = await _requestHelper.GetUserRequestsAsync(otherUser);

            Assert.Empty(requests);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(otherUser);
        }
    }

    [Fact]
    public async Task CreatePublishRequest_ShouldNotAllowDuplicatePendingRequest() {
        var user = await _authHelper.CreateAuthenticatedTestUserAsync();

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(user);

            await _requestHelper.CreatePublishRequestAsync(user, teaId);

            var response = await _requestHelper.CreatePublishRequestResponseAsync(user, teaId);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

            var requests = await _requestHelper.GetUserRequestsAsync(user);

            Assert.Single(requests);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(user);
        }
    }

    [Fact]
    public async Task CreatePublishRequest_ShouldAllowNewRequestAfterRejection() {
        var owner = await _authHelper.CreateAuthenticatedTestUserAsync();
        var admin = await _authHelper.CreateAuthenticatedTestUserAsync(true);

        try {
            var teaId = await _requestHelper.CreatePrivateTeaAsync(owner);
            var firstRequest = await _requestHelper.CreatePublishRequestAsync(owner, teaId);

            await _requestHelper.ResolveRequestAsync(
                admin,
                firstRequest.Id,
                RequestStatus.Rejected,
                "Rejected for testing."
            );

            var response = await _requestHelper.CreatePublishRequestResponseAsync(owner, teaId);

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            var requests = await _requestHelper.GetUserRequestsAsync(owner);

            Assert.Equal(2, requests.Count);
        }
        finally {
            await _authHelper.CleanupTestUserAsync(owner);
            await _authHelper.CleanupTestUserAsync(admin);
        }
    }

    private static int GetTeaId(RequestListResponseDTO request) {
        var details = Assert.IsType<JsonElement>(request.Details);

        return details.GetProperty("teaId").GetInt32();
    }
}