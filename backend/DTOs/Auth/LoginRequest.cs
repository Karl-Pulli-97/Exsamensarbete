using System.ComponentModel.DataAnnotations;

namespace FishingLog.Api.DTOs.Auth;

public class LoginRequest
{
    [Required(ErrorMessage = "Email är obligatoriskt.")]
    [EmailAddress(ErrorMessage = "Ogiltig email-adress.")]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Lösenord är obligatoriskt.")]
    [MinLength(6, ErrorMessage = "Lösenordet måste vara minst 6 tecken.")]
    public string Password { get; set; } = null!;
}