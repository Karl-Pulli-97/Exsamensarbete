using FishingLog.Api.Data;
using FishingLog.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingLog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
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

        if (species == null)
            return NotFound();

        return Ok(species);
    }
}