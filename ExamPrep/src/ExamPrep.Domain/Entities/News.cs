namespace ExamPrep.Domain.Entities;

public class News
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = "General"; // AI, Cloud, Programming, General
    public string? Url { get; set; }
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
