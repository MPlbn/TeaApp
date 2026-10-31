namespace TeaApp.Api.DTOs.Auth;

public class LoginRequestDTO
{
    public string Login {get;set;} = string.Empty; //email or user name
    public string Password {get;set;} = string.Empty;
}