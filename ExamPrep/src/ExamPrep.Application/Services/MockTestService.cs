using System.Text.Json;
using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Domain.Entities;

namespace ExamPrep.Application.Services;

public class MockTestService : IMockTestService
{
    private readonly IMockTestRepository _testRepo;
    private readonly ITestAttemptRepository _attemptRepo;
    private readonly IQuestionRepository _questionRepo;

    public MockTestService(
        IMockTestRepository testRepo,
        ITestAttemptRepository attemptRepo,
        IQuestionRepository questionRepo)
    {
        _testRepo = testRepo;
        _attemptRepo = attemptRepo;
        _questionRepo = questionRepo;
    }

    public async Task<IEnumerable<MockTestDto>> GetAllAsync()
    {
        var tests = await _testRepo.GetAllActiveAsync();
        return tests.Select(MapToDto);
    }

    public async Task<IEnumerable<MockTestDto>> GetByCertificationAsync(int certificationId)
    {
        var tests = await _testRepo.GetByCertificationAsync(certificationId);
        return tests.Select(t => new MockTestDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Type = t.Type,
            CertificationId = t.CertificationId,
            DurationMinutes = t.DurationMinutes,
            NegativeMarking = t.NegativeMarking,
            PassingScore = t.PassingScore,
            QuestionCount = t.TestQuestions.Count
        });
    }

    public async Task<MockTestDetailDto?> GetByIdAsync(int testId)
    {
        var test = await _testRepo.GetWithQuestionsAsync(testId);
        if (test == null) return null;

        return new MockTestDetailDto
        {
            Id = test.Id,
            Title = test.Title,
            Description = test.Description,
            Type = test.Type,
            CertificationId = test.CertificationId,
            CertificationName = test.Certification?.Name,
            DurationMinutes = test.DurationMinutes,
            NegativeMarking = test.NegativeMarking,
            PassingScore = test.PassingScore,
            QuestionCount = test.TestQuestions.Count,
            Questions = test.TestQuestions.Select(tq => new TestQuestionDto
            {
                Id = tq.Id,
                QuestionId = tq.QuestionId,
                OrderIndex = tq.OrderIndex,
                QuestionText = tq.Question.QuestionText,
                Options = tq.Question.Options.Select(o => new OptionDto
                {
                    Id = o.Id,
                    OptionText = o.OptionText,
                    OrderIndex = o.OrderIndex
                    // IsCorrect is NEVER sent to client
                }).ToList()
            }).ToList()
        };
    }

    public async Task<MockTestDto> CreateAsync(CreateMockTestDto dto)
    {
        var test = new MockTest
        {
            Title = dto.Title,
            Description = dto.Description,
            Type = dto.Type,
            CertificationId = dto.CertificationId,
            DurationMinutes = dto.DurationMinutes,
            NegativeMarking = dto.NegativeMarking,
            PassingScore = dto.PassingScore,
            TestQuestions = dto.QuestionIds.Select((qId, idx) => new TestQuestion
            {
                QuestionId = qId,
                OrderIndex = idx + 1
            }).ToList()
        };

        await _testRepo.AddAsync(test);
        await _testRepo.SaveChangesAsync();

        return new MockTestDto
        {
            Id = test.Id,
            Title = test.Title,
            Description = test.Description,
            Type = test.Type,
            CertificationId = test.CertificationId,
            DurationMinutes = test.DurationMinutes,
            NegativeMarking = test.NegativeMarking,
            PassingScore = test.PassingScore,
            QuestionCount = test.TestQuestions.Count
        };
    }

    public async Task<TestResultDto> SubmitTestAsync(string userId, SubmitTestDto dto)
    {
        var test = await _testRepo.GetWithQuestionsAsync(dto.MockTestId);
        if (test == null) throw new ArgumentException("Test not found");

        int correct = 0, wrong = 0, skipped = 0;
        var totalQuestions = test.TestQuestions.Count;

        foreach (var tq in test.TestQuestions)
        {
            if (!dto.Answers.TryGetValue(tq.QuestionId, out var selectedOptionId))
            {
                skipped++;
                continue;
            }

            var correctOption = tq.Question.Options.FirstOrDefault(o => o.IsCorrect);
            if (correctOption != null && correctOption.Id == selectedOptionId)
                correct++;
            else
                wrong++;
        }

        var score = totalQuestions > 0
            ? (int)Math.Round((double)correct / totalQuestions * 100)
            : 0;

        var attempt = new TestAttempt
        {
            UserId = userId,
            MockTestId = dto.MockTestId,
            Score = score,
            TotalQuestions = totalQuestions,
            CorrectAnswers = correct,
            WrongAnswers = wrong,
            Skipped = skipped,
            TimeTakenSeconds = dto.TimeTakenSeconds,
            Passed = score >= test.PassingScore,
            Answers = JsonSerializer.Serialize(dto.Answers)
        };

        await _attemptRepo.AddAsync(attempt);
        await _attemptRepo.SaveChangesAsync();

        return new TestResultDto
        {
            AttemptId = attempt.Id,
            Score = score,
            TotalQuestions = totalQuestions,
            CorrectAnswers = correct,
            WrongAnswers = wrong,
            Skipped = skipped,
            TimeTakenSeconds = dto.TimeTakenSeconds,
            Passed = attempt.Passed,
            PassingScore = test.PassingScore
        };
    }

    public async Task<IEnumerable<TestAttemptDto>> GetUserAttemptsAsync(string userId)
    {
        var attempts = await _attemptRepo.GetByUserAsync(userId);
        return attempts.Select(a => new TestAttemptDto
        {
            Id = a.Id,
            MockTestId = a.MockTestId,
            TestTitle = a.MockTest?.Title,
            Score = a.Score,
            TotalQuestions = a.TotalQuestions,
            CorrectAnswers = a.CorrectAnswers,
            WrongAnswers = a.WrongAnswers,
            Skipped = a.Skipped,
            TimeTakenSeconds = a.TimeTakenSeconds,
            Passed = a.Passed,
            CreatedAt = a.CreatedAt
        });
    }

    public async Task<TestReviewDto?> GetAttemptReviewAsync(int attemptId, string userId)
    {
        var attempt = await _attemptRepo.GetByIdWithDetailsAsync(attemptId);
        if (attempt == null || attempt.UserId != userId) return null;

        var answers = string.IsNullOrEmpty(attempt.Answers)
            ? new Dictionary<int, int>()
            : JsonSerializer.Deserialize<Dictionary<int, int>>(attempt.Answers) ?? new();

        var questions = attempt.MockTest.TestQuestions
            .OrderBy(tq => tq.OrderIndex)
            .Select(tq =>
            {
                var correctOption = tq.Question.Options.FirstOrDefault(o => o.IsCorrect);
                answers.TryGetValue(tq.QuestionId, out var selectedId);
                var skipped = !answers.ContainsKey(tq.QuestionId);
                return new TestReviewQuestionDto
                {
                    QuestionId = tq.QuestionId,
                    OrderIndex = tq.OrderIndex,
                    QuestionText = tq.Question.QuestionText,
                    Options = tq.Question.Options.OrderBy(o => o.OrderIndex).Select(o => new ReviewOptionDto
                    {
                        Id = o.Id,
                        OptionText = o.OptionText,
                        OrderIndex = o.OrderIndex
                    }).ToList(),
                    SelectedOptionId = skipped ? null : selectedId,
                    CorrectOptionId = correctOption?.Id ?? 0,
                    IsCorrect = !skipped && correctOption != null && correctOption.Id == selectedId,
                    Skipped = skipped,
                    Explanation = tq.Question.Explanation
                };
            }).ToList();

        return new TestReviewDto
        {
            AttemptId = attempt.Id,
            TestTitle = attempt.MockTest.Title,
            Score = attempt.Score,
            Passed = attempt.Passed,
            Questions = questions
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var test = await _testRepo.GetByIdAsync(id);
        if (test == null) return false;

        _testRepo.Remove(test);
        await _testRepo.SaveChangesAsync();
        return true;
    }

    private static MockTestDto MapToDto(MockTest t) => new()
    {
        Id = t.Id,
        Title = t.Title,
        Description = t.Description,
        Type = t.Type,
        CertificationId = t.CertificationId,
        CertificationName = t.Certification?.Name,
        DurationMinutes = t.DurationMinutes,
        NegativeMarking = t.NegativeMarking,
        PassingScore = t.PassingScore,
        QuestionCount = t.TestQuestions.Count
    };
}
