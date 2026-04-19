using ExamPrep.Domain.Entities;

namespace ExamPrep.Application.Interfaces.Repositories;

public interface IQuestionRepository : IRepository<Question>
{
    Task<IEnumerable<Question>> GetByTopicAsync(int topicId);
    Task<Question?> GetWithOptionsAsync(int id);
    Task<IEnumerable<UserQuestionAttempt>> GetUserAttemptsAsync(string userId);
}
