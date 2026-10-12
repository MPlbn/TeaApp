using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs;

public class TeaListItemResponseDTO
{
    public int ID {get;set;}
    public string Name {get;set;} = "";
    public TeaType Type {get;set;}
    public string Origin {get;set;} = "";
}