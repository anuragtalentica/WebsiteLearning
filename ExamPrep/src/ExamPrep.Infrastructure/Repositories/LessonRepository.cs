using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Domain.Entities;
using ExamPrep.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.Infrastructure.Repositories;

public class LessonRepository : GenericRepository<Lesson>, ILessonRepository
{
    public LessonRepository(ExamPrepDbContext context) : base(context) { }

    public async Task<IEnumerable<Lesson>> GetByModuleAsync(int moduleId)
        => await _dbSet
            .Where(l => l.ModuleId == moduleId)
            .OrderBy(l => l.OrderIndex)
            .ToListAsync();

    public async Task<Lesson?> GetWithQuestionsAsync(int lessonId)
        => await _dbSet
            .Include(l => l.Questions)
                .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(l => l.Id == lessonId);
}
