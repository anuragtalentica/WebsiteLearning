using System.ComponentModel.DataAnnotations;

namespace ExamPrep.Application.DTOs;

public class SubmitAnswerDto
{
    [Required]
    public int SelectedOptionId { get; set; }
}

public class AnswerResultDto
{
    public bool IsCorrect { get; set; }
    public int CorrectOptionId { get; set; }
    public string? Explanation { get; set; }
}
