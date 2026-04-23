using FishingLog.Api.Data;
using FishingLog.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingLog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly FishingLogDbContext _context;

    public LocationsController(FishingLogDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Location>>> GetAll()
    {
        var locations = await _context.Locations.OrderBy(l => l.Name).ToListAsync();

        return Ok(locations);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Location>> GetById(Guid id)
    {
        var location = await _context.Locations.FindAsync(id);

        if (location == null)
        {
            return NotFound();
        }

        return Ok(location);
    }

    [HttpPost]
    public async Task<ActionResult<Location>> Create(Location location)
    {
        location.Id = Guid.NewGuid();

        _context.Locations.Add(location);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = location.Id }, location);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, Location location)
    {
        if (id != location.Id)
        {
            return BadRequest();
        }

        var existing = await _context.Locations.FindAsync(id);

        if (existing == null)
        {
            return NotFound();
        }

        existing.Name = location.Name;
        existing.Description = location.Description;
        existing.Latitude = location.Latitude;
        existing.Longitude = location.Longitude;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var location = await _context.Locations.FindAsync(id);

        if (location == null)
        {
            return NotFound();
        }

        _context.Locations.Remove(location);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}