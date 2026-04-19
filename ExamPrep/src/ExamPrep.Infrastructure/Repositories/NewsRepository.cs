using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Domain.Entities;
using ExamPrep.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.Infrastructure.Repositories;

public class NewsRepository : GenericRepository<News>, INewsRepository
{
    public NewsRepository(ExamPrepDbContext context) : base(context) { }

    public async Task<IEnumerable<News>> GetLatestAsync(int count)
        => await _dbSet
            .OrderByDescending(n => n.PublishedAt)
            .Take(count)
            .ToListAsync();

    public async Task<IEnumerable<News>> GetByCategoryAsync(string category)
        => await _dbSet
            .Where(n => n.Category == category)
            .OrderByDescending(n => n.PublishedAt)
            .ToListAsync();
}
