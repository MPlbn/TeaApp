using System.ComponentModel.DataAnnotations;

namespace TeaApp.Api.Models;

public class TeaReview {
    public int Id { get; set; }
    public int TeaId { get; set; }
    public Tea Tea { get; set; } = null!;
    public string? UserId { get; set; } = null!;
    public ApplicationUser User { get; set; } = null!;
    public string Review { get; set; } = "";
    public int Rating { get; set; }
}