namespace ExamPrep.Domain.Entities;

public class TestAttempt
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int MockTestId { get; set; }
    public int Score { get; set; } // percentage
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public int WrongAnswers { get; set; }
    public int Skipped { get; set; }
    public int TimeTakenSeconds { get; set; }
    public bool Passed { get; set; }
    public string? Answers { get; set; } // JSON: [{"questionId":1,"selectedOptionId":3,"isCorrect":true}]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public MockTest MockTest { get; set; } = null!;
}
