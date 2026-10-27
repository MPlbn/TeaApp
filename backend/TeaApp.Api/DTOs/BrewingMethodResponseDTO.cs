using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs;

public class BrewingMethodResponseDTO
{
    public int Id {get;set;}
    public int TeaId {get;set;}
    public MethodType Method {get;set;}
    public int Temperature {get;set;}
    public decimal AmountPerHundred {get;set;}
    public List<int> BrewingTimes {get;set;} = [];
    public int? GongfuBrewingTimeIncrement {get;set;}
}