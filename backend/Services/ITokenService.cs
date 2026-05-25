using FishingLog.Api.Models;

namespace FishingLog.Api.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}