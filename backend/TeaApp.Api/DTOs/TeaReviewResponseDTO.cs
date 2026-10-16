namespace TeaApp.Api.DTOs;

public class TeaReviewResponseDTO
{
    public int id {get;set;}
    public int teaId {get;set;}
    public int userId {get;set;}
    public string review {get;set;} = "";
    public int rating {get;set;}
}