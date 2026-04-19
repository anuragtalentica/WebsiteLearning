using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Domain.Entities;

namespace ExamPrep.Application.Services;

public class ModuleService : IModuleService
{
    private readonly IModuleRepository _moduleRepo;

    public ModuleService(IModuleRepository moduleRepo)
    {
        _moduleRepo = moduleRepo;
    }

    public async Task<IEnumerable<ModuleDto>> GetByCertificationAsync(int certificationId)
    {
        var modules = await _moduleRepo.GetByCertificationAsync(certificationId);
        return modules.Select(m => new ModuleDto
        {
            Id = m.Id,
            CertificationId = m.CertificationId,
            Title = m.Title,
            OrderIndex = m.OrderIndex,
            LessonCount = m.Lessons.Count
        });
    }

    public async Task<ModuleDetailDto?> GetByIdAsync(int moduleId)
    {
        var module = await _moduleRepo.GetWithLessonsAsync(moduleId);
        if (module == null) return null;

        return new ModuleDetailDto
        {
            Id = module.Id,
            CertificationId = module.CertificationId,
            Title = module.Title,
            OrderIndex = module.OrderIndex,
            LessonCount = module.Lessons.Count,
            Lessons = module.Lessons.Select(l => new LessonSummaryDto
            {
                Id = l.Id,
                ModuleId = l.ModuleId,
                Title = l.Title,
                OrderIndex = l.OrderIndex
            }).ToList()
        };
    }

    public async Task<ModuleDto> CreateAsync(CreateModuleDto dto)
    {
        var module = new Module
        {
            CertificationId = dto.CertificationId,
            Title = dto.Title,
            OrderIndex = dto.OrderIndex
        };

        await _moduleRepo.AddAsync(module);
        await _moduleRepo.SaveChangesAsync();

        return new ModuleDto
        {
            Id = module.Id,
            CertificationId = module.CertificationId,
            Title = module.Title,
            OrderIndex = module.OrderIndex,
            LessonCount = 0
        };
    }

    public async Task<ModuleDto?> UpdateAsync(int id, UpdateModuleDto dto)
    {
        var module = await _moduleRepo.GetByIdAsync(id);
        if (module == null) return null;

        module.Title = dto.Title;
        module.OrderIndex = dto.OrderIndex;

        _moduleRepo.Update(module);
        await _moduleRepo.SaveChangesAsync();

        return new ModuleDto
        {
            Id = module.Id,
            CertificationId = module.CertificationId,
            Title = module.Title,
            OrderIndex = module.OrderIndex
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var module = await _moduleRepo.GetByIdAsync(id);
        if (module == null) return false;

        _moduleRepo.Remove(module);
        await _moduleRepo.SaveChangesAsync();
        return true;
    }
}
