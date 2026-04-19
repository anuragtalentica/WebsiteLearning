using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Domain.Entities;

namespace ExamPrep.Application.Services;

public class QuestionService : IQuestionService
{
    private readonly IQuestionRepository _questionRepo;
    private readonly IRepository<UserQuestionAttempt> _attemptRepo;

    public QuestionService(IQuestionRepository questionRepo, IRepository<UserQuestionAttempt> attemptRepo)
    {
        _questionRepo = questionRepo;
        _attemptRepo = attemptRepo;
    }

    public async Task<IEnumerable<QuestionDto>> GetByTopicAsync(int topicId)
    {
        var questions = await _questionRepo.GetByTopicAsync(topicId);
        return questions.Select(MapToDto);
    }

    public async Task<QuestionDto?> GetByIdAsync(int id)
    {
        var question = await _questionRepo.GetWithOptionsAsync(id);
        return question == null ? null : MapToDto(question);
    }

    public async Task<AnswerResultDto> SubmitAnswerAsync(int questionId, string userId, SubmitAnswerDto dto)
    {
        var question = await _questionRepo.GetWithOptionsAsync(questionId)
            ?? throw new InvalidOperationException("Question not found.");

        var selectedOption = question.Options.FirstOrDefault(o => o.Id == dto.SelectedOptionId)
            ?? throw new InvalidOperationException("Invalid option selected.");

        var correctOption = question.Options.First(o => o.IsCorrect);

        var attempt = new UserQuestionAttempt
        {
            UserId = userId,
            QuestionId = questionId,
            SelectedOptionId = dto.SelectedOptionId,
            IsCorrect = selectedOption.IsCorrect,
            AttemptedAt = DateTime.UtcNow
        };

        await _attemptRepo.AddAsync(attempt);
        await _attemptRepo.SaveChangesAsync();

        return new AnswerResultDto
        {
            IsCorrect = selectedOption.IsCorrect,
            CorrectOptionId = correctOption.Id,
            Explanation = question.Explanation
        };
    }

    private static QuestionDto MapToDto(Question q) => new()
    {
        Id = q.Id,
        QuestionText = q.QuestionText,
        DifficultyLevel = q.DifficultyLevel,
        Options = q.Options.Select(o => new OptionDto
        {
            Id = o.Id,
            OptionText = o.OptionText,
            OrderIndex = o.OrderIndex
        }).ToList()
    };
}
