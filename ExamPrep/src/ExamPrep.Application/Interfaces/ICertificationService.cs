using ExamPrep.Application.DTOs;

namespace ExamPrep.Application.Interfaces;

public interface ICertificationService
{
    Task<IEnumerable<CertificationDto>> GetAllAsync();
    Task<CertificationDetailDto?> GetByIdAsync(int id);
}
