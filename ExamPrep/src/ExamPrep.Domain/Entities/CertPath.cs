namespace ExamPrep.Domain.Entities;

public class CertPath
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Goal { get; set; }
    public string? BadgeColor { get; set; } // CSS color for UI badge
    public int EstimatedWeeks { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CertPathCourse> Courses { get; set; } = new List<CertPathCourse>();
    public ICollection<CertPathTest> Tests { get; set; } = new List<CertPathTest>();
}
