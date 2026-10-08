namespace TeaApp.Api.Models;
public class Tea
{
    public int ID {get;set;}
    public string Name {get;set;} = "";
    public TeaType Type {get;set;}
    public decimal Price {get;set;}
    public string Origin {get;set;} = ""; //country
    public string Shop {get;set;} = "";
    public string Description {get;set;} = "";
    public ICollection<TeaReview> Reviews {get;set;} = [];
    public ICollection<BrewingMethod> BrewingMethods {get;set;} = [];
}