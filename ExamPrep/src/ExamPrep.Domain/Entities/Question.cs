namespace ExamPrep.Domain.Entities;

public class Question
{
    public int Id { get; set; }
    public int TopicId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string? Explanation { get; set; }
    public string? ImageUrl { get; set; }
    public int DifficultyLevel { get; set; } = 1;
    public int? LessonId { get; set; }
    public int? CertificationId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Topic Topic { get; set; } = null!;
    public Lesson? Lesson { get; set; }
    public Certification? Certification { get; set; }
    public ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
    public ICollection<UserQuestionAttempt> Attempts { get; set; } = new List<UserQuestionAttempt>();
}
