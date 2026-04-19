using ExamPrep.API.Models;
using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LessonsController : ControllerBase
{
    private readonly ILessonService _lessonService;

    public LessonsController(ILessonService lessonService)
    {
        _lessonService = lessonService;
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
