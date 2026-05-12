using FishingLog.Api.Data;
using FishingLog.Api.DTOs.Catches;
using FishingLog.Api.Models;

namespace FishingLog.Api.Services;

public class CatchQueryService
{
    private readonly FishingLogDbContext _context;

    public CatchQueryService(FishingLogDbContext context)
    {
        _context = context;
    }

    public IQueryable<CatchEntry> GetFilteredCatches(Guid userId, CatchFilterRequest filter)
    {
        var query = _context.CatchEntries.Where(c => c.UserId == userId);

        if (filter.SpeciesId.HasValue)
            query = query.Where(c => c.SpeciesId == filter.SpeciesId.Value);

        if (filter.LocationId.HasValue)
            query = query.Where(c => c.LocationId == filter.LocationId.Value);

        if (filter.LureId.HasValue)
            query = query.Where(c => c.LureId == filter.LureId.Value);

        if (filter.From.HasValue)
            query = query.Where(c => c.CaughtAt >= filter.From.Value);

        if (filter.To.HasValue)
            query = query.Where(c => c.CaughtAt <= filter.To.Value);

        if (filter.Released.HasValue)
            query = query.Where(c => c.Released == filter.Released.Value);

        return query;
    }
}