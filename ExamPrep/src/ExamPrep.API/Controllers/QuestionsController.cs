using System.Security.Claims;
using ExamPrep.API.Models;
using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly IQuestionService _questionService;

    public QuestionsController(IQuestionService questionService)
    {
        _questionService = questionService;
    }

    [HttpGet("topic/{topicId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<QuestionDto>>>> GetByTopic(int topicId)
    {
        var questions = await _questionService.GetByTopicAsync(topicId);
        return Ok(ApiResponse<IEnumerable<QuestionDto>>.Ok(questions));
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
