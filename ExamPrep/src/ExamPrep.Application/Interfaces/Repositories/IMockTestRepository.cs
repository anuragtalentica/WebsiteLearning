using ExamPrep.Domain.Entities;

namespace ExamPrep.Application.Interfaces.Repositories;

public interface IMockTestRepository : IRepository<MockTest>
{
    Task<IEnumerable<MockTest>> GetByCertificationAsync(int certificationId);
    Task<MockTest?> GetWithQuestionsAsync(int testId);
    Task<IEnumerable<MockTest>> GetAllActiveAsync();
}
