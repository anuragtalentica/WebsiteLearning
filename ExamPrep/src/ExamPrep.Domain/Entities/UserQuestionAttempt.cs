namespace ExamPrep.Domain.Entities;

public class UserQuestionAttempt
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int QuestionId { get; set; }
    public int SelectedOptionId { get; set; }
    public bool IsCorrect { get; set; }
    public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;

    public Question Question { get; set; } = null!;
    public QuestionOption SelectedOption { get; set; } = null!;
}
