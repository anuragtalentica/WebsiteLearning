namespace ExamPrep.Application.DTOs;

public class LessonSummaryDto
{
    public int Id { get; set; }
    public int ModuleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
}

public class LessonDetailDto : LessonSummaryDto
{
    public string Content { get; set; } = string.Empty;
    public string? CodeExample { get; set; }
    public string? CodeLanguage { get; set; }
    public string? ExternalLinks { get; set; } // JSON array of links
    public int QuestionCount { get; set; }
}

public class CreateLessonDto
{
    public int ModuleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? CodeExample { get; set; }
    public string? CodeLanguage { get; set; }
    public string? ExternalLinks { get; set; }
    public int OrderIndex { get; set; }
}

public class UpdateLessonDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? CodeExample { get; set; }
    public string? CodeLanguage { get; set; }
    public string? ExternalLinks { get; set; }
    public int OrderIndex { get; set; }
}
