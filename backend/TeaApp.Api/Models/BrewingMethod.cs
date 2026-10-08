namespace TeaApp.Api.Models;
public class BrewingMethod
{
    public int ID {get;set;}
    public int TeaId {get;set;}
    public Tea Tea {get;set;} = null!;
    public MethodType Method {get;set;}
    public int Temperature {get;set;}
    public List<int> BrewingTimes {get;set;} = [];
}