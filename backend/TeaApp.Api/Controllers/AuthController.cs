using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using TeaApp.Api.DTOs.Auth;
using TeaApp.Api.Models;

namespace TeaApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    UserManager<ApplicationUser> userManager,
    IConfiguration configuration
    ) : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly IConfiguration _configuration = configuration;

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(userId == null) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);

        if(user == null) return NotFound();

        return Ok(new
        {
            user.Id,
            user.UserName,
            user.Email,
            Roles = await _userManager.GetRolesAsync(user)
        });
    }   

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequestDTO request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if(existingUser != null) return BadRequest("An account with this email already exists.");

        var user = new ApplicationUser
        {
            UserName = request.UserName,
            Email = request.Email
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if(!result.Succeeded) return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, "User");

        return Ok("Account created Successfully!");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDTO request)
    {
        var user = await _userManager.FindByNameAsync(request.Login);

        user ??= await _userManager.FindByEmailAsync(request.Login);

        if(user == null) return Unauthorized("Invalid login or password.");

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);

        if(!isPasswordValid) return Unauthorized("Invalid login or password");

        var token = await GenerateJwtToken(user);

        return Ok(token);
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangeUserPassword(ChangePasswordDTO DTO)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if(user == null) return NotFound();

        var result = await _userManager.ChangePasswordAsync(user, DTO.CurrentPassword, DTO.NewPassword);
        if(!result.Succeeded) return BadRequest(result.Errors);

        return Ok("Password changed.");
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile(UpdateProfileDTO DTO)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId == null) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if(user == null) return NotFound();

        if(!string.IsNullOrEmpty(DTO.UserName)) user.UserName = DTO.UserName;
        if(!string.IsNullOrEmpty(DTO.Email)) user.Email = DTO.Email;

        var result = await _userManager.UpdateAsync(user);

        if(!result.Succeeded) return BadRequest(result.Errors);

        return Ok(new
        {
            user.Id,
            user.UserName,
            user.Email
        });
    }

    private async Task<AuthResponseDTO> GenerateJwtToken(ApplicationUser user)
    {
        var jwtKey = _configuration["Jwt:Key"]!;
        var jwtIssuer = _configuration["Jwt:Issuer"]!;
        var jwtAudience = _configuration["Jwt:Audience"]!;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var roles = await _userManager.GetRolesAsync(user);
        var claims = new List<Claim>
        {
            new (JwtRegisteredClaimNames.Sub, user.Id),
            new (JwtRegisteredClaimNames.Email, user.Email!),
            new (ClaimTypes.NameIdentifier, user.Id),
            new (ClaimTypes.Email, user.Email!)
        };

        foreach(var role in roles)
        {
            claims.Add(new (ClaimTypes.Role, role));
        }

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(60),
            signingCredentials: credentials            
        );

        return new AuthResponseDTO
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            ExpiresAt = token.ValidTo
        };
    }
}