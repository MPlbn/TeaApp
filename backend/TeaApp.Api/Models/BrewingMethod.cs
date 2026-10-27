namespace TeaApp.Api.Models;
public class BrewingMethod
{
    public int Id {get;set;}
    public int TeaId {get;set;}
    public Tea Tea {get;set;} = null!;
    public MethodType Method {get;set;}
    public int Temperature {get;set;}
    public decimal AmountPerHundred {get;set;}
    public List<int> BrewingTimes {get;set;} = [];
    public int? GongfuBrewingTimeIncrement {get;set;}
}