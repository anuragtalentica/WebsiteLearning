using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using ExamPrep.Application.Interfaces.Repositories;

namespace ExamPrep.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IQuestionRepository _questionRepo;
    private readonly ITestAttemptRepository _attemptRepo;

    public DashboardService(IQuestionRepository questionRepo, ITestAttemptRepository attemptRepo)
    {
        _questionRepo = questionRepo;
        _attemptRepo = attemptRepo;
    }

    public async Task<DashboardDto> GetUserDashboardAsync(string userId)
    {
        var testAttempts = await _attemptRepo.GetByUserAsync(userId);
        var testAttemptList = testAttempts.ToList();

        // Get question-level attempts from the repository
        var questionAttempts = await _questionRepo.GetUserAttemptsAsync(userId);
        var qaList = questionAttempts.ToList();

        var totalQuestions = qaList.Count;
        var totalCorrect = qaList.Count(a => a.IsCorrect);

        return new DashboardDto
        {
            TotalQuestionsAttempted = totalQuestions,
            TotalCorrect = totalCorrect,
            AccuracyPercentage = totalQuestions > 0 ? Math.Round((double)totalCorrect / totalQuestions * 100, 1) : 0,
            TestsTaken = testAttemptList.Count,
            TestsPassed = testAttemptList.Count(a => a.Passed),
            RecentAttempts = testAttemptList
                .Take(10)
                .Select(a => new RecentAttemptDto
                {
                    Type = "test",
                    Title = a.MockTest?.Title ?? "Unknown Test",
                    IsCorrect = a.Passed,
                    AttemptedAt = a.CreatedAt
                }).ToList()
        };
    }
}
