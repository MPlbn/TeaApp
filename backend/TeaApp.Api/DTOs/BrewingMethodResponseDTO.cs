using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs;

public class BrewingMethodResponseDTO
{
    public int id {get;set;}
    public int teaId {get;set;}
    public MethodType method {get;set;}
    public int temperature {get;set;}
    public List<int> brewingTimes {get;set;} = [];
    public int? gongfuBrewingTimeIncrement {get;set;}
}