using System.ComponentModel.DataAnnotations;

namespace TeaApp.Api.Models;
public class TeaReview
{
    public int id {get;set;}
    public int teaId {get;set;}
    public Tea tea {get;set;} = null!;
    public int userId {get;set;}
    public string review {get;set;} = "";
    public int rating {get;set;}
}