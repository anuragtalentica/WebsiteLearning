namespace ExamPrep.Domain.Entities;

public class MockTest
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = "mock"; // "mock" or "exam"
    public int? CertificationId { get; set; }
    public int DurationMinutes { get; set; } = 30;
    public bool NegativeMarking { get; set; }
    public int PassingScore { get; set; } = 60; // percentage
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Certification? Certification { get; set; }
    public ICollection<TestQuestion> TestQuestions { get; set; } = new List<TestQuestion>();
    public ICollection<TestAttempt> Attempts { get; set; } = new List<TestAttempt>();
}
