using System.ComponentModel.DataAnnotations;

namespace ExamPrep.Application.DTOs.Auth;

public class ForgotPasswordDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
}

public class ForgotPasswordResponseDto
{
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Only populated in Development environment for testing.
    /// In production, the token is sent via email only.
    /// </summary>
    public string? ResetToken { get; set; }
}
