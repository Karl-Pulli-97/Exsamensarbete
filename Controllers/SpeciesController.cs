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
}