using System.ComponentModel.DataAnnotations;

namespace FishingLog.Api.DTOs.Auth;

public class RegisterRequest
{

    [Required(ErrorMessage = "Email är obligatoriskt.")]
    [EmailAddress(ErrorMessage = "Ogiltig email-adress.")]
    [MaxLength(200)]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Lösenord är obligatoriskt.")]
    [MinLength(6, ErrorMessage = "Lösenordet måste vara minst 6 tecken.")]
    [MaxLength(100)]
    public string Password { get; set; } = null!;

    [Required(ErrorMessage = "Namn är obligatoriskt.")]
    [MaxLength(100, ErrorMessage = "Namnet får vara max 100 tecken.")]
    public string Name { get; set; } = null!;
}