namespace TeaApp.Api.Models;
public class Tea
{
    public int id {get;set;}
    public string name {get;set;} = "";
    public TeaType type {get;set;}
    public decimal price {get;set;}
    public string origin {get;set;} = ""; //country
    public string shop {get;set;} = "";
    public string description {get;set;} = "";
    public ICollection<TeaReview> reviews {get;set;} = [];
    public ICollection<BrewingMethod> brewingMethods {get;set;} = [];
}