namespace FishingLog.Api.Models;

public class Lure
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Type { get; set; }
    public string? Color { get; set; }
    public string? Brand { get; set; }

    public ICollection<CatchEntry> CatchEntries { get; set; } = new List<CatchEntry>();
}
