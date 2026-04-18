namespace FishingLog.Api.Models;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Name { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CatchEntry> CatchEntries { get; set; } = new List<CatchEntry>();
    public ICollection<FishingTrip> FishingTrips { get; set; } = new List<FishingTrip>();
}
