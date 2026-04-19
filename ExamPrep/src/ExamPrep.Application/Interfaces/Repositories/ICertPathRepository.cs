using ExamPrep.Domain.Entities;

namespace ExamPrep.Application.Interfaces.Repositories;

public interface ICertPathRepository : IRepository<CertPath>
{
    Task<IEnumerable<CertPath>> GetAllActiveAsync();
    Task<CertPath?> GetWithDetailsAsync(int id);
}
