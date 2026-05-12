using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace FishingLog.Api.Extensions;

public static class UserExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var userClaim = user.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userClaim))
            throw new UnauthorizedAccessException("Användaren är inte inloggad.");

        return Guid.Parse(userClaim);
    }
}