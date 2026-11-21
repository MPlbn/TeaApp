using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs.Request;

public class RequestListResponseDTO {
    public int Id { get; set; }
    public RequestType Type { get; set; }
    public RequestStatus Status { get; set; }
    public string? OwnerId { get; set; }
    public string? OwnerUserName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public string? ResolutionMessage { get; set; }
    public string? ResolverUserName { get; set; }
    public object? Details { get; set; }
}