using ExamPrep.Domain.Entities;

namespace ExamPrep.Application.Interfaces.Repositories;

public interface ITestAttemptRepository : IRepository<TestAttempt>
{
    Task<IEnumerable<TestAttempt>> GetByUserAsync(string userId);
    Task<IEnumerable<TestAttempt>> GetByUserAndTestAsync(string userId, int mockTestId);
    Task<TestAttempt?> GetByIdWithDetailsAsync(int attemptId);
}
