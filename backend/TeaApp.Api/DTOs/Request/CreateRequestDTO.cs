using System.Text.Json;
using TeaApp.Api.Models;

namespace TeaApp.Api.DTOs.Request;

public class CreateRequestDTO {
    public RequestType Type { get; set; }
    public required JsonElement Details { get; set; }
}