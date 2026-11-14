namespace TeaApp.Api.Models;

public class PublishRequest {
    public int Id { get; set; }
    public int TeaId { get; set; }
    public Tea Tea { get; set; } = null!;
    public string? ResolutionMessage { get; set; }
    public string? ResolvingAdminId { get; set; }
    public PublishRequestStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}