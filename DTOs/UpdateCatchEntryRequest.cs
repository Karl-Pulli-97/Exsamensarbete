namespace FishingLog.Api.DTOs.Catches;

public class UpdateCatchEntryRequest
{
    public Guid SpeciesId { get; set; }
    public Guid? LocationId { get; set; }
    public Guid? LureId { get; set; }
    public Guid? FishingTripId { get; set; }

    public DateTime CaughtAt { get; set; }

    public decimal? Weight { get; set; }
    public decimal? Length { get; set; }

    public bool Released { get; set; }

    public string? Technique { get; set; }
    public string? Notes { get; set; }
    public string? Weather { get; set; }
    public string? WaterTemperature { get; set; }
}