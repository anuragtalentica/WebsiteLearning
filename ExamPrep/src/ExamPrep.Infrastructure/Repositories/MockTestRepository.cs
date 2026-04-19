using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Domain.Entities;
using ExamPrep.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.Infrastructure.Repositories;

public class MockTestRepository : GenericRepository<MockTest>, IMockTestRepository
{
    public MockTestRepository(ExamPrepDbContext context) : base(context) { }

    public async Task<IEnumerable<MockTest>> GetAllActiveAsync()
        => await _dbSet
            .Where(t => t.IsActive)
            .Include(t => t.Certification)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

    public async Task<IEnumerable<MockTest>> GetByCertificationAsync(int certificationId)
        => await _dbSet
            .Where(t => t.CertificationId == certificationId && t.IsActive)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

    public async Task<MockTest?> GetWithQuestionsAsync(int testId)
        => await _dbSet
            .Include(t => t.TestQuestions.OrderBy(tq => tq.OrderIndex))
                .ThenInclude(tq => tq.Question)
                    .ThenInclude(q => q.Options)
            .Include(t => t.Certification)
            .FirstOrDefaultAsync(t => t.Id == testId);
}
