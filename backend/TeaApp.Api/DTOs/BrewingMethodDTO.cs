using System.ComponentModel.DataAnnotations;
using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs;

public class BrewingMethodDTO : IValidatableObject
{
    [Required]
    [Range(1, int.MaxValue)]
    public int? teaId {get;set;}

    [Required]
    [EnumDataType(typeof(MethodType))]
    public MethodType? method {get;set;}

    [Required]
    [Range(typeof(int), "-100", "100")]
    public int? temperature {get;set;}

    [Required]
    [Range(typeof(decimal), "0", "20")]
    public decimal? amountPerHundred {get;set;}

    [Required]
    [MinLength(1)]
    public List<int> brewingTimes {get;set;} = [];

    public int? gongfuBrewingTimeIncrement {get;set;}

    public IEnumerable<ValidationResult> Validate(ValidationContext uValidationContext)
    {
        //Brewing times
        if(brewingTimes.Any(uTime => uTime <= 0))
        {
            yield return new ValidationResult(
                "Every brewing time must be greater than zero.",
                [nameof(brewingTimes)]
            );
        }
        if(brewingTimes.Count > 10)
        {
            yield return new ValidationResult(
                "Brewing times list cannot contain more than 10 values",
                [nameof(brewingTimes)]
            );
        }

        //Gongfu time increments
        if(gongfuBrewingTimeIncrement.HasValue && gongfuBrewingTimeIncrement.Value <= 0)
        {
            yield return new ValidationResult(
                "Gongfu brewing time increment must be greater than zero.",
                [nameof(gongfuBrewingTimeIncrement)]
            );
        }
        if(method != MethodType.Gongfu && gongfuBrewingTimeIncrement.HasValue)
        {
            yield return new ValidationResult(
                "Gongfu brewing time increment can only be set for Gongfu methods.",
                [nameof(gongfuBrewingTimeIncrement)]
            );
        }
    }
}