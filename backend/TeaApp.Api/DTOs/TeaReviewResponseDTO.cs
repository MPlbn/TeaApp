namespace TeaApp.Api.DTOs;

public class TeaReviewResponseDTO
{
    public int ID {get;set;}
    public int TeaId {get;set;}
    public int UserId {get;set;}
    public string Review {get;set;} = "";
    public int Rating {get;set;}
}