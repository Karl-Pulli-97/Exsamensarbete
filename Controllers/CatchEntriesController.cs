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
}