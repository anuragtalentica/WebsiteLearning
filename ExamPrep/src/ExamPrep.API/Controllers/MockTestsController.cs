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
public class MockTestsController : ControllerBase
{
    private readonly IMockTestService _testService;
    private readonly ExamPrepDbContext _db;

    public MockTestsController(IMockTestService testService, ExamPrepDbContext db)
    {
        _testService = testService;
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<MockTestDto>>>> GetAll()
    {
        var tests = await _testService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<MockTestDto>>.Ok(tests));
    }

    [HttpGet("certification/{certificationId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<MockTestDto>>>> GetByCertification(int certificationId)
    {
        var tests = await _testService.GetByCertificationAsync(certificationId);
        return Ok(ApiResponse<IEnumerable<MockTestDto>>.Ok(tests));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<MockTestDetailDto>>> GetById(int id)
    {
        var test = await _testService.GetByIdAsync(id);
        if (test == null)
            return NotFound(ApiResponse<MockTestDetailDto>.Fail("Test not found"));
        return Ok(ApiResponse<MockTestDetailDto>.Ok(test));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ApiResponse<MockTestDto>>> Create([FromBody] CreateMockTestDto dto)
    {
        var test = await _testService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = test.Id }, ApiResponse<MockTestDto>.Ok(test));
    }

    [HttpPost("submit")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<TestResultDto>>> Submit([FromBody] SubmitTestDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _testService.SubmitTestAsync(userId, dto);
        return Ok(ApiResponse<TestResultDto>.Ok(result));
    }

    [HttpGet("attempts")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<IEnumerable<TestAttemptDto>>>> GetMyAttempts()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var attempts = await _testService.GetUserAttemptsAsync(userId);
        return Ok(ApiResponse<IEnumerable<TestAttemptDto>>.Ok(attempts));
    }

    [HttpGet("attempts/{attemptId}/review")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<TestReviewDto>>> GetReview(int attemptId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var review = await _testService.GetAttemptReviewAsync(attemptId, userId);
        if (review == null)
            return NotFound(ApiResponse<TestReviewDto>.Fail("Attempt not found"));
        return Ok(ApiResponse<TestReviewDto>.Ok(review));
    }

    // GET /api/mocktests/my-best-scores — returns { testId: bestScorePct } for the logged-in user
    [HttpGet("my-best-scores")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<Dictionary<int, int>>>> GetMyBestScores()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var scores = await _db.TestAttempts
            .Where(a => a.UserId == userId)
            .GroupBy(a => a.MockTestId)
            .Select(g => new { TestId = g.Key, Best = g.Max(a => a.Score) })
            .ToListAsync();

        var result = scores.ToDictionary(s => s.TestId, s => (int)Math.Round((double)s.Best));
        return Ok(ApiResponse<Dictionary<int, int>>.Ok(result));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var result = await _testService.DeleteAsync(id);
        if (!result)
            return NotFound(ApiResponse<bool>.Fail("Test not found"));
        return Ok(ApiResponse<bool>.Ok(true));
    }
}
