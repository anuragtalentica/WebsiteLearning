using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Domain.Entities;
using ExamPrep.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.Infrastructure.Repositories;

public class TestAttemptRepository : GenericRepository<TestAttempt>, ITestAttemptRepository
{
    public TestAttemptRepository(ExamPrepDbContext context) : base(context) { }

    public async Task<IEnumerable<TestAttempt>> GetByUserAsync(string userId)
        => await _dbSet
            .Where(a => a.UserId == userId)
            .Include(a => a.MockTest)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

    public async Task<IEnumerable<TestAttempt>> GetByUserAndTestAsync(string userId, int mockTestId)
        => await _dbSet
            .Where(a => a.UserId == userId && a.MockTestId == mockTestId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

    public async Task<TestAttempt?> GetByIdWithDetailsAsync(int attemptId)
        => await _dbSet
            .Include(a => a.MockTest)
                .ThenInclude(mt => mt.TestQuestions.OrderBy(tq => tq.OrderIndex))
                    .ThenInclude(tq => tq.Question)
                        .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(a => a.Id == attemptId);
}
