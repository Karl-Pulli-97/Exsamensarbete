namespace FishingLog.Api.Models;

public class Location
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;

    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    public string? Description { get; set; }

    public ICollection<CatchEntry> CatchEntries { get; set; } = new List<CatchEntry>();
    public ICollection<FishingTrip> FishingTrips { get; set; } = new List<FishingTrip>();
}
