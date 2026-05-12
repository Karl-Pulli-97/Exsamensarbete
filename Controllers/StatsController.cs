using FishingLog.Api.Data;
using FishingLog.Api.DTOs.Stats;
using FishingLog.Api.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingLog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StatsController : ControllerBase
{
    private readonly FishingLogDbContext _context;

    public StatsController(FishingLogDbContext context)
    {
        _context = context;
    }

    [HttpGet("overview")]
    public async Task<ActionResult<StatsOverviewDto>> GetOverview()
    {
        var userId = User.GetUserId();

        var catches = _context.CatchEntries.Where(c => c.UserId == userId);

        var totalCatches = await catches.CountAsync();
        var releasedCatches = await catches.CountAsync(c => c.Released);
        var largestWeight = await catches.MaxAsync(c => (decimal?)c.Weight);
        var largestLength = await catches.MaxAsync(c => (decimal?)c.Length);

        var mostCaughtSpecies = await catches
            .GroupBy(c => c.Species!.Name)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync();

        var bestLure = await catches
            .Where(c => c.Lure != null)
            .GroupBy(c => c.Lure!.Name)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync();

        var bestLocation = await catches
            .Where(c => c.Location != null)
            .GroupBy(c => c.Location!.Name)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync();

        return Ok(new StatsOverviewDto
        {
            TotalCatches = totalCatches,
            ReleasedCatches = releasedCatches,
            LargestWeight = largestWeight,
            LargestLength = largestLength,
            MostCaughtSpecies = mostCaughtSpecies,
            BestLure = bestLure,
            BestLocation = bestLocation
        });
    }

    [HttpGet("by-species")]
    public async Task<ActionResult<List<SpeciesStatsDto>>> GetBySpecies()
    {
        var userId = User.GetUserId();

        var stats = await _context.CatchEntries
            .Where(c => c.UserId == userId)
            .GroupBy(c => c.Species!.Name)
            .Select(g => new SpeciesStatsDto
            {
                SpeciesName = g.Key,
                Count = g.Count(),
                AverageWeight = g.Average(c => c.Weight),
                LargestWeight = g.Max(c => c.Weight)
            })
            .OrderByDescending(s => s.Count)
            .ToListAsync();

        return Ok(stats);
    }

    [HttpGet("by-lure")]
    public async Task<ActionResult<List<GroupStatsDto>>> GetByLure()
    {
        var userId = User.GetUserId();

        var stats = await _context.CatchEntries
            .Where(c => c.UserId == userId && c.Lure != null)
            .GroupBy(c => c.Lure!.Name)
            .Select(g => new GroupStatsDto
            {
                Name = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(s => s.Count)
            .ToListAsync();

        return Ok(stats);
    }

    [HttpGet("by-location")]
    public async Task<ActionResult<List<GroupStatsDto>>> GetByLocation()
    {
        var userId = User.GetUserId();

        var stats = await _context.CatchEntries
            .Where(c => c.UserId == userId && c.Location != null)
            .GroupBy(c => c.Location!.Name)
            .Select(g => new GroupStatsDto
            {
                Name = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(s => s.Count)
            .ToListAsync();

        return Ok(stats);
    }

    [HttpGet("by-month")]
    public async Task<ActionResult<List<MonthlyStatsDto>>> GetByMonth()
    {
        var userId = User.GetUserId();

        var stats = await _context.CatchEntries
            .Where(c => c.UserId == userId)
            .GroupBy(c => new { c.CaughtAt.Year, c.CaughtAt.Month })
            .Select(g => new MonthlyStatsDto
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Count = g.Count()
            })
            .OrderBy(s => s.Year).ThenBy(s => s.Month)
            .ToListAsync();

        return Ok(stats);
    }
}