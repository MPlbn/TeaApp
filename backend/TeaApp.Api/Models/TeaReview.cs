using System.ComponentModel.DataAnnotations;

namespace TeaApp.Api.Models;
public class TeaReview
{
    public int ID {get;set;}
    public int TeaId {get;set;}
    public Tea Tea {get;set;} = null!;
    public int UserId {get;set;}
    public string Review {get;set;} = "";
    [Range(1,10)]
    public int Rating {get;set;}
}