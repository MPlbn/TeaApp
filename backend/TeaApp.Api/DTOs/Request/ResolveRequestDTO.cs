using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs.Request;

public class ResolveRequestDTO() {
    public RequestStatus Status { get; set; }
    public string? ResolutionMessage { get; set; }
}