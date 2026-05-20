namespace FishingLog.Api.DTOs.Stats;

public class SpeciesStatsDto
{
    public string SpeciesName { get; set; } = null!;
    public int Count { get; set; }
    public decimal? AverageWeight { get; set; }
    public decimal? LargestWeight { get; set; }
    public decimal? AverageLength { get; set; }
    public decimal? LargestLength { get; set; }
}