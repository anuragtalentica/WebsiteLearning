using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Domain.Entities;

namespace ExamPrep.Application.Services;

public class LessonService : ILessonService
{
    private readonly ILessonRepository _lessonRepo;

    public LessonService(ILessonRepository lessonRepo)
    {
        _lessonRepo = lessonRepo;
    }

    public async Task<IEnumerable<LessonSummaryDto>> GetByModuleAsync(int moduleId)
    {
        var lessons = await _lessonRepo.GetByModuleAsync(moduleId);
        return lessons.Select(l => new LessonSummaryDto
        {
            Id = l.Id,
            ModuleId = l.ModuleId,
            Title = l.Title,
            OrderIndex = l.OrderIndex
        });
    }

    public async Task<LessonDetailDto?> GetByIdAsync(int lessonId)
    {
        var lesson = await _lessonRepo.GetWithQuestionsAsync(lessonId);
        if (lesson == null) return null;

        return new LessonDetailDto
        {
            Id = lesson.Id,
            ModuleId = lesson.ModuleId,
            Title = lesson.Title,
            OrderIndex = lesson.OrderIndex,
            Content = lesson.Content,
            CodeExample = lesson.CodeExample,
            CodeLanguage = lesson.CodeLanguage,
            ExternalLinks = lesson.ExternalLinks,
            QuestionCount = lesson.Questions.Count
        };
    }

    public async Task<LessonSummaryDto> CreateAsync(CreateLessonDto dto)
    {
        var lesson = new Lesson
        {
            ModuleId = dto.ModuleId,
            Title = dto.Title,
            Content = dto.Content,
            CodeExample = dto.CodeExample,
            CodeLanguage = dto.CodeLanguage,
            ExternalLinks = dto.ExternalLinks,
            OrderIndex = dto.OrderIndex
        };

        await _lessonRepo.AddAsync(lesson);
        await _lessonRepo.SaveChangesAsync();

        return new LessonSummaryDto
        {
            Id = lesson.Id,
            ModuleId = lesson.ModuleId,
            Title = lesson.Title,
            OrderIndex = lesson.OrderIndex
        };
    }

    public async Task<LessonSummaryDto?> UpdateAsync(int id, UpdateLessonDto dto)
    {
        var lesson = await _lessonRepo.GetByIdAsync(id);
        if (lesson == null) return null;

        lesson.Title = dto.Title;
        lesson.Content = dto.Content;
        lesson.CodeExample = dto.CodeExample;
        lesson.CodeLanguage = dto.CodeLanguage;
        lesson.ExternalLinks = dto.ExternalLinks;
        lesson.OrderIndex = dto.OrderIndex;

        _lessonRepo.Update(lesson);
        await _lessonRepo.SaveChangesAsync();

        return new LessonSummaryDto
        {
            Id = lesson.Id,
            ModuleId = lesson.ModuleId,
            Title = lesson.Title,
            OrderIndex = lesson.OrderIndex
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var lesson = await _lessonRepo.GetByIdAsync(id);
        if (lesson == null) return false;

        _lessonRepo.Remove(lesson);
        await _lessonRepo.SaveChangesAsync();
        return true;
    }
}
