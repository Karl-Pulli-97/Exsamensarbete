namespace FishingLog.Api.Models;

public class Species
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;

    public ICollection<CatchEntry> CatchEntries { get; set; } = new List<CatchEntry>();
}
