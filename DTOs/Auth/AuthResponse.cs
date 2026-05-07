namespace FishingLog.Api.DTOs.Auth;

public class AuthResponse
{
    public string Token { get; set; } = null!;
    public Guid UserId { get; set; }
    public string Email { get; set; } = null!;
    public string Name { get; set; } = null!;
}