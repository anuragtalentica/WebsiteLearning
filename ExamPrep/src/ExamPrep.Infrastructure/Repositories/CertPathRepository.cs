using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Domain.Entities;
using ExamPrep.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.Infrastructure.Repositories;

public class CertPathRepository : GenericRepository<CertPath>, ICertPathRepository
{
    public CertPathRepository(ExamPrepDbContext context) : base(context) { }

    public async Task<IEnumerable<CertPath>> GetAllActiveAsync()
        => await _dbSet
            .Where(p => p.IsActive)
            .Include(p => p.Courses)
                .ThenInclude(c => c.Certification)
            .Include(p => p.Tests)
                .ThenInclude(t => t.MockTest)
            .OrderBy(p => p.Title)
            .ToListAsync();

    public async Task<CertPath?> GetWithDetailsAsync(int id)
        => await _dbSet
            .Include(p => p.Courses.OrderBy(c => c.OrderIndex))
                .ThenInclude(c => c.Certification)
            .Include(p => p.Tests)
                .ThenInclude(t => t.MockTest)
            .FirstOrDefaultAsync(p => p.Id == id);
}
