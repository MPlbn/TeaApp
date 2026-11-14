namespace TeaApp.Api.Models;

public class TeaWare {
    public int Id { get; set; }
    public string OwnerId { get; set; } = "";
    public ApplicationUser? User { get; set; }
    public string Name { get; set; } = "";
    public int Capacity { get; set; }
}