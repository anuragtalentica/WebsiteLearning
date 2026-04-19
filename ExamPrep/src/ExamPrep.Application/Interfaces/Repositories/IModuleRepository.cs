using ExamPrep.Domain.Entities;

namespace ExamPrep.Application.Interfaces.Repositories;

public interface IModuleRepository : IRepository<Module>
{
    Task<IEnumerable<Module>> GetByCertificationAsync(int certificationId);
    Task<Module?> GetWithLessonsAsync(int moduleId);
}
