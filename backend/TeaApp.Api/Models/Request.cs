namespace TeaApp.Api.Models;

public class Request {
    public int Id { get; set; }

    public RequestType Type { get; set; }
    public RequestStatus Status { get; set; }
    public required string OwnerId { get; set; }
    public required ApplicationUser Owner { get; set; }

    public string? ResolvingAdminId { get; set; }
    public ApplicationUser? ResolvingAdmin { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }

    public string? ResolutionMessage { get; set; }
}