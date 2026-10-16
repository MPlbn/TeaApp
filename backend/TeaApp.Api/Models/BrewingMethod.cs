namespace TeaApp.Api.Models;
public class BrewingMethod
{
    public int id {get;set;}
    public int teaId {get;set;}
    public Tea tea {get;set;} = null!;
    public MethodType method {get;set;}
    public int temperature {get;set;}
    public List<int> brewingTimes {get;set;} = [];
    public int? gongfuBrewingTimeIncrement {get;set;}
}