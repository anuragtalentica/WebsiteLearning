using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using ExamPrep.Application.Interfaces.Repositories;

namespace ExamPrep.Application.Services;

public class CertPathService : ICertPathService
{
    private readonly ICertPathRepository _certPathRepo;

    public CertPathService(ICertPathRepository certPathRepo)
    {
        _certPathRepo = certPathRepo;
    }

    public async Task<IEnumerable<CertPathDto>> GetAllAsync()
    {
        var paths = await _certPathRepo.GetAllActiveAsync();
        return paths.Select(p => new CertPathDto
        {
            Id = p.Id,
            Title = p.Title,
            Description = p.Description,
            Goal = p.Goal,
            BadgeColor = p.BadgeColor,
            EstimatedWeeks = p.EstimatedWeeks,
            CourseCount = p.Courses.Count,
            TestCount = p.Tests.Count
        });
    }

    public async Task<CertPathDetailDto?> GetByIdAsync(int id)
    {
        var path = await _certPathRepo.GetWithDetailsAsync(id);
        if (path == null) return null;

        return new CertPathDetailDto
        {
            Id = path.Id,
            Title = path.Title,
            Description = path.Description,
            Goal = path.Goal,
            BadgeColor = path.BadgeColor,
            EstimatedWeeks = path.EstimatedWeeks,
            CourseCount = path.Courses.Count,
            TestCount = path.Tests.Count,
            Courses = path.Courses.Select(c => new CertPathCourseDto
            {
                Id = c.Id,
                CertificationId = c.CertificationId,
                CertificationName = c.Certification.Name,
                CertificationCode = c.Certification.Code,
                OrderIndex = c.OrderIndex,
                Description = c.Description
            }).ToList(),
            Tests = path.Tests.Select(t => new CertPathTestDto
            {
                Id = t.Id,
                MockTestId = t.MockTestId,
                MockTestTitle = t.MockTest.Title
            }).ToList()
        };
    }
}
