namespace FishingLog.Api.Models;

public class FishingTrip
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid? LocationId { get; set; }
    public Location? Location { get; set; }

    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }

    public string? Weather { get; set; }
    public string? Notes { get; set; }

    public ICollection<CatchEntry> CatchEntries { get; set; } = new List<CatchEntry>();
}
