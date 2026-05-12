namespace FishingLog.Api.DTOs.Catches;

public class CatchEntryDto
{
    public Guid Id { get; set; }

    public string SpeciesName { get; set; } = null!;
    public string? LocationName { get; set; }
    public string? LureName { get; set; }

    public DateTime CaughtAt { get; set; }

    public decimal? Weight { get; set; }
    public decimal? Length { get; set; }

    public bool Released { get; set; }

    public string? Technique { get; set; }
    public string? Notes { get; set; }
    public string? Weather { get; set; }
    public string? WaterTemperature { get; set; }
}