using ExamPrep.Application.DTOs;

namespace ExamPrep.Application.Interfaces;

public interface INewsService
{
    Task<IEnumerable<NewsDto>> GetLatestAsync(int count = 10);
    Task<IEnumerable<NewsDto>> GetByCategoryAsync(string category);
    Task<NewsDto> CreateAsync(CreateNewsDto dto);
    Task<bool> DeleteAsync(int id);
}
