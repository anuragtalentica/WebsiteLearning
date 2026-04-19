using ExamPrep.Application.DTOs;

namespace ExamPrep.Application.Interfaces;

public interface ICertPathService
{
    Task<IEnumerable<CertPathDto>> GetAllAsync();
    Task<CertPathDetailDto?> GetByIdAsync(int id);
}
