using System.ComponentModel.DataAnnotations;
using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs;

public class TeaDTO
{
    [Required]
    [MinLength(1)]
    public string name {get;set;} = "";

    [Required]
    [EnumDataType(typeof(TeaType))]
    public TeaType? type {get;set;}

    [Required]
    [Range(typeof(decimal), "0.01", "999999.99")]
    public decimal? price {get;set;}

    public string origin {get;set;} = "";
    public string shop {get;set;} = "";
    public string description {get;set;} = "";
}