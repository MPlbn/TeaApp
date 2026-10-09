using System.ComponentModel.DataAnnotations;
using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs;

public class BrewingMethodDTO : IValidatableObject
{
    [Required]
    [Range(1, int.MaxValue)]
    public int? TeaId {get;set;}

    [Required]
    [EnumDataType(typeof(MethodType))]
    public MethodType? Method {get;set;}

    [Required]
    [Range(typeof(int), "-100", "100")]
    public int? Temperature {get;set;}

    [Required]
    [MinLength(1)]
    public List<int> BrewingTimes {get;set;} = [];

    public int? GongfuBrewingTimeIncrement {get;set;}

    public IEnumerable<ValidationResult> Validate(ValidationContext uValidationContext)
    {
        //Brewing times
        if(BrewingTimes.Any(uTime => uTime <= 0))
        {
            yield return new ValidationResult(
                "Every brewing time must be greater than zero.",
                [nameof(BrewingTimes)]
            );
        }
        if(BrewingTimes.Count > 10)
        {
            yield return new ValidationResult(
                "Brewing times list cannot contain more than 10 values",
                [nameof(BrewingTimes)]
            );
        }

        //Gongfu time increments
        if(GongfuBrewingTimeIncrement.HasValue && GongfuBrewingTimeIncrement.Value <= 0)
        {
            yield return new ValidationResult(
                "Gongfu brewing time increment must be greater than zero.",
                [nameof(GongfuBrewingTimeIncrement)]
            );
        }
        if(Method != MethodType.Gongfu && GongfuBrewingTimeIncrement.HasValue)
        {
            yield return new ValidationResult(
                "Gongfu brewing time increment can only be set for Gongfu methods.",
                [nameof(GongfuBrewingTimeIncrement)]
            );
        }
    }
}