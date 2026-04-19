using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Domain.Entities;
using ExamPrep.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.Infrastructure.Repositories;

public class QuestionRepository : GenericRepository<Question>, IQuestionRepository
{
    public QuestionRepository(ExamPrepDbContext context) : base(context) { }

    public async Task<IEnumerable<Question>> GetByTopicAsync(int topicId)
        => await _dbSet
            .Where(q => q.TopicId == topicId)
            .Include(q => q.Options.OrderBy(o => o.OrderIndex))
            .OrderBy(q => q.Id)
            .ToListAsync();

    public async Task<Question?> GetWithOptionsAsync(int id)
        => await _dbSet
            .Include(q => q.Options.OrderBy(o => o.OrderIndex))
            .FirstOrDefaultAsync(q => q.Id == id);

    public async Task<IEnumerable<UserQuestionAttempt>> GetUserAttemptsAsync(string userId)
        => await _context.UserQuestionAttempts
            .Where(a => a.UserId == userId)
            .Include(a => a.Question)
            .OrderByDescending(a => a.AttemptedAt)
            .ToListAsync();
}
