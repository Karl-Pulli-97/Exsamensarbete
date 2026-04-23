using FishingLog.Api.Models;

namespace FishingLog.Api.Data;

public static class SeedData
{
    public static void Initialize(FishingLogDbContext context)
    {
        if (context.Users.Any()) return;

        var user = new User
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Email = "karl@test.com",
            Name = "Karl",
            Password = "test123"
        };

        context.Users.Add(user);
        context.SaveChanges();
    }
}