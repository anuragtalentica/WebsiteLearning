using ExamPrep.API.Models;
using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsController : ControllerBase
{
    private readonly INewsService _newsService;

    public NewsController(INewsService newsService)
    {
        _newsService = newsService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<NewsDto>>>> GetLatest([FromQuery] int count = 10)
    {
        var news = await _newsService.GetLatestAsync(count);
        return Ok(ApiResponse<IEnumerable<NewsDto>>.Ok(news));
    }

    [HttpGet("category/{category}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<NewsDto>>>> GetByCategory(string category)
    {
        var news = await _newsService.GetByCategoryAsync(category);
        return Ok(ApiResponse<IEnumerable<NewsDto>>.Ok(news));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ApiResponse<NewsDto>>> Create([FromBody] CreateNewsDto dto)
    {
        var news = await _newsService.CreateAsync(dto);
        return Ok(ApiResponse<NewsDto>.Ok(news));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var result = await _newsService.DeleteAsync(id);
        if (!result)
            return NotFound(ApiResponse<bool>.Fail("News item not found"));
        return Ok(ApiResponse<bool>.Ok(true));
    }
}
