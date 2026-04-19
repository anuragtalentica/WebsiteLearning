namespace ExamPrep.Domain.Entities;

public class Lesson
{
    public int Id { get; set; }
    public int ModuleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? CodeExample { get; set; }
    public string? CodeLanguage { get; set; }
    public string? ExternalLinks { get; set; } // JSON array: [{"title":"...","url":"..."}]
    public int OrderIndex { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Module Module { get; set; } = null!;
    public ICollection<Question> Questions { get; set; } = new List<Question>();
}
