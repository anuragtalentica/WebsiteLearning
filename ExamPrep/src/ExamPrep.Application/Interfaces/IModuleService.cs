using ExamPrep.Application.DTOs;

namespace ExamPrep.Application.Interfaces;

public interface IModuleService
{
    Task<IEnumerable<ModuleDto>> GetByCertificationAsync(int certificationId);
    Task<ModuleDetailDto?> GetByIdAsync(int moduleId);
    Task<ModuleDto> CreateAsync(CreateModuleDto dto);
    Task<ModuleDto?> UpdateAsync(int id, UpdateModuleDto dto);
    Task<bool> DeleteAsync(int id);
}
