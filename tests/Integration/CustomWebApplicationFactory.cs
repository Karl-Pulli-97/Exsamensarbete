using FishingLog.Api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace FishingLog.Tests.Integration;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private static readonly string TestDb = "IntegrationTestDb_" + Guid.NewGuid();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((context, config) =>
        {
            config.Sources.Clear();
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "TestSecretKey_AtLeast32CharactersLong_ForTesting",
                ["Jwt:Issuer"] = "FishingLogApi",
                ["Jwt:Audience"] = "FishingLogClient",
                ["Jwt:TokenTimeout"] = "1440",
                ["ConnectionStrings:DefaultConnection"] = "InMemory"
            });
        });

        builder.ConfigureServices(services =>
        {
            var descriptors = services
                .Where(d => d.ServiceType.FullName != null && (
                    d.ServiceType.FullName.Contains("EntityFrameworkCore") ||
                    d.ServiceType == typeof(DbContextOptions<FishingLogDbContext>) ||
                    d.ServiceType == typeof(FishingLogDbContext)))
                .ToList();

            foreach (var descriptor in descriptors)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<FishingLogDbContext>(options =>
            {
                options.UseInMemoryDatabase(TestDb);
            });

            services.PostConfigure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "FishingLogApi",
        ValidAudience = "FishingLogClient",
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("TestSecretKey_AtLeast32CharactersLong_ForTesting"))
    };
});
        });

        builder.UseEnvironment("Development");
    }
}