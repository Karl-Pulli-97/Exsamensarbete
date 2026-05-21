using FishingLog.Api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace FishingLog.Tests.Integration;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private static readonly string DbName = "IntegrationTestDb_" + Guid.NewGuid();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
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
                options.UseInMemoryDatabase(DbName);
            });
        });

        builder.UseEnvironment("Development");
    }
}