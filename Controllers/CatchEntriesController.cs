using FishingLog.Api.Data;
using FishingLog.Api.DTOs.Catches;
using FishingLog.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingLog.Api.Controllers;

[ApiController]
[Route("api/catches")]
public class CatchEntriesController : ControllerBase
{
    private readonly FishingLogDbContext _context;

    private static readonly Guid SeedUserId =
        Guid.Parse("11111111-1111-1111-1111-111111111111");

    public CatchEntriesController(FishingLogDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<CatchEntryDto>>> GetAll(
        [FromQuery] CatchFilterRequest filter)
    {
        var query = _context.CatchEntries
            .Where(c => c.UserId == SeedUserId)
            .AsQueryable();

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

        var result = await query
            .OrderByDescending(c => c.CaughtAt)
            .Select(c => new CatchEntryDto
            {
                Id = c.Id,
                SpeciesName = c.Species!.Name,
                LocationName = c.Location != null ? c.Location.Name : null,
                LureName = c.Lure != null ? c.Lure.Name : null,
                CaughtAt = c.CaughtAt,
                Weight = c.Weight,
                Length = c.Length,
                Released = c.Released,
                Technique = c.Technique,
                Notes = c.Notes,
                Weather = c.Weather,
                WaterTemperature = c.WaterTemperature
            })
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CatchEntryDto>> GetById(Guid id)
    {
        var dto = await _context.CatchEntries
            .Where(c => c.Id == id && c.UserId == SeedUserId)
            .Select(c => new CatchEntryDto
            {
                Id = c.Id,
                SpeciesName = c.Species!.Name,
                LocationName = c.Location != null ? c.Location.Name : null,
                LureName = c.Lure != null ? c.Lure.Name : null,
                CaughtAt = c.CaughtAt,
                Weight = c.Weight,
                Length = c.Length,
                Released = c.Released,
                Technique = c.Technique,
                Notes = c.Notes,
                Weather = c.Weather,
                WaterTemperature = c.WaterTemperature
            })
            .FirstOrDefaultAsync();

        if (dto == null)
            return NotFound();

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateCatchEntryRequest request)
    {
        var entity = new CatchEntry
        {
            Id = Guid.NewGuid(),
            UserId = SeedUserId,
            SpeciesId = request.SpeciesId,
            LocationId = request.LocationId,
            LureId = request.LureId,
            FishingTripId = request.FishingTripId,
            CaughtAt = request.CaughtAt,
            Weight = request.Weight,
            Length = request.Length,
            Released = request.Released,
            Technique = request.Technique,
            Notes = request.Notes,
            Weather = request.Weather,
            WaterTemperature = request.WaterTemperature
        };

        _context.CatchEntries.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, null);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateCatchEntryRequest request)
    {
        var existing = await _context.CatchEntries
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == SeedUserId);

        if (existing == null)
            return NotFound();

        existing.SpeciesId = request.SpeciesId;
        existing.LocationId = request.LocationId;
        existing.LureId = request.LureId;
        existing.FishingTripId = request.FishingTripId;
        existing.CaughtAt = request.CaughtAt;
        existing.Weight = request.Weight;
        existing.Length = request.Length;
        existing.Released = request.Released;
        existing.Technique = request.Technique;
        existing.Notes = request.Notes;
        existing.Weather = request.Weather;
        existing.WaterTemperature = request.WaterTemperature;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var entity = await _context.CatchEntries
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == SeedUserId);

        if (entity == null)
            return NotFound();

        _context.CatchEntries.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}