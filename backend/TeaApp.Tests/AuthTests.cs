using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using TeaApp.Api.DTOs.Auth;
using System.Net.Http.Headers;
using TeaApp.Tests.Helpers;

namespace TeaApp.Tests;

public class AuthTests(TeaAppFactory factory) : IClassFixture<TeaAppFactory> {
    private readonly HttpClient _client = factory.CreateClient();
    private readonly AuthTestHelper _authTestHelper = new(factory.CreateClient(), factory);

    [Fact]
    public async Task AuthFlow_ShouldWorkCorrectly() {
        var testUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();

        try {
            var firstAccessToken = testUser.AccessToken;

            var firstRefreshToken = testUser.RefreshToken;

            // 3. Auth/me without and with token
            var meWithoutTokenResponse = await _client.GetAsync("/api/auth/me");
            Assert.Equal(HttpStatusCode.Unauthorized, meWithoutTokenResponse.StatusCode);

            var meWithTokenRequest = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");

            meWithTokenRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", firstAccessToken);

            var meWithTokenResponse = await _client.SendAsync(meWithTokenRequest);

            Assert.Equal(HttpStatusCode.OK, meWithTokenResponse.StatusCode);

            // 4. Refresh token
            var refreshResponse = await _client.PostAsJsonAsync("/api/auth/refresh", new RefreshTokenRequestDTO {
                RefreshToken = firstRefreshToken
            });

            Assert.Equal(HttpStatusCode.OK, refreshResponse.StatusCode);

            var refreshJson = await refreshResponse.Content.ReadFromJsonAsync<JsonDocument>();

            var secondAccessToken = refreshJson!.RootElement.GetProperty("token").GetString()!;

            var secondRefreshToken = refreshJson!.RootElement.GetProperty("refreshToken").GetString()!;

            Assert.NotEqual(firstAccessToken, secondAccessToken);
            Assert.NotEqual(firstRefreshToken, secondRefreshToken);

            // 5. Use new access token
            var secondMeWithTokenRequest = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");

            secondMeWithTokenRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", secondAccessToken);

            var secondMeWithTokenResponse = await _client.SendAsync(secondMeWithTokenRequest);

            Assert.Equal(HttpStatusCode.OK, secondMeWithTokenResponse.StatusCode);

            // 6. Reuse old refresh token
            var secondRefreshResponse = await _client.PostAsJsonAsync("/api/auth/refresh", new RefreshTokenRequestDTO { RefreshToken = firstRefreshToken });

            Assert.Equal(HttpStatusCode.Unauthorized, secondRefreshResponse.StatusCode);

            // 7. Verify token revocation
            var familyRevokedResponse = await _client.PostAsJsonAsync("/api/auth/refresh", new RefreshTokenRequestDTO { RefreshToken = secondRefreshToken });

            Assert.Equal(HttpStatusCode.Unauthorized, familyRevokedResponse.StatusCode);
        }
        finally {
            //cleanup
            await _authTestHelper.CleanupTestUserAsync(testUser);
        }

    }

    [Fact]
    public async Task AuthLogout_ShouldRevokeRefreshToken() {
        var testUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();

        try {
            // 1. Logout
            var logoutResponse = await _client.PostAsJsonAsync(
                "/api/auth/logout",
                new RefreshTokenRequestDTO {
                    RefreshToken = testUser.RefreshToken
                }
            );

            Assert.Equal(HttpStatusCode.OK, logoutResponse.StatusCode);

            // 2. Try to refresh revoked token
            var refreshResponse = await _client.PostAsJsonAsync(
                "/api/auth/refresh",
                new RefreshTokenRequestDTO {
                    RefreshToken = testUser.RefreshToken
                }
            );

            Assert.Equal(HttpStatusCode.Unauthorized, refreshResponse.StatusCode);

            // 3. Logout again
            var secondLogoutResponse = await _client.PostAsJsonAsync(
                "/api/auth/logout",
                new RefreshTokenRequestDTO {
                    RefreshToken = testUser.RefreshToken
                }
            );

            Assert.Equal(HttpStatusCode.OK, secondLogoutResponse.StatusCode);
        }
        finally {
            await _authTestHelper.CleanupTestUserAsync(testUser);
        }
    }

    [Fact]
    public async Task ChangePassword_ShouldWorkCorrectly() {
        var testUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();

        var newPassword = "NewTest1!";

        try {
            // 1. Change password
            var changePasswordRequest = new HttpRequestMessage(
                HttpMethod.Post,
                "/api/auth/change-password"
            );

            changePasswordRequest.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", testUser.AccessToken);

            changePasswordRequest.Content = JsonContent.Create(new ChangePasswordDTO {
                CurrentPassword = testUser.Password,
                NewPassword = newPassword
            });

            var changePasswordResponse = await _client.SendAsync(changePasswordRequest);

            Assert.Equal(HttpStatusCode.OK, changePasswordResponse.StatusCode);

            // 2. Login with old password
            var oldPasswordLoginResponse = await _client.PostAsJsonAsync(
                "/api/auth/login",
                new LoginRequestDTO {
                    Login = testUser.UserName,
                    Password = testUser.Password
                }
            );

            Assert.Equal(HttpStatusCode.Unauthorized, oldPasswordLoginResponse.StatusCode);

            // 3. Login with new password
            var newPasswordLoginResponse = await _client.PostAsJsonAsync(
                "/api/auth/login",
                new LoginRequestDTO {
                    Login = testUser.UserName,
                    Password = newPassword
                }
            );

            Assert.Equal(HttpStatusCode.OK, newPasswordLoginResponse.StatusCode);
        }
        finally {
            await _authTestHelper.CleanupTestUserAsync(testUser);
        }
    }

    [Fact]
    public async Task ChangePassword_ShouldRejectIncorrectCurrentPassword() {
        var testUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();

        try {
            var request = new HttpRequestMessage(
                HttpMethod.Post,
                "/api/auth/change-password"
            );

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", testUser.AccessToken);

            request.Content = JsonContent.Create(new ChangePasswordDTO {
                CurrentPassword = "WrongPassword1!",
                NewPassword = "NewTest1!"
            });

            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

            // Old password should still work
            var loginResponse = await _client.PostAsJsonAsync(
                "/api/auth/login",
                new LoginRequestDTO {
                    Login = testUser.UserName,
                    Password = testUser.Password
                }
            );

            Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
        }
        finally {
            await _authTestHelper.CleanupTestUserAsync(testUser);
        }
    }

    [Fact]
    public async Task ChangePassword_ShouldRejectWeakNewPassword() {
        var testUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();

        try {
            var request = new HttpRequestMessage(
                HttpMethod.Post,
                "/api/auth/change-password"
            );

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", testUser.AccessToken);

            request.Content = JsonContent.Create(new ChangePasswordDTO {
                CurrentPassword = testUser.Password,
                NewPassword = "weak"
            });

            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

            // Old password should still work
            var loginResponse = await _client.PostAsJsonAsync(
                "/api/auth/login",
                new LoginRequestDTO {
                    Login = testUser.UserName,
                    Password = testUser.Password
                }
            );

            Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
        }
        finally {
            await _authTestHelper.CleanupTestUserAsync(testUser);
        }
    }

    [Fact]
    public async Task ChangePassword_ShouldRejectUnauthenticatedRequest() {
        var testUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();

        try {
            var response = await _client.PostAsJsonAsync(
                "/api/auth/change-password",
                new ChangePasswordDTO {
                    CurrentPassword = testUser.Password,
                    NewPassword = "NewTest1!"
                }
            );

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

            // Verify that the original password still works
            var loginResponse = await _client.PostAsJsonAsync(
                "/api/auth/login",
                new LoginRequestDTO {
                    Login = testUser.UserName,
                    Password = testUser.Password
                }
            );

            Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
        }
        finally {
            await _authTestHelper.CleanupTestUserAsync(testUser);
        }
    }

    [Fact]
    public async Task ChangePassword_ShouldRejectEmptyPasswords() {
        var testUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();

        try {
            var request = new HttpRequestMessage(
                HttpMethod.Post,
                "/api/auth/change-password"
            );

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", testUser.AccessToken);

            request.Content = JsonContent.Create(new ChangePasswordDTO {
                CurrentPassword = string.Empty,
                NewPassword = string.Empty
            });

            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

            // Old password should still work
            var loginResponse = await _client.PostAsJsonAsync(
                "/api/auth/login",
                new LoginRequestDTO {
                    Login = testUser.UserName,
                    Password = testUser.Password
                }
            );

            Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
        }
        finally {
            await _authTestHelper.CleanupTestUserAsync(testUser);
        }
    }

    [Fact]
    public async Task GetMe_ShouldReturnCurrentUser() {
        var testUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();

        try {
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", testUser.AccessToken);

            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var responseJson = await response.Content.ReadFromJsonAsync<JsonDocument>();
            var root = responseJson!.RootElement;

            Assert.Equal(testUser.UserId, root.GetProperty("id").GetString());
            Assert.Equal(testUser.UserName, root.GetProperty("userName").GetString());
            Assert.Equal(testUser.Email, root.GetProperty("email").GetString());

            var roles = root.GetProperty("roles")
                .EnumerateArray()
                .Select(x => x.GetString())
                .ToList();

            Assert.Contains("User", roles);
        }
        finally {
            await _authTestHelper.CleanupTestUserAsync(testUser);
        }
    }

    [Fact]
    public async Task GetMe_ShouldRejectUnauthenticatedRequest() {
        var response = await _client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMe_ShouldRejectInvalidToken() {
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", "invalid-token");

        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task UpdateProfile_ShouldUpdateUserName() {
        var testUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();
        var newUserName = $"updated_{Guid.NewGuid()}";

        try {
            var request = new HttpRequestMessage(HttpMethod.Put, "/api/auth/me");

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", testUser.AccessToken);

            request.Content = JsonContent.Create(new UpdateProfileDTO {
                UserName = newUserName
            });

            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var json = await response.Content.ReadFromJsonAsync<JsonDocument>();

            Assert.Equal(
                newUserName,
                json!.RootElement.GetProperty("userName").GetString()
            );
        }
        finally {
            await _authTestHelper.CleanupTestUserAsync(testUser);
        }
    }

    [Fact]
    public async Task UpdateProfile_ShouldUpdateEmail() {
        var testUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();
        var newEmail = $"updated_{Guid.NewGuid()}@test.test";

        try {
            var request = new HttpRequestMessage(HttpMethod.Put, "/api/auth/me");

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", testUser.AccessToken);

            request.Content = JsonContent.Create(new UpdateProfileDTO {
                Email = newEmail
            });

            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var json = await response.Content.ReadFromJsonAsync<JsonDocument>();

            Assert.Equal(
                newEmail,
                json!.RootElement.GetProperty("email").GetString()
            );
        }
        finally {
            await _authTestHelper.CleanupTestUserAsync(testUser);
        }
    }

    [Fact]
    public async Task UpdateProfile_ShouldUpdateUserNameAndEmail() {
        var testUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();

        var newUserName = $"updated_{Guid.NewGuid()}";
        var newEmail = $"updated_{Guid.NewGuid()}@test.test";

        try {
            var request = new HttpRequestMessage(HttpMethod.Put, "/api/auth/me");

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", testUser.AccessToken);

            request.Content = JsonContent.Create(new UpdateProfileDTO {
                UserName = newUserName,
                Email = newEmail
            });

            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var json = await response.Content.ReadFromJsonAsync<JsonDocument>();
            var root = json!.RootElement;

            Assert.Equal(newUserName, root.GetProperty("userName").GetString());
            Assert.Equal(newEmail, root.GetProperty("email").GetString());
            Assert.Equal(testUser.UserId, root.GetProperty("id").GetString());
        }
        finally {
            await _authTestHelper.CleanupTestUserAsync(testUser);
        }
    }

    [Fact]
    public async Task UpdateProfile_ShouldIgnoreEmptyFields() {
        var testUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();

        try {
            var request = new HttpRequestMessage(HttpMethod.Put, "/api/auth/me");

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", testUser.AccessToken);

            request.Content = JsonContent.Create(new UpdateProfileDTO {
                UserName = string.Empty,
                Email = string.Empty
            });

            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var json = await response.Content.ReadFromJsonAsync<JsonDocument>();
            var root = json!.RootElement;

            Assert.Equal(testUser.UserName, root.GetProperty("userName").GetString());
            Assert.Equal(testUser.Email, root.GetProperty("email").GetString());
        }
        finally {
            await _authTestHelper.CleanupTestUserAsync(testUser);
        }
    }

    [Fact]
    public async Task UpdateProfile_ShouldRejectExistingEmail() {
        var firstUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();
        var secondUser = await _authTestHelper.CreateAuthenticatedTestUserAsync();

        try {
            var request = new HttpRequestMessage(HttpMethod.Put, "/api/auth/me");

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", secondUser.AccessToken);

            request.Content = JsonContent.Create(new UpdateProfileDTO {
                Email = firstUser.Email
            });

            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
        finally {
            await _authTestHelper.CleanupTestUserAsync(firstUser);
            await _authTestHelper.CleanupTestUserAsync(secondUser);
        }
    }

    [Fact]
    public async Task UpdateProfile_ShouldRejectUnauthenticatedRequest() {
        var response = await _client.PutAsJsonAsync(
            "/api/auth/me",
            new UpdateProfileDTO {
                UserName = "newUsername"
            }
        );

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }



}