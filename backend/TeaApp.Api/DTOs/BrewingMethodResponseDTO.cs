using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs;

public class BrewingMethodResponseDTO
{
    public int ID {get;set;}
    public int TeaId {get;set;}
    public MethodType Method {get;set;}
    public int Temperature {get;set;}
    public List<int> BrewingTimes {get;set;} = [];
    public int? GongfuBrewingTimeIncrement {get;set;}
}