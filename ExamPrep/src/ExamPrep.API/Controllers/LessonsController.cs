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
public class LessonsController : ControllerBase
{
    private readonly ILessonService _lessonService;
    private readonly ExamPrepDbContext _db;

    public LessonsController(ILessonService lessonService, ExamPrepDbContext db)
    {
        _lessonService = lessonService;
        _db = db;
    }

    [HttpGet("module/{moduleId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<LessonSummaryDto>>>> GetByModule(int moduleId)
    {
        var lessons = await _lessonService.GetByModuleAsync(moduleId);
        return Ok(ApiResponse<IEnumerable<LessonSummaryDto>>.Ok(lessons));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<LessonDetailDto>>> GetById(int id)
    {
        var lesson = await _lessonService.GetByIdAsync(id);
        if (lesson == null)
            return NotFound(ApiResponse<LessonDetailDto>.Fail("Lesson not found"));
        return Ok(ApiResponse<LessonDetailDto>.Ok(lesson));
    }

    // GET /api/lessons/{id}/navigation — prev/next lesson IDs within the same module
    [HttpGet("{id}/navigation")]
    public async Task<ActionResult<ApiResponse<LessonNavDto>>> GetNavigation(int id)
    {
        var lesson = await _db.Lessons.FindAsync(id);
        if (lesson == null) return NotFound(ApiResponse<LessonNavDto>.Fail("Lesson not found"));

        var siblings = await _db.Lessons
            .Where(l => l.ModuleId == lesson.ModuleId)
            .OrderBy(l => l.OrderIndex)
            .Select(l => new { l.Id, l.Title, l.OrderIndex })
            .ToListAsync();

        var idx = siblings.FindIndex(l => l.Id == id);
        var prev = idx > 0 ? siblings[idx - 1] : null;
        var next = idx < siblings.Count - 1 ? siblings[idx + 1] : null;

        var module = await _db.Modules.FindAsync(lesson.ModuleId);

        return Ok(ApiResponse<LessonNavDto>.Ok(new LessonNavDto
        {
            PrevId = prev?.Id,
            PrevTitle = prev?.Title,
            NextId = next?.Id,
            NextTitle = next?.Title,
            CertificationId = module?.CertificationId,
            CurrentPosition = idx + 1,
            TotalInModule = siblings.Count
        }));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ApiResponse<LessonSummaryDto>>> Create([FromBody] CreateLessonDto dto)
    {
        var lesson = await _lessonService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = lesson.Id }, ApiResponse<LessonSummaryDto>.Ok(lesson));
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<LessonSummaryDto>>> Update(int id, [FromBody] UpdateLessonDto dto)
    {
        var lesson = await _lessonService.UpdateAsync(id, dto);
        if (lesson == null)
            return NotFound(ApiResponse<LessonSummaryDto>.Fail("Lesson not found"));
        return Ok(ApiResponse<LessonSummaryDto>.Ok(lesson));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var result = await _lessonService.DeleteAsync(id);
        if (!result)
            return NotFound(ApiResponse<bool>.Fail("Lesson not found"));
        return Ok(ApiResponse<bool>.Ok(true));
    }
}

public class LessonNavDto
{
    public int? PrevId { get; set; }
    public string? PrevTitle { get; set; }
    public int? NextId { get; set; }
    public string? NextTitle { get; set; }
    public int? CertificationId { get; set; }
    public int CurrentPosition { get; set; }
    public int TotalInModule { get; set; }
}
