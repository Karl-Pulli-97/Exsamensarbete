using FishingLog.Api.Data;
using FishingLog.Api.DTOs.Catches;
using FishingLog.Api.Models;
using FishingLog.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace FishingLog.Tests.Services;

public class CatchQueryServiceTests
{
    private readonly Guid _userId = Guid.NewGuid();
    private readonly Guid _otherUserId = Guid.NewGuid();
    private readonly Guid _abborreId = Guid.NewGuid();
    private readonly Guid _gaddaId = Guid.NewGuid();
    private readonly Guid _vanernId = Guid.NewGuid();

    private FishingLogDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<FishingLogDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var context = new FishingLogDbContext(options);

        context.Species.AddRange(
            new Species { Id = _abborreId, Name = "Abborre" },
            new Species { Id = _gaddaId, Name = "Gädda" }
        );

        context.Locations.Add(new Location { Id = _vanernId, Name = "Vänern" });

        context.CatchEntries.AddRange(
            new CatchEntry
            {
                Id = Guid.NewGuid(),
                UserId = _userId,
                SpeciesId = _abborreId,
                LocationId = _vanernId,
                CaughtAt = new DateTime(2026, 5, 1),
                Released = true
            },
            new CatchEntry
            {
                Id = Guid.NewGuid(),
                UserId = _userId,
                SpeciesId = _gaddaId,
                LocationId = _vanernId,
                CaughtAt = new DateTime(2026, 5, 15),
                Released = false
            },
            new CatchEntry
            {
                Id = Guid.NewGuid(),
                UserId = _otherUserId,
                SpeciesId = _abborreId,
                CaughtAt = new DateTime(2026, 5, 10),
                Released = false
            }
        );

        context.SaveChanges();
        return context;
    }

    [Fact]
    public void GetFilteredCatches_ReturnsOnlyCurrentUsersCatches()
    {
        using var context = CreateContext();
        var service = new CatchQueryService(context);

        var result = service.GetFilteredCatches(_userId, new CatchFilterRequest()).ToList();

        Assert.Equal(2, result.Count);
        Assert.All(result, c => Assert.Equal(_userId, c.UserId));
    }

    [Fact]
    public void GetFilteredCatches_FiltersBySpecies()
    {
        using var context = CreateContext();
        var service = new CatchQueryService(context);

        var filter = new CatchFilterRequest { SpeciesId = _abborreId };
        var result = service.GetFilteredCatches(_userId, filter).ToList();

        Assert.Single(result);
        Assert.Equal(_abborreId, result[0].SpeciesId);
    }

    [Fact]
    public void GetFilteredCatches_FiltersByDateRange()
    {
        using var context = CreateContext();
        var service = new CatchQueryService(context);

        var filter = new CatchFilterRequest
        {
            From = new DateTime(2026, 5, 10),
            To = new DateTime(2026, 5, 20)
        };
        var result = service.GetFilteredCatches(_userId, filter).ToList();

        Assert.Single(result);
        Assert.Equal(_gaddaId, result[0].SpeciesId);
    }

    [Fact]
    public void GetFilteredCatches_FiltersByReleased()
    {
        using var context = CreateContext();
        var service = new CatchQueryService(context);

        var filter = new CatchFilterRequest { Released = true };
        var result = service.GetFilteredCatches(_userId, filter).ToList();

        Assert.Single(result);
        Assert.True(result[0].Released);
    }

    [Fact]
    public void GetFilteredCatches_NoFilter_ReturnsAllUsersCatches()
    {
        using var context = CreateContext();
        var service = new CatchQueryService(context);

        var result = service.GetFilteredCatches(_userId, new CatchFilterRequest()).ToList();

        Assert.Equal(2, result.Count);
    }
}