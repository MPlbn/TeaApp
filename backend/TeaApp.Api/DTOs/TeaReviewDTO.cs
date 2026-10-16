using System.ComponentModel.DataAnnotations;

namespace TeaApp.Api.DTOs;

public class TeaReviewDTO
{
    [Required]
    [Range(1, int.MaxValue)]
    public int? teaId {get;set;}

    //User will be changed once Users are implemented
    [Required]
    [Range(1, int.MaxValue)]
    public int? userId {get;set;}

    [Required]
    [MinLength(1)]
    public string review {get;set;} = "";

    [Required]
    [Range(typeof(int), "1", "10")]
    public int rating {get;set;}
}