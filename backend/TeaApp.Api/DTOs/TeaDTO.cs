using System.ComponentModel.DataAnnotations;
using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs;

public class TeaDTO
{
    [Required]
    [MinLength(1)]
    public string Name {get;set;} = "";

    [Required]
    [EnumDataType(typeof(TeaType))]
    public TeaType? Type {get;set;}

    [Required]
    [Range(typeof(decimal), "0.01", "999999.99")]
    public decimal? Price {get;set;}

    public string Origin {get;set;} = "";
    public string Shop {get;set;} = "";
    public string Description {get;set;} = "";
}