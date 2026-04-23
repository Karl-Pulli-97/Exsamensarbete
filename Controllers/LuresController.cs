using FishingLog.Api.Data;
using FishingLog.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingLog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
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

        if (lure == null)
        {
            return NotFound();
        }

        return Ok(lure);
    }

    [HttpPost]
    public async Task<ActionResult<Lure>> Create(Lure lure)
    {
        lure.Id = Guid.NewGuid();

        _context.Lures.Add(lure);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = lure.Id }, lure);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, Lure lure)
    {
        if (id != lure.Id)
        {
            return BadRequest();
        }

        var existing = await _context.Lures.FindAsync(id);

        if (existing == null)
        {
            return NotFound();
        }

        existing.Name = lure.Name;
        existing.Type = lure.Type;
        existing.Color = lure.Color;
        existing.Brand = lure.Brand;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var lure = await _context.Lures.FindAsync(id);

        if (lure == null)
        {
            return NotFound();
        }

        _context.Lures.Remove(lure);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}