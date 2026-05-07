namespace FishingLog.Api.DTOs.Catches;

public class CatchFilterRequest
{
    public Guid? SpeciesId { get; set; }
    public Guid? LocationId { get; set; }
    public Guid? LureId { get; set; }

    public DateTime? From { get; set; }
    public DateTime? To { get; set; }

    public bool? Released { get; set; }
}