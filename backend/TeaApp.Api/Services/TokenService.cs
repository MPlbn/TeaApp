using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using TeaApp.Api.Constants;
using TeaApp.Api.Models;

namespace TeaApp.Api.Services;

public class TokenService(IConfiguration configuration, UserManager<ApplicationUser> userManager) {
    private readonly IConfiguration _configuration = configuration;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public async Task<string> GenerateAccessToken(ApplicationUser user) {
        var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Brak Jwt:Key");
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Brak Jwt:Issuer");
        var jwtAudience = _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Brak Jwt:Audience");

        var expirationMinutes = int.Parse(_configuration["Jwt:AccessTokenExpirationMinutes"] ?? TokenConstants.DefaultAccessTokenExpirationMinutes.ToString());

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var roles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim> {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        foreach (var role in roles)
            claims.Add(new(ClaimTypes.Role, role));


        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken() {
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(randomBytes);
    }

    public string HashRefreshToken(string refreshToken) {
        var tokenBytes = Encoding.UTF8.GetBytes(refreshToken);
        var hashBytes = SHA256.HashData(tokenBytes);

        return Convert.ToHexString(hashBytes);
    }

    public (string rawRefreshToken, RefreshToken refreshTokenEntity) CreateRefreshToken(string userId, Guid familyId) {
        var rawRefreshToken = GenerateRefreshToken();

        var refreshTokenEntity = new RefreshToken {
            UserId = userId,
            TokenHash = HashRefreshToken(rawRefreshToken),
            FamilyId = familyId,
            CreatedAtUtc = DateTime.UtcNow,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(int.Parse(_configuration["Jwt:RefreshTokenExpirationDays"] ?? TokenConstants.DefaultRefreshTokenExpirationDays.ToString()))
        };

        return (rawRefreshToken, refreshTokenEntity);
    }
}
