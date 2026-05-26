using System.ComponentModel.DataAnnotations;

namespace FishingLog.Api.DTOs.Catches;

public class CatchEntryRequest
{
    [Required(ErrorMessage = "Art är obligatoriskt.")]
    public Guid SpeciesId { get; set; }
    public Guid? LocationId { get; set; }
    public Guid? LureId { get; set; }
    public Guid? FishingTripId { get; set; }
    [Required(ErrorMessage = "Fångstdatum är obligatoriskt.")]
    public DateTime CaughtAt { get; set; }
    [Range(0, 1000, ErrorMessage = "Vikt måste vara mellan 0 och 1000 kg.")]
    public decimal? Weight { get; set; }
    [Range(0, 1000, ErrorMessage = "Längd måste vara mellan 0 och 1000 cm.")]
    public decimal? Length { get; set; }
    public bool Released { get; set; }
    public string? Technique { get; set; }

    [MaxLength(1000, ErrorMessage = "Anteckningar får vara max 1000 tecken.")]
    public string? Notes { get; set; }
    public string? Weather { get; set; }
    public string? WaterTemperature { get; set; }
}