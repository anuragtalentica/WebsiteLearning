namespace ExamPrep.Domain.Entities;

public class UserLessonProgress
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int LessonId { get; set; }
    public int CertificationId { get; set; }
    public DateTime ViewedAt { get; set; } = DateTime.UtcNow;

    public Lesson Lesson { get; set; } = null!;
    public Certification Certification { get; set; } = null!;
}
