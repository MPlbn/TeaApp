using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs;

public class TeaResponseDTO
{
    public int id {get;set;}
    public string name {get;set;} = "";
    public TeaType type {get;set;}
    public decimal price {get;set;}
    public string origin {get;set;} = "";
    public string shop {get;set;} = "";
    public string description {get;set;} = "";
}