using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs;

public class TeaListItemResponseDTO
{
    public int id {get;set;}
    public string name {get;set;} = "";
    public TeaType type {get;set;}
    public string origin {get;set;} = "";
}