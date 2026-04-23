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

}