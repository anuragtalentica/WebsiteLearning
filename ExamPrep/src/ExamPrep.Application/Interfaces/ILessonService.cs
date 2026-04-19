using ExamPrep.Application.DTOs;

namespace ExamPrep.Application.Interfaces;

public interface ILessonService
{
    Task<IEnumerable<LessonSummaryDto>> GetByModuleAsync(int moduleId);
    Task<LessonDetailDto?> GetByIdAsync(int lessonId);
    Task<LessonSummaryDto> CreateAsync(CreateLessonDto dto);
    Task<LessonSummaryDto?> UpdateAsync(int id, UpdateLessonDto dto);
    Task<bool> DeleteAsync(int id);
}
