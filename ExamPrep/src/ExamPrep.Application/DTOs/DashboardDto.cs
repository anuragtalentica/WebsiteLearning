namespace ExamPrep.Application.DTOs;

public class DashboardDto
{
    public int TotalQuestionsAttempted { get; set; }
    public int TotalCorrect { get; set; }
    public double AccuracyPercentage { get; set; }
    public int TestsTaken { get; set; }
    public int TestsPassed { get; set; }
    public List<RecentAttemptDto> RecentAttempts { get; set; } = new();
    public List<CategoryStatsDto> CategoryStats { get; set; } = new();
}

public class RecentAttemptDto
{
    public string Type { get; set; } = string.Empty; // "question" or "test"
    public string Title { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public DateTime AttemptedAt { get; set; }
}

public class CategoryStatsDto
{
    public string Category { get; set; } = string.Empty;
    public int Attempted { get; set; }
    public int Correct { get; set; }
}
