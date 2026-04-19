namespace ExamPrep.Application.DTOs;

public class QuestionDto
{
    public int Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public int DifficultyLevel { get; set; }
    public List<OptionDto> Options { get; set; } = new();
}

public class OptionDto
{
    public int Id { get; set; }
    public string OptionText { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
}
