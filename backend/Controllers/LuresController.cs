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
public class LuresController : ControllerBase
{
    private readonly FishingLogDbContext _context;

    public LuresController(FishingLogDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Lure>>> GetAll()
    {
        var lures = await _context.Lures.OrderBy(l => l.Name).ToListAsync();
        return Ok(lures);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Lure>> GetById(Guid id)
    {
        var lure = await _context.Lures.FindAsync(id);
        if (lure == null) return NotFound();
        return Ok(lure);
    }

    [HttpPost]
    public async Task<ActionResult<Lure>> Create(CreateLureRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { message = "Namn krävs." });
        }

        var trimmedName = request.Name.Trim();

        var exists = await _context.Lures.AnyAsync(l =>
            l.Name.ToLower() == trimmedName.ToLower());

        if (exists)
        {
            return BadRequest(new { message = "Betet finns redan." });
        }

        var lure = new Lure
        {
            Id = Guid.NewGuid(),
            Name = trimmedName
        };

        _context.Lures.Add(lure);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = lure.Id }, lure);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var lure = await _context.Lures.FindAsync(id);
        if (lure == null) return NotFound();

        _context.Lures.Remove(lure);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}