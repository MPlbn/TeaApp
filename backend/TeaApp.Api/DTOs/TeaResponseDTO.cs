using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs;

public class TeaResponseDTO
{
    public int ID {get;set;}
    public string Name {get;set;} = "";
    public TeaType Type {get;set;}
    public decimal Price {get;set;}
    public string Origin {get;set;} = "";
    public string Shop {get;set;} = "";
    public string Description {get;set;} = "";
}