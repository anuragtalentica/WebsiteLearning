namespace ExamPrep.Application.DTOs;

public class MockTestDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = "mock"; // mock | exam
    public int? CertificationId { get; set; }
    public string? CertificationName { get; set; }
    public int DurationMinutes { get; set; }
    public bool NegativeMarking { get; set; }
    public int PassingScore { get; set; }
    public int QuestionCount { get; set; }
}

public class MockTestDetailDto : MockTestDto
{
    public List<TestQuestionDto> Questions { get; set; } = new();
}

public class TestQuestionDto
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public int OrderIndex { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public List<OptionDto> Options { get; set; } = new();
}

public class CreateMockTestDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = "mock";
    public int? CertificationId { get; set; }
    public int DurationMinutes { get; set; } = 60;
    public bool NegativeMarking { get; set; }
    public int PassingScore { get; set; } = 70;
    public List<int> QuestionIds { get; set; } = new();
}

public class SubmitTestDto
{
    public int MockTestId { get; set; }
    public int TimeTakenSeconds { get; set; }
    public Dictionary<int, int> Answers { get; set; } = new(); // QuestionId -> SelectedOptionId
}

public class TestResultDto
{
    public int AttemptId { get; set; }
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public int WrongAnswers { get; set; }
    public int Skipped { get; set; }
    public int TimeTakenSeconds { get; set; }
    public bool Passed { get; set; }
    public int PassingScore { get; set; }
}

public class TestAttemptDto
{
    public int Id { get; set; }
    public int MockTestId { get; set; }
    public string? TestTitle { get; set; }
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public int WrongAnswers { get; set; }
    public int Skipped { get; set; }
    public int TimeTakenSeconds { get; set; }
    public bool Passed { get; set; }
    public DateTime CreatedAt { get; set; }
}
