namespace ExamPrep.Application.DTOs;

public class NewsDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
    public string? Url { get; set; }
    public DateTime PublishedAt { get; set; }
}

public class CreateNewsDto
{
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
    public string? Url { get; set; }
    public DateTime? PublishedAt { get; set; }
}
