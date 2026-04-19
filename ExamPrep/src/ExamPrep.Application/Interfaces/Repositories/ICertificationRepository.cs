using ExamPrep.Domain.Entities;

namespace ExamPrep.Application.Interfaces.Repositories;

public interface ICertificationRepository : IRepository<Certification>
{
    Task<IEnumerable<Certification>> GetAllActiveAsync();
    Task<Certification?> GetWithTopicsAsync(int id);
}
