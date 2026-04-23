using System.Security.Claims;
using ExamPrep.API.Models;
using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using ExamPrep.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly IQuestionService _questionService;
    private readonly ExamPrepDbContext _db;

    public QuestionsController(IQuestionService questionService, ExamPrepDbContext db)
    {
        _questionService = questionService;
        _db = db;
    }

    [HttpGet("topic/{topicId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<QuestionDto>>>> GetByTopic(int topicId)
    {
        var questions = await _questionService.GetByTopicAsync(topicId);
        return Ok(ApiResponse<IEnumerable<QuestionDto>>.Ok(questions));
    }

    // GET /api/questions/topic/{topicId}/info — get topic's certificationId for back-navigation
    [HttpGet("topic/{topicId}/info")]
    public async Task<ActionResult<ApiResponse<TopicInfoDto>>> GetTopicInfo(int topicId)
    {
        var topic = await _db.Topics
            .Where(t => t.Id == topicId)
            .Select(t => new TopicInfoDto { Id = t.Id, Name = t.Name, CertificationId = t.CertificationId })
            .FirstOrDefaultAsync();
        if (topic == null) return NotFound(ApiResponse<TopicInfoDto>.Fail("Topic not found."));
        return Ok(ApiResponse<TopicInfoDto>.Ok(topic));
    }

    // POST /api/questions/by-ids — fetch specific questions by IDs (for retry wrong)
    [HttpPost("by-ids")]
    public async Task<ActionResult<ApiResponse<IEnumerable<QuestionDto>>>> GetByIds([FromBody] List<int> ids)
    {
        var questions = await _db.Questions
            .Include(q => q.Options)
            .Where(q => ids.Contains(q.Id))
            .ToListAsync();

        var dtos = questions.Select(q => new QuestionDto
        {
            Id = q.Id,
            QuestionText = q.QuestionText,
            ImageUrl = q.ImageUrl,
            DifficultyLevel = q.DifficultyLevel,
            Options = q.Options.OrderBy(o => o.OrderIndex).Select(o => new OptionDto
            {
                Id = o.Id,
                OptionText = o.OptionText,
                OrderIndex = o.OrderIndex
            }).ToList()
        });

        return Ok(ApiResponse<IEnumerable<QuestionDto>>.Ok(dtos));
    }

    // GET /api/questions/topic/{topicId}/stats — difficulty breakdown
    [HttpGet("topic/{topicId}/stats")]
    public async Task<ActionResult<ApiResponse<TopicStatsDto>>> GetTopicStats(int topicId)
    {
        var counts = await _db.Questions
            .Where(q => q.TopicId == topicId)
            .GroupBy(q => q.DifficultyLevel)
            .Select(g => new { Difficulty = g.Key, Count = g.Count() })
            .ToListAsync();

        var stats = new TopicStatsDto
        {
            Easy   = counts.FirstOrDefault(c => c.Difficulty == 1)?.Count ?? 0,
            Medium = counts.FirstOrDefault(c => c.Difficulty == 2)?.Count ?? 0,
            Hard   = counts.FirstOrDefault(c => c.Difficulty == 3)?.Count ?? 0,
        };
        stats.Total = stats.Easy + stats.Medium + stats.Hard;
        return Ok(ApiResponse<TopicStatsDto>.Ok(stats));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<QuestionDto>>> GetById(int id)
    {
        var question = await _questionService.GetByIdAsync(id);
        if (question == null)
            return NotFound(ApiResponse<QuestionDto>.Fail("Question not found."));

        return Ok(ApiResponse<QuestionDto>.Ok(question));
    }

    [Authorize]
    [HttpPost("{id}/submit")]
    public async Task<ActionResult<ApiResponse<AnswerResultDto>>> SubmitAnswer(int id, [FromBody] SubmitAnswerDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(ApiResponse<AnswerResultDto>.Fail("User not authenticated."));

        try
        {
            var result = await _questionService.SubmitAnswerAsync(id, userId, dto);
            return Ok(ApiResponse<AnswerResultDto>.Ok(result));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<AnswerResultDto>.Fail(ex.Message));
        }
    }
}

public class TopicInfoDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int CertificationId { get; set; }
}

public class TopicStatsDto
{
    public int Easy { get; set; }
    public int Medium { get; set; }
    public int Hard { get; set; }
    public int Total { get; set; }
}
