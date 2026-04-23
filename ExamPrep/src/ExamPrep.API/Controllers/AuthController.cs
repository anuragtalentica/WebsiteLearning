using System.Security.Claims;
using ExamPrep.API.Models;
using ExamPrep.Application.DTOs.Auth;
using ExamPrep.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly UserManager<IdentityUser> _userManager;

    public AuthController(IAuthService authService, UserManager<IdentityUser> userManager)
    {
        _authService = authService;
        _userManager = userManager;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register([FromBody] RegisterDto dto)
    {
        try
        {
            var result = await _authService.RegisterAsync(dto);
            return Ok(ApiResponse<AuthResponseDto>.Ok(result));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<AuthResponseDto>.Fail(ex.Message));
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginDto dto)
    {
        try
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(ApiResponse<AuthResponseDto>.Ok(result));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<AuthResponseDto>.Fail(ex.Message));
        }
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult<ApiResponse<ForgotPasswordResponseDto>>> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        var result = await _authService.ForgotPasswordAsync(dto);
        return Ok(ApiResponse<ForgotPasswordResponseDto>.Ok(result));
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<ProfileDto>>> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound(ApiResponse<ProfileDto>.Fail("User not found"));

        // FullName: prefer stored user claim, fallback to JWT claim
        var userClaims = await _userManager.GetClaimsAsync(user);
        var fullName = userClaims.FirstOrDefault(c => c.Type == "FullName")?.Value
                       ?? User.FindFirstValue(ClaimTypes.Name)
                       ?? user.Email ?? "";
        var roles = await _userManager.GetRolesAsync(user);

        return Ok(ApiResponse<ProfileDto>.Ok(new ProfileDto
        {
            Email = user.Email ?? "",
            FullName = fullName,
            Role = roles.FirstOrDefault() ?? "User"
        }));
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<string>>> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound(ApiResponse<string>.Fail("User not found"));

        var existingClaims = await _userManager.GetClaimsAsync(user);
        var existing = existingClaims.FirstOrDefault(c => c.Type == "FullName");
        var newClaim = new System.Security.Claims.Claim("FullName", dto.FullName.Trim());
        if (existing != null)
            await _userManager.ReplaceClaimAsync(user, existing, newClaim);
        else
            await _userManager.AddClaimAsync(user, newClaim);

        return Ok(ApiResponse<string>.Ok("Profile updated"));
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<string>>> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound(ApiResponse<string>.Fail("User not found"));

        var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
        if (!result.Succeeded)
            return BadRequest(ApiResponse<string>.Fail(string.Join(", ", result.Errors.Select(e => e.Description))));

        return Ok(ApiResponse<string>.Ok("Password changed successfully"));
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult<ApiResponse<string>>> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        try
        {
            await _authService.ResetPasswordAsync(dto);
            return Ok(ApiResponse<string>.Ok("Password has been reset successfully."));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<string>.Fail(ex.Message));
        }
    }
}
