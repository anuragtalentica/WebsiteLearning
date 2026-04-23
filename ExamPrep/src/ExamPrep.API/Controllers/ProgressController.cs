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
public class ProgressController : ControllerBase
{
    private readonly ExamPrepDbContext _db;
    public ProgressController(ExamPrepDbContext db) => _db = db;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    // POST /api/progress/lessons/{lessonId} — mark a lesson as viewed
    [HttpPost("lessons/{lessonId:int}")]
    public async Task<ActionResult<ApiResponse<object>>> MarkLessonViewed(int lessonId)
    {
        var lesson = await _db.Lessons.FindAsync(lessonId);
        if (lesson == null) return NotFound(ApiResponse<object>.Fail("Lesson not found."));

        // Get certificationId via module
        var certId = await _db.Modules
            .Where(m => m.Id == lesson.ModuleId)
            .Select(m => m.CertificationId)
            .FirstOrDefaultAsync();

        var exists = await _db.UserLessonProgress
            .AnyAsync(p => p.UserId == UserId && p.LessonId == lessonId);

        if (!exists)
        {
            _db.UserLessonProgress.Add(new UserLessonProgress
            {
                UserId = UserId,
                LessonId = lessonId,
                CertificationId = certId,
                ViewedAt = DateTime.UtcNow
            });
            await _db.SaveChangesAsync();
        }

        return Ok(ApiResponse<object>.Ok(new { marked = true }));
    }

    // GET /api/progress/courses — courses started with % complete per cert
    [HttpGet("courses")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CourseProgressDto>>>> GetCourseProgress()
    {
        var userId = UserId;

        // All lesson counts per certification
        var lessonCountsPerCert = await _db.Lessons
            .Join(_db.Modules, l => l.ModuleId, m => m.Id, (l, m) => new { l.Id, m.CertificationId })
            .GroupBy(x => x.CertificationId)
            .Select(g => new { CertificationId = g.Key, TotalLessons = g.Count() })
            .ToListAsync();

        // Lessons viewed by this user per certification
        var viewedPerCert = await _db.UserLessonProgress
            .Where(p => p.UserId == userId)
            .GroupBy(p => p.CertificationId)
            .Select(g => new { CertificationId = g.Key, ViewedCount = g.Count() })
            .ToListAsync();

        // Certs the user has started (has at least 1 viewed lesson)
        var startedCertIds = viewedPerCert.Select(v => v.CertificationId).ToList();
        if (!startedCertIds.Any())
            return Ok(ApiResponse<IEnumerable<CourseProgressDto>>.Ok(new List<CourseProgressDto>()));

        var certs = await _db.Certifications
            .Where(c => startedCertIds.Contains(c.Id))
            .Select(c => new { c.Id, c.Name, c.Code, c.Vendor })
            .ToListAsync();

        var result = certs.Select(c =>
        {
            var total = lessonCountsPerCert.FirstOrDefault(x => x.CertificationId == c.Id)?.TotalLessons ?? 0;
            var viewed = viewedPerCert.FirstOrDefault(x => x.CertificationId == c.Id)?.ViewedCount ?? 0;
            var pct = total > 0 ? (int)Math.Round(viewed * 100.0 / total) : 0;
            return new CourseProgressDto
            {
                CertificationId = c.Id,
                CertificationName = c.Name,
                CertificationCode = c.Code,
                Vendor = c.Vendor,
                TotalLessons = total,
                CompletedLessons = viewed,
                PercentComplete = pct
            };
        }).OrderByDescending(x => x.PercentComplete).ToList();

        return Ok(ApiResponse<IEnumerable<CourseProgressDto>>.Ok(result));
    }

    // GET /api/progress/lessons/ids?certificationId=X — lesson IDs viewed by user for a cert
    [HttpGet("lessons/ids")]
    public async Task<ActionResult<ApiResponse<IEnumerable<int>>>> GetViewedLessonIds([FromQuery] int certificationId)
    {
        var ids = await _db.UserLessonProgress
            .Where(p => p.UserId == UserId && p.CertificationId == certificationId)
            .Select(p => p.LessonId)
            .ToListAsync();

        return Ok(ApiResponse<IEnumerable<int>>.Ok(ids));
    }
}

public class CourseProgressDto
{
    public int CertificationId { get; set; }
    public string CertificationName { get; set; } = "";
    public string CertificationCode { get; set; } = "";
    public string Vendor { get; set; } = "";
    public int TotalLessons { get; set; }
    public int CompletedLessons { get; set; }
    public int PercentComplete { get; set; }
}
