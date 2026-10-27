namespace TeaApp.Api.Models;
public class Flavor
{
    public int Id {get;set;}
    public int TeaId {get;set;}
    public FlavorType FlavorType {get;set;}
    public Tea Tea {get;set;} = null!;
}