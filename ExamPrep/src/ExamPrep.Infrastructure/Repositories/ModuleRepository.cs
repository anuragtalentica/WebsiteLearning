using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Domain.Entities;
using ExamPrep.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.Infrastructure.Repositories;

public class ModuleRepository : GenericRepository<Module>, IModuleRepository
{
    public ModuleRepository(ExamPrepDbContext context) : base(context) { }

    public async Task<IEnumerable<Module>> GetByCertificationAsync(int certificationId)
        => await _dbSet
            .Where(m => m.CertificationId == certificationId)
            .OrderBy(m => m.OrderIndex)
            .Include(m => m.Lessons)
            .ToListAsync();

    public async Task<Module?> GetWithLessonsAsync(int moduleId)
        => await _dbSet
            .Include(m => m.Lessons.OrderBy(l => l.OrderIndex))
            .FirstOrDefaultAsync(m => m.Id == moduleId);
}
