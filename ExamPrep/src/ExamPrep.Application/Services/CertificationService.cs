using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using ExamPrep.Application.Interfaces.Repositories;

namespace ExamPrep.Application.Services;

public class CertificationService : ICertificationService
{
    private readonly ICertificationRepository _certRepo;

    public CertificationService(ICertificationRepository certRepo)
    {
        _certRepo = certRepo;
    }

    public async Task<IEnumerable<CertificationDto>> GetAllAsync()
    {
        var certs = await _certRepo.GetAllActiveAsync();
        return certs.Select(c => new CertificationDto
        {
            Id = c.Id,
            Vendor = c.Vendor,
            Name = c.Name,
            Code = c.Code,
            Description = c.Description,
            ImageUrl = c.ImageUrl,
            Category = c.Category,
            Difficulty = c.Difficulty
        });
    }

    public async Task<CertificationDetailDto?> GetByIdAsync(int id)
    {
        var cert = await _certRepo.GetWithTopicsAsync(id);
        if (cert == null) return null;

        return new CertificationDetailDto
        {
            Id = cert.Id,
            Vendor = cert.Vendor,
            Name = cert.Name,
            Code = cert.Code,
            Description = cert.Description,
            ImageUrl = cert.ImageUrl,
            Category = cert.Category,
            Difficulty = cert.Difficulty,
            Topics = cert.Topics.Select(t => new TopicDto
            {
                Id = t.Id,
                Name = t.Name,
                OrderIndex = t.OrderIndex,
                QuestionCount = t.Questions.Count
            }).ToList()
        };
    }
}
