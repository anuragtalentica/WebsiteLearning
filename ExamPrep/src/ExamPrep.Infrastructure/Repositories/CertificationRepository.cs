using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Domain.Entities;
using ExamPrep.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.Infrastructure.Repositories;

public class CertificationRepository : GenericRepository<Certification>, ICertificationRepository
{
    public CertificationRepository(ExamPrepDbContext context) : base(context) { }

    public async Task<IEnumerable<Certification>> GetAllActiveAsync()
        => await _dbSet.Where(c => c.IsActive).OrderBy(c => c.Vendor).ThenBy(c => c.Name).ToListAsync();

    public async Task<Certification?> GetWithTopicsAsync(int id)
        => await _dbSet.Include(c => c.Topics.OrderBy(t => t.OrderIndex))
            .FirstOrDefaultAsync(c => c.Id == id);
}
