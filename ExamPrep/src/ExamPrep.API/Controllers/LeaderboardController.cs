using ExamPrep.API.Models;
using ExamPrep.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeaderboardController : ControllerBase
{
    private readonly ExamPrepDbContext _db;
    private readonly UserManager<IdentityUser> _userManager;

    public LeaderboardController(ExamPrepDbContext db, UserManager<IdentityUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    // Global leaderboard: top users by average score across all passed tests
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<LeaderboardEntryDto>>>> GetGlobal([FromQuery] int top = 20)
    {
        var entries = await _db.TestAttempts
            .Where(a => a.Passed)
            .GroupBy(a => a.UserId)
            .Select(g => new
            {
                UserId = g.Key,
                TestsPassed = g.Count(),
                AvgScore = (int)g.Average(a => a.Score),
                BestScore = g.Max(a => a.Score),
                TotalCorrect = g.Sum(a => a.CorrectAnswers)
            })
            .OrderByDescending(x => x.AvgScore)
            .ThenByDescending(x => x.TestsPassed)
            .Take(top)
            .ToListAsync();

        var result = new List<LeaderboardEntryDto>();
        int rank = 1;
        foreach (var e in entries)
        {
            var user = await _userManager.FindByIdAsync(e.UserId);
            var claims = user != null ? await _userManager.GetClaimsAsync(user) : [];
            var displayName = claims.FirstOrDefault(c => c.Type == "FullName")?.Value
                              ?? user?.Email?.Split('@')[0] ?? "User";
            result.Add(new LeaderboardEntryDto
            {
                Rank = rank++,
                DisplayName = displayName,
                TestsPassed = e.TestsPassed,
                AverageScore = e.AvgScore,
                BestScore = e.BestScore,
                TotalCorrect = e.TotalCorrect
            });
        }

        return Ok(ApiResponse<IEnumerable<LeaderboardEntryDto>>.Ok(result));
    }

    // Per-certification leaderboard
    [HttpGet("certification/{certificationId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<LeaderboardEntryDto>>>> GetByCertification(
        int certificationId, [FromQuery] int top = 20)
    {
        var entries = await _db.TestAttempts
            .Where(a => a.Passed && a.MockTest.CertificationId == certificationId)
            .GroupBy(a => a.UserId)
            .Select(g => new
            {
                UserId = g.Key,
                TestsPassed = g.Count(),
                AvgScore = (int)g.Average(a => a.Score),
                BestScore = g.Max(a => a.Score),
                TotalCorrect = g.Sum(a => a.CorrectAnswers)
            })
            .OrderByDescending(x => x.AvgScore)
            .ThenByDescending(x => x.TestsPassed)
            .Take(top)
            .ToListAsync();

        var result = new List<LeaderboardEntryDto>();
        int rank = 1;
        foreach (var e in entries)
        {
            var user = await _userManager.FindByIdAsync(e.UserId);
            var claims = user != null ? await _userManager.GetClaimsAsync(user) : [];
            var displayName = claims.FirstOrDefault(c => c.Type == "FullName")?.Value
                              ?? user?.Email?.Split('@')[0] ?? "User";
            result.Add(new LeaderboardEntryDto
            {
                Rank = rank++,
                DisplayName = displayName,
                TestsPassed = e.TestsPassed,
                AverageScore = e.AvgScore,
                BestScore = e.BestScore,
                TotalCorrect = e.TotalCorrect
            });
        }

        return Ok(ApiResponse<IEnumerable<LeaderboardEntryDto>>.Ok(result));
    }
}

public class LeaderboardEntryDto
{
    public int Rank { get; set; }
    public string DisplayName { get; set; } = "";
    public int TestsPassed { get; set; }
    public int AverageScore { get; set; }
    public int BestScore { get; set; }
    public int TotalCorrect { get; set; }
}
