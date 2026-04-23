namespace FishingLog.Api.Models;

public class CatchEntry
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }

    public Guid SpeciesId { get; set; }
    public Species? Species { get; set; }

    public Guid? LocationId { get; set; }
    public Location? Location { get; set; }

    public Guid? LureId { get; set; }
    public Lure? Lure { get; set; }

    public Guid? FishingTripId { get; set; }
    public FishingTrip? FishingTrip { get; set; }

    public DateTime CaughtAt { get; set; }

    public decimal? Weight { get; set; }
    public decimal? Length { get; set; }

    public bool Released { get; set; }

    public string? Technique { get; set; }
    public string? Notes { get; set; }

    public string? Weather { get; set; }
    public string? WaterTemperature { get; set; }

    public string? ImageUrl { get; set; }
}
