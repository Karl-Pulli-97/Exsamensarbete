using FishingLog.Api.Data;
using FishingLog.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingLog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatchesController : ControllerBase
{
    private readonly FishingLogDbContext _context;

    public CatchesController(FishingLogDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<CatchEntry>>> GetAll()
    {
        var catches = await _context.CatchEntries
            .Include(c => c.Species)
            .Include(c => c.Location)
            .Include(c => c.Lure)
            .OrderByDescending(c => c.CaughtAt)
            .ToListAsync();

        return Ok(catches);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CatchEntry>> GetById(Guid id)
    {
        var catchEntry = await _context.CatchEntries
            .Include(c => c.Species)
            .Include(c => c.Location)
            .Include(c => c.Lure)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (catchEntry == null)
        {
            return NotFound();
        }

        return Ok(catchEntry);
    }

    [HttpPost]
    public async Task<ActionResult<CatchEntry>> Create(CatchEntry catchEntry)
    {
        catchEntry.Id = Guid.NewGuid();

        _context.CatchEntries.Add(catchEntry);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = catchEntry.Id }, catchEntry);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, CatchEntry catchEntry)
    {
        if (id != catchEntry.Id)
        {
            return BadRequest();
        }

        var existing = await _context.CatchEntries.FindAsync(id);

        if (existing == null)
        {
            return NotFound();
        }

        existing.SpeciesId = catchEntry.SpeciesId;
        existing.LocationId = catchEntry.LocationId;
        existing.LureId = catchEntry.LureId;
        existing.FishingTripId = catchEntry.FishingTripId;
        existing.CaughtAt = catchEntry.CaughtAt;
        existing.Weight = catchEntry.Weight;
        existing.Length = catchEntry.Length;
        existing.Released = catchEntry.Released;
        existing.Technique = catchEntry.Technique;
        existing.Notes = catchEntry.Notes;
        existing.Weather = catchEntry.Weather;
        existing.WaterTemperature = catchEntry.WaterTemperature;
        existing.ImageUrl = catchEntry.ImageUrl;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var catchEntry = await _context.CatchEntries.FindAsync(id);

        if (catchEntry == null)
        {
            return NotFound();
        }

        _context.CatchEntries.Remove(catchEntry);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}