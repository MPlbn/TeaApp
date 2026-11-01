using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Constants;
using TeaApp.Api.Data;
using TeaApp.Api.DTOs.Auth;
using TeaApp.Api.Models;
using TeaApp.Api.Services;

namespace TeaApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    UserManager<ApplicationUser> userManager,
    IConfiguration configuration,
    TokenService tokenService,
    TeaDbContext context
    ) : ControllerBase {

    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly IConfiguration _configuration = configuration;
    private readonly TokenService _tokenService = tokenService;
    private readonly TeaDbContext _context = context;

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser() {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null) return NotFound();

        return Ok(new {
            user.Id,
            user.UserName,
            user.Email,
            Roles = await _userManager.GetRolesAsync(user)
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequestDTO request) {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);

        if (existingUser != null) return BadRequest("An account with this email already exists.");

        var user = new ApplicationUser {
            UserName = request.UserName,
            Email = request.Email
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded) return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, "User");

        return Ok("Account created Successfully!");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDTO request) {
        var user = await _userManager.FindByNameAsync(request.Login);
        user ??= await _userManager.FindByEmailAsync(request.Login);
        if (user == null) return Unauthorized("Invalid login or password.");

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isPasswordValid) return Unauthorized("Invalid login or password");

        var acessToken = await _tokenService.GenerateAccessToken(user);
        var (refreshToken, refreshTokenEntity) = _tokenService.CreateRefreshToken(user.Id, Guid.NewGuid());

        await _context.RefreshTokenSet.AddAsync(refreshTokenEntity);
        await _context.SaveChangesAsync();

        return Ok(new AuthResponseDTO {
            Token = acessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["Jwt:AccessTokenExpirationMinutes"] ?? TokenConstants.DefaultAccessTokenExpirationMinutes.ToString()))
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(RefreshTokenRequestDTO request) {
        if (string.IsNullOrWhiteSpace(request.RefreshToken)) return BadRequest();

        var tokenHash = _tokenService.HashRefreshToken(request.RefreshToken);

        var refreshToken = await _context.RefreshTokenSet.FirstOrDefaultAsync(token => token.TokenHash == tokenHash);
        if (refreshToken == null || refreshToken.RevokedAtUtc != null) return Ok();

        refreshToken.RevokedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> GrantNewAccessAndRefreshToken(RefreshTokenRequestDTO request) {
        if (string.IsNullOrWhiteSpace(request.RefreshToken)) return BadRequest("Refresh token is required.");

        var tokenHash = _tokenService.HashRefreshToken(request.RefreshToken);

        var storedToken = await _context.RefreshTokenSet.FirstOrDefaultAsync(token => token.TokenHash == tokenHash);
        if (storedToken == null) return Unauthorized("Invalid refresh token.");

        var now = DateTime.UtcNow;

        if (storedToken.RevokedAtUtc != null) {
            var familyTokens = await _context.RefreshTokenSet
                .Where(token =>
                    token.FamilyId == storedToken.FamilyId &&
                    token.RevokedAtUtc == null)
                .ToListAsync();

            foreach (var token in familyTokens)
                token.RevokedAtUtc = now;

            await _context.SaveChangesAsync();
            return Unauthorized("Refresh token reuse detected.");
        }

        if (storedToken.ExpiresAtUtc <= now) return Unauthorized("Refresh token has expired.");

        var user = await _userManager.FindByIdAsync(storedToken.UserId);

        if (user == null) return Unauthorized("Invalid refresh token.");

        var accessToken = await _tokenService.GenerateAccessToken(user);
        var (refreshToken, refreshTokenEntity) = _tokenService.CreateRefreshToken(user.Id, storedToken.FamilyId);

        storedToken.RevokedAtUtc = now;
        storedToken.ReplacedByTokenHash = refreshTokenEntity.TokenHash;

        await _context.RefreshTokenSet.AddAsync(refreshTokenEntity);
        await _context.SaveChangesAsync();

        return Ok(new AuthResponseDTO {
            Token = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["Jwt:AccessTokenExpirationMinutes"] ?? TokenConstants.DefaultAccessTokenExpirationMinutes.ToString()))
        });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangeUserPassword(ChangePasswordDTO DTO) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound();

        var result = await _userManager.ChangePasswordAsync(user, DTO.CurrentPassword, DTO.NewPassword);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok("Password changed.");
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile(UpdateProfileDTO DTO) {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound();

        if (!string.IsNullOrEmpty(DTO.UserName)) user.UserName = DTO.UserName;
        if (!string.IsNullOrEmpty(DTO.Email)) user.Email = DTO.Email;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok(new {
            user.Id,
            user.UserName,
            user.Email
        });
    }
}