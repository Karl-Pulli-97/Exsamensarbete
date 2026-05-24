using FishingLog.Api.Data;
using FishingLog.Api.DTOs.ReferenceData;
using FishingLog.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace FishingLog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SpeciesController : ControllerBase
{
    private readonly FishingLogDbContext _context;

    public SpeciesController(FishingLogDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Species>>> GetAll()
    {
        var species = await _context.Species.OrderBy(s => s.Name).ToListAsync();
        return Ok(species);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Species>> GetById(Guid id)
    {
        var species = await _context.Species.FindAsync(id);
        if (species == null) return NotFound();
        return Ok(species);
    }

    [HttpPost]
    public async Task<ActionResult<Species>> Create(CreateSpeciesRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { message = "Namn krävs." });
        }

        var trimmedName = request.Name.Trim();

        var exists = await _context.Species.AnyAsync(s =>
            s.Name.ToLower() == trimmedName.ToLower());

        if (exists)
        {
            return BadRequest(new { message = "Arten finns redan." });
        }

        var species = new Species
        {
            Id = Guid.NewGuid(),
            Name = trimmedName
        };

        _context.Species.Add(species);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = species.Id }, species);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var species = await _context.Species.FindAsync(id);
        if (species == null) return NotFound();

        _context.Species.Remove(species);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}