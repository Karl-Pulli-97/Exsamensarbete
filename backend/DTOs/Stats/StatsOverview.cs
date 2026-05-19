namespace FishingLog.Api.DTOs.Stats;

public class StatsOverviewDto
{
    public int TotalCatches { get; set; }
    public int ReleasedCatches { get; set; }
    public int CatchesThisMonth { get; set; }
    public int FishingTrips { get; set; }
    public decimal? LargestWeight { get; set; }
    public decimal? LargestLength { get; set; }
    public string? MostCaughtSpecies { get; set; }
    public string? BestLure { get; set; }
    public string? BestLocation { get; set; }
}