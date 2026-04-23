using System.Security.Claims;
using ExamPrep.API.Models;
using ExamPrep.Domain.Entities;
using ExamPrep.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookmarksController : ControllerBase
{
    private readonly ExamPrepDbContext _db;

    public BookmarksController(ExamPrepDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<BookmarkDto>>>> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var bookmarks = await _db.UserBookmarks
            .Where(b => b.UserId == userId)
            .Include(b => b.Question).ThenInclude(q => q.Options)
            .Include(b => b.Question).ThenInclude(q => q.Topic)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new BookmarkDto
            {
                Id = b.Id,
                QuestionId = b.QuestionId,
                QuestionText = b.Question.QuestionText,
                Explanation = b.Question.Explanation,
                DifficultyLevel = b.Question.DifficultyLevel,
                TopicName = b.Question.Topic.Name,
                Options = b.Question.Options.OrderBy(o => o.OrderIndex).Select(o => new BookmarkOptionDto
                {
                    Id = o.Id,
                    OptionText = o.OptionText,
                    IsCorrect = o.IsCorrect
                }).ToList(),
                CreatedAt = b.CreatedAt
            })
            .ToListAsync();

        return Ok(ApiResponse<IEnumerable<BookmarkDto>>.Ok(bookmarks));
    }

    [HttpPost("{questionId}")]
    public async Task<ActionResult<ApiResponse<string>>> Add(int questionId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var exists = await _db.UserBookmarks.AnyAsync(b => b.UserId == userId && b.QuestionId == questionId);
        if (exists) return Ok(ApiResponse<string>.Ok("already bookmarked"));

        _db.UserBookmarks.Add(new UserBookmark { UserId = userId, QuestionId = questionId });
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("bookmarked"));
    }

    [HttpDelete("{questionId}")]
    public async Task<ActionResult<ApiResponse<string>>> Remove(int questionId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var bookmark = await _db.UserBookmarks.FirstOrDefaultAsync(b => b.UserId == userId && b.QuestionId == questionId);
        if (bookmark == null) return NotFound(ApiResponse<string>.Fail("not found"));

        _db.UserBookmarks.Remove(bookmark);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("removed"));
    }

    [HttpGet("ids")]
    public async Task<ActionResult<ApiResponse<IEnumerable<int>>>> GetBookmarkedIds()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var ids = await _db.UserBookmarks
            .Where(b => b.UserId == userId)
            .Select(b => b.QuestionId)
            .ToListAsync();
        return Ok(ApiResponse<IEnumerable<int>>.Ok(ids));
    }
}

public class BookmarkDto
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string QuestionText { get; set; } = "";
    public string? Explanation { get; set; }
    public int DifficultyLevel { get; set; }
    public string TopicName { get; set; } = "";
    public List<BookmarkOptionDto> Options { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class BookmarkOptionDto
{
    public int Id { get; set; }
    public string OptionText { get; set; } = "";
    public bool IsCorrect { get; set; }
}
