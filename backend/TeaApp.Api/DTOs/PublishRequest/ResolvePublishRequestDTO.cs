using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs.PublishRequest;

public class ResolvePublishRequestDTO {
    public PublishRequestStatus Status { get; set; }
    public string? ResolutionMessage { get; set; }
}