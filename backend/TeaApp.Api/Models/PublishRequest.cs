namespace TeaApp.Api.Models;

public class PublishRequest {
    // PK + FK do Request
    public int Id { get; set; }
    public required Request Request { get; set; }
    public int TeaId { get; set; }
    public required Tea Tea { get; set; }
}