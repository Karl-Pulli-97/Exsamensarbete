using FishingLog.Api.Data;
using FishingLog.Api.DTOs.Catches;
using FishingLog.Api.Extensions;
using FishingLog.Api.Models;
using FishingLog.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingLog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CatchEntriesController : ControllerBase
{
    private readonly FishingLogDbContext _context;
    private readonly CatchQueryService _catchQueryService;

    public CatchEntriesController(
        FishingLogDbContext context,
        CatchQueryService catchQueryService)
    {
        _context = context;
        _catchQueryService = catchQueryService;
    }

    [HttpGet]
    public async Task<ActionResult<List<CatchEntryDto>>> GetAll(
        [FromQuery] CatchFilterRequest filter)
    {
        var userId = User.GetUserId();

        var result = await _catchQueryService.GetFilteredCatches(userId, filter)
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
        var userId = User.GetUserId();

        var dto = await _context.CatchEntries
            .Where(c => c.Id == id && c.UserId == userId)
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
        var userId = User.GetUserId();

        var entity = new CatchEntry
        {
            Id = Guid.NewGuid(),
            UserId = userId,
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
        var userId = User.GetUserId();

        var existing = await _context.CatchEntries
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

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
        var userId = User.GetUserId();

        var entity = await _context.CatchEntries
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (entity == null)
            return NotFound();

        _context.CatchEntries.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}