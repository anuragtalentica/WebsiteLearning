using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Domain.Entities;

namespace ExamPrep.Application.Services;

public class NewsService : INewsService
{
    private readonly INewsRepository _newsRepo;

    public NewsService(INewsRepository newsRepo)
    {
        _newsRepo = newsRepo;
    }

    public async Task<IEnumerable<NewsDto>> GetLatestAsync(int count = 10)
    {
        var news = await _newsRepo.GetLatestAsync(count);
        return news.Select(MapToDto);
    }

    public async Task<IEnumerable<NewsDto>> GetByCategoryAsync(string category)
    {
        var news = await _newsRepo.GetByCategoryAsync(category);
        return news.Select(MapToDto);
    }

    public async Task<NewsDto> CreateAsync(CreateNewsDto dto)
    {
        var news = new News
        {
            Title = dto.Title,
            Category = dto.Category,
            Url = dto.Url,
            PublishedAt = dto.PublishedAt ?? DateTime.UtcNow
        };

        await _newsRepo.AddAsync(news);
        await _newsRepo.SaveChangesAsync();

        return MapToDto(news);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var news = await _newsRepo.GetByIdAsync(id);
        if (news == null) return false;

        _newsRepo.Remove(news);
        await _newsRepo.SaveChangesAsync();
        return true;
    }

    private static NewsDto MapToDto(News n) => new()
    {
        Id = n.Id,
        Title = n.Title,
        Category = n.Category,
        Url = n.Url,
        PublishedAt = n.PublishedAt
    };
}
