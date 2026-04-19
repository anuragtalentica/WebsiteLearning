using ExamPrep.Domain.Entities;

namespace ExamPrep.Application.Interfaces.Repositories;

public interface INewsRepository : IRepository<News>
{
    Task<IEnumerable<News>> GetLatestAsync(int count);
    Task<IEnumerable<News>> GetByCategoryAsync(string category);
}
