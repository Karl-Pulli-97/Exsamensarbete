using FishingLog.Api.Data;
using FishingLog.Api.DTOs.ReferenceData;
using FishingLog.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingLog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
        if (location == null) return NotFound();
        return Ok(location);
    }

    [HttpPost]
    public async Task<ActionResult<Location>> Create(CreateLocationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { message = "Namn krävs." });
        }

        var trimmedName = request.Name.Trim();

        var exists = await _context.Locations.AnyAsync(l =>
            l.Name.ToLower() == trimmedName.ToLower());

        if (exists)
        {
            return BadRequest(new { message = "Platsen finns redan." });
        }

        var location = new Location
        {
            Id = Guid.NewGuid(),
            Name = trimmedName
        };

        _context.Locations.Add(location);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = location.Id }, location);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var location = await _context.Locations.FindAsync(id);
        if (location == null) return NotFound();

        _context.Locations.Remove(location);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}