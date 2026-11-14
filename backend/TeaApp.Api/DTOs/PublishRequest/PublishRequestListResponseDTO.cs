using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs.PublishRequest;

public class PublishRequestListResponseDTO {
    public int Id { get; set; }
    public int TeaId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public string? ResolverUserName { get; set; }
    public PublishRequestStatus Status { get; set; }
    public string? OwnerId { get; set; }
    public string? OwnerUserName { get; set; }
}