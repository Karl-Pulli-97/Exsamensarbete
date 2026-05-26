using System.ComponentModel.DataAnnotations;

namespace FishingLog.Api.DTOs.ReferenceData;

public class CreateSpeciesRequest
{
    [Required(ErrorMessage = "Namn är obligatoriskt.")]
    [MinLength(2, ErrorMessage = "Namnet måste vara minst 2 tecken.")]
    [MaxLength(100, ErrorMessage = "Namnet får vara max 100 tecken.")]
    public string Name { get; set; } = null!;
}
