using ExamPrep.Application.DTOs;

namespace ExamPrep.Application.Interfaces;

public interface IQuestionService
{
    Task<IEnumerable<QuestionDto>> GetByTopicAsync(int topicId);
    Task<QuestionDto?> GetByIdAsync(int id);
    Task<AnswerResultDto> SubmitAnswerAsync(int questionId, string? userId, SubmitAnswerDto dto);
}
