using System.ComponentModel.DataAnnotations;

namespace TeaApp.Api.DTOs;

public class TeaReviewDTO
{
    [Required]
    [Range(1, int.MaxValue)]
    public int? TeaId {get;set;}

    //User will be changed once Users are implemented
    [Required]
    [Range(1, int.MaxValue)]
    public int? UserId {get;set;}

    [Required]
    [MinLength(1)]
    public string Review {get;set;} = "";

    [Required]
    [Range(typeof(int), "1", "10")]
    public int Rating {get;set;}
}