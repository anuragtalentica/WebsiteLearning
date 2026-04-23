using ExamPrep.API.Models;
using ExamPrep.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly ExamPrepDbContext _db;
    public StatsController(ExamPrepDbContext db) => _db = db;

    // GET /api/stats — public platform stats for homepage
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PublicStatsDto>>> GetStats()
    {
        var certs      = await _db.Certifications.CountAsync();
        var questions  = await _db.Questions.CountAsync();
        var mockTests  = await _db.MockTests.CountAsync();
        var paths      = await _db.CertPaths.CountAsync();

        return Ok(ApiResponse<PublicStatsDto>.Ok(new PublicStatsDto
        {
            Certifications = certs,
            PracticeQuestions = questions,
            MockTests = mockTests,
            LearningPaths = paths,
        }));
    }
}

public class PublicStatsDto
{
    public int Certifications { get; set; }
    public int PracticeQuestions { get; set; }
    public int MockTests { get; set; }
    public int LearningPaths { get; set; }
}
