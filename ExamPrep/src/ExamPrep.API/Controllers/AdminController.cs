using ExamPrep.API.Models;
using ExamPrep.Domain.Entities;
using ExamPrep.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ExamPrepDbContext _db;
    private readonly UserManager<IdentityUser> _userManager;

    public AdminController(ExamPrepDbContext db, UserManager<IdentityUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    // ── Stats ──────────────────────────────────────────────────────────

    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<AdminStatsDto>>> GetStats()
    {
        var totalUsers = _userManager.Users.Count();
        var totalQuestions = await _db.Questions.CountAsync();
        var totalTests = await _db.TestAttempts.CountAsync();
        var totalCertifications = await _db.Certifications.CountAsync();

        var popularCourses = await _db.Certifications
            .Select(c => new PopularCourseDto
            {
                Id = c.Id,
                Name = c.Name,
                Code = c.Code,
                TopicCount = c.Topics.Count
            })
            .Take(5)
            .ToListAsync();

        return Ok(ApiResponse<AdminStatsDto>.Ok(new AdminStatsDto
        {
            TotalUsers = totalUsers,
            TotalQuestions = totalQuestions,
            TotalTestsTaken = totalTests,
            TotalCertifications = totalCertifications,
            PopularCourses = popularCourses
        }));
    }

    // ── Certifications ─────────────────────────────────────────────────

    [HttpPost("certifications")]
    public async Task<ActionResult<ApiResponse<object>>> CreateCertification([FromBody] AdminCertificationDto dto)
    {
        var cert = new Certification
        {
            Vendor = dto.Vendor,
            Name = dto.Name,
            Code = dto.Code,
            Description = dto.Description,
            Category = dto.Category,
            Difficulty = dto.Difficulty,
            ImageUrl = dto.ImageUrl,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        _db.Certifications.Add(cert);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { cert.Id }));
    }

    [HttpPut("certifications/{id}")]
    public async Task<ActionResult<ApiResponse<string>>> UpdateCertification(int id, [FromBody] AdminCertificationDto dto)
    {
        var cert = await _db.Certifications.FindAsync(id);
        if (cert == null) return NotFound(ApiResponse<object>.Fail("Not found."));

        cert.Vendor = dto.Vendor;
        cert.Name = dto.Name;
        cert.Code = dto.Code;
        cert.Description = dto.Description;
        cert.Category = dto.Category;
        cert.Difficulty = dto.Difficulty;
        cert.ImageUrl = dto.ImageUrl;
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("ok"));
    }

    [HttpDelete("certifications/{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteCertification(int id)
    {
        var cert = await _db.Certifications.FindAsync(id);
        if (cert == null) return NotFound(ApiResponse<object>.Fail("Not found."));

        _db.Certifications.Remove(cert);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("ok"));
    }

    // ── Topics ─────────────────────────────────────────────────────────

    [HttpGet("topics/{certificationId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AdminTopicDto>>>> GetTopics(int certificationId)
    {
        var topics = await _db.Topics
            .Where(t => t.CertificationId == certificationId)
            .OrderBy(t => t.OrderIndex)
            .Select(t => new AdminTopicDto { Id = t.Id, Name = t.Name, OrderIndex = t.OrderIndex, CertificationId = t.CertificationId })
            .ToListAsync();
        return Ok(ApiResponse<IEnumerable<AdminTopicDto>>.Ok(topics));
    }

    [HttpPost("topics")]
    public async Task<ActionResult<ApiResponse<object>>> CreateTopic([FromBody] AdminTopicDto dto)
    {
        var topic = new Topic { Name = dto.Name, OrderIndex = dto.OrderIndex, CertificationId = dto.CertificationId };
        _db.Topics.Add(topic);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { topic.Id }));
    }

    [HttpPut("topics/{id}")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateTopic(int id, [FromBody] AdminTopicDto dto)
    {
        var topic = await _db.Topics.FindAsync(id);
        if (topic == null) return NotFound(ApiResponse<object>.Fail("Not found."));

        topic.Name = dto.Name;
        topic.OrderIndex = dto.OrderIndex;
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("ok"));
    }

    [HttpDelete("topics/{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteTopic(int id)
    {
        var topic = await _db.Topics.FindAsync(id);
        if (topic == null) return NotFound(ApiResponse<object>.Fail("Not found."));

        _db.Topics.Remove(topic);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("ok"));
    }

    // ── Questions ──────────────────────────────────────────────────────

    [HttpGet("questions/topic/{topicId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AdminQuestionDto>>>> GetQuestions(int topicId)
    {
        var questions = await _db.Questions
            .Include(q => q.Options)
            .Where(q => q.TopicId == topicId)
            .Select(q => new AdminQuestionDto
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                Explanation = q.Explanation,
                DifficultyLevel = q.DifficultyLevel,
                TopicId = q.TopicId,
                Options = q.Options.OrderBy(o => o.OrderIndex).Select(o => new AdminOptionDto
                {
                    Id = o.Id,
                    OptionText = o.OptionText,
                    IsCorrect = o.IsCorrect,
                    OrderIndex = o.OrderIndex
                }).ToList()
            })
            .ToListAsync();

        return Ok(ApiResponse<IEnumerable<AdminQuestionDto>>.Ok(questions));
    }

    [HttpPost("questions")]
    public async Task<ActionResult<ApiResponse<object>>> CreateQuestion([FromBody] AdminQuestionDto dto)
    {
        var question = new Question
        {
            QuestionText = dto.QuestionText,
            Explanation = dto.Explanation,
            DifficultyLevel = dto.DifficultyLevel,
            TopicId = dto.TopicId,
            CreatedAt = DateTime.UtcNow,
            Options = dto.Options.Select((o, i) => new QuestionOption
            {
                OptionText = o.OptionText,
                IsCorrect = o.IsCorrect,
                OrderIndex = o.OrderIndex > 0 ? o.OrderIndex : i + 1
            }).ToList()
        };
        _db.Questions.Add(question);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { question.Id }));
    }

    [HttpPut("questions/{id}")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateQuestion(int id, [FromBody] AdminQuestionDto dto)
    {
        var question = await _db.Questions.Include(q => q.Options).FirstOrDefaultAsync(q => q.Id == id);
        if (question == null) return NotFound(ApiResponse<object>.Fail("Not found."));

        question.QuestionText = dto.QuestionText;
        question.Explanation = dto.Explanation;
        question.DifficultyLevel = dto.DifficultyLevel;

        // Replace options
        _db.QuestionOptions.RemoveRange(question.Options);
        question.Options = dto.Options.Select((o, i) => new QuestionOption
        {
            OptionText = o.OptionText,
            IsCorrect = o.IsCorrect,
            OrderIndex = o.OrderIndex > 0 ? o.OrderIndex : i + 1
        }).ToList();

        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("ok"));
    }

    [HttpDelete("questions/{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteQuestion(int id)
    {
        var question = await _db.Questions.FindAsync(id);
        if (question == null) return NotFound(ApiResponse<object>.Fail("Not found."));

        _db.Questions.Remove(question);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("ok"));
    }

    // ── Bulk Import ────────────────────────────────────────────────────

    [HttpPost("questions/bulk-import")]
    public async Task<ActionResult<ApiResponse<object>>> BulkImport([FromBody] BulkImportDto dto)
    {
        var questions = dto.Questions.Select(q => new Question
        {
            QuestionText = q.QuestionText,
            Explanation = q.Explanation,
            DifficultyLevel = q.DifficultyLevel,
            TopicId = q.TopicId,
            CreatedAt = DateTime.UtcNow,
            Options = new List<QuestionOption>
            {
                new() { OptionText = q.OptionA, IsCorrect = q.CorrectAnswer == "A", OrderIndex = 1 },
                new() { OptionText = q.OptionB, IsCorrect = q.CorrectAnswer == "B", OrderIndex = 2 },
                new() { OptionText = q.OptionC, IsCorrect = q.CorrectAnswer == "C", OrderIndex = 3 },
                new() { OptionText = q.OptionD, IsCorrect = q.CorrectAnswer == "D", OrderIndex = 4 },
            }
        }).ToList();

        _db.Questions.AddRange(questions);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { imported = questions.Count }));
    }

    // ── Mock Tests ─────────────────────────────────────────────────────

    [HttpGet("mocktests")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AdminMockTestDto>>>> GetMockTests()
    {
        var tests = await _db.MockTests
            .Select(t => new AdminMockTestDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Type = t.Type,
                CertificationId = t.CertificationId,
                DurationMinutes = t.DurationMinutes,
                NegativeMarkingValue = t.NegativeMarking ? 0.25m : 0m,
                PassingScore = t.PassingScore,
                QuestionCount = t.TestQuestions.Count
            })
            .ToListAsync();
        return Ok(ApiResponse<IEnumerable<AdminMockTestDto>>.Ok(tests));
    }

    [HttpPost("mocktests")]
    public async Task<ActionResult<ApiResponse<object>>> CreateMockTest([FromBody] AdminCreateMockTestDto dto)
    {
        // Auto-select questions from the topic
        var questions = await _db.Questions
            .Where(q => q.TopicId == dto.TopicId)
            .OrderBy(q => Guid.NewGuid())
            .Take(dto.QuestionCount)
            .ToListAsync();

        if (questions.Count < dto.QuestionCount)
            return BadRequest(ApiResponse<object>.Fail($"Only {questions.Count} questions available for this topic."));

        var mockTest = new MockTest
        {
            Title = dto.Title,
            Description = dto.Description,
            Type = dto.Type,
            CertificationId = dto.CertificationId,
            DurationMinutes = dto.DurationMinutes,
            NegativeMarking = dto.NegativeMarkingValue > 0,
            PassingScore = dto.PassingScore,
            CreatedAt = DateTime.UtcNow,
            TestQuestions = questions.Select((q, i) => new TestQuestion
            {
                QuestionId = q.Id,
                OrderIndex = i + 1
            }).ToList()
        };

        _db.MockTests.Add(mockTest);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { mockTest.Id }));
    }

    [HttpPut("mocktests/{id}")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateMockTest(int id, [FromBody] AdminMockTestDto dto)
    {
        var test = await _db.MockTests.FindAsync(id);
        if (test == null) return NotFound(ApiResponse<object>.Fail("Not found."));

        test.Title = dto.Title;
        test.Description = dto.Description;
        test.Type = dto.Type;
        test.DurationMinutes = dto.DurationMinutes;
        test.NegativeMarking = dto.NegativeMarkingValue > 0;
        test.PassingScore = dto.PassingScore;
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("ok"));
    }

    [HttpDelete("mocktests/{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteMockTest(int id)
    {
        var test = await _db.MockTests.FindAsync(id);
        if (test == null) return NotFound(ApiResponse<object>.Fail("Not found."));

        _db.MockTests.Remove(test);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("ok"));
    }

    // ── Modules ────────────────────────────────────────────────────────

    [HttpGet("modules/{certificationId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AdminModuleDto>>>> GetModules(int certificationId)
    {
        var modules = await _db.Modules
            .Where(m => m.CertificationId == certificationId)
            .OrderBy(m => m.OrderIndex)
            .Select(m => new AdminModuleDto
            {
                Id = m.Id,
                Title = m.Title,
                OrderIndex = m.OrderIndex,
                CertificationId = m.CertificationId,
                LessonCount = m.Lessons.Count
            })
            .ToListAsync();
        return Ok(ApiResponse<IEnumerable<AdminModuleDto>>.Ok(modules));
    }

    [HttpPost("modules")]
    public async Task<ActionResult<ApiResponse<object>>> CreateModule([FromBody] AdminModuleDto dto)
    {
        var module = new Module { Title = dto.Title, OrderIndex = dto.OrderIndex, CertificationId = dto.CertificationId };
        _db.Modules.Add(module);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { module.Id }));
    }

    [HttpPut("modules/{id}")]
    public async Task<ActionResult<ApiResponse<string>>> UpdateModule(int id, [FromBody] AdminModuleDto dto)
    {
        var module = await _db.Modules.FindAsync(id);
        if (module == null) return NotFound(ApiResponse<object>.Fail("Not found."));
        module.Title = dto.Title;
        module.OrderIndex = dto.OrderIndex;
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("ok"));
    }

    [HttpDelete("modules/{id}")]
    public async Task<ActionResult<ApiResponse<string>>> DeleteModule(int id)
    {
        var module = await _db.Modules.FindAsync(id);
        if (module == null) return NotFound(ApiResponse<object>.Fail("Not found."));
        _db.Modules.Remove(module);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("ok"));
    }

    // ── Lessons ────────────────────────────────────────────────────────

    [HttpGet("lessons/{moduleId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AdminLessonDto>>>> GetLessons(int moduleId)
    {
        var lessons = await _db.Lessons
            .Where(l => l.ModuleId == moduleId)
            .OrderBy(l => l.OrderIndex)
            .Select(l => new AdminLessonDto
            {
                Id = l.Id,
                Title = l.Title,
                Content = l.Content,
                CodeExample = l.CodeExample,
                CodeLanguage = l.CodeLanguage,
                ExternalLinks = l.ExternalLinks,
                OrderIndex = l.OrderIndex,
                ModuleId = l.ModuleId
            })
            .ToListAsync();
        return Ok(ApiResponse<IEnumerable<AdminLessonDto>>.Ok(lessons));
    }

    [HttpPost("lessons")]
    public async Task<ActionResult<ApiResponse<object>>> CreateLesson([FromBody] AdminLessonDto dto)
    {
        var lesson = new Lesson
        {
            Title = dto.Title,
            Content = dto.Content,
            CodeExample = dto.CodeExample,
            CodeLanguage = dto.CodeLanguage,
            ExternalLinks = dto.ExternalLinks,
            OrderIndex = dto.OrderIndex,
            ModuleId = dto.ModuleId
        };
        _db.Lessons.Add(lesson);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(new { lesson.Id }));
    }

    [HttpPut("lessons/{id}")]
    public async Task<ActionResult<ApiResponse<string>>> UpdateLesson(int id, [FromBody] AdminLessonDto dto)
    {
        var lesson = await _db.Lessons.FindAsync(id);
        if (lesson == null) return NotFound(ApiResponse<object>.Fail("Not found."));
        lesson.Title = dto.Title;
        lesson.Content = dto.Content;
        lesson.CodeExample = dto.CodeExample;
        lesson.CodeLanguage = dto.CodeLanguage;
        lesson.ExternalLinks = dto.ExternalLinks;
        lesson.OrderIndex = dto.OrderIndex;
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("ok"));
    }

    [HttpDelete("lessons/{id}")]
    public async Task<ActionResult<ApiResponse<string>>> DeleteLesson(int id)
    {
        var lesson = await _db.Lessons.FindAsync(id);
        if (lesson == null) return NotFound(ApiResponse<object>.Fail("Not found."));
        _db.Lessons.Remove(lesson);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok("ok"));
    }

    // ── Users ──────────────────────────────────────────────────────────

    [HttpGet("users")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AdminUserDto>>>> GetUsers()
    {
        var users = _userManager.Users.ToList();
        var result = new List<AdminUserDto>();
        foreach (var u in users)
        {
            var roles = await _userManager.GetRolesAsync(u);
            result.Add(new AdminUserDto
            {
                Id = u.Id,
                Email = u.Email ?? "",
                Role = roles.FirstOrDefault() ?? "User"
            });
        }
        return Ok(ApiResponse<IEnumerable<AdminUserDto>>.Ok(result));
    }

    [HttpPost("users/{userId}/role")]
    public async Task<ActionResult<ApiResponse<string>>> SetUserRole(string userId, [FromBody] SetRoleDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound(ApiResponse<string>.Fail("User not found"));

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, dto.Role);
        return Ok(ApiResponse<string>.Ok($"Role set to {dto.Role}"));
    }
}

// ── DTOs ───────────────────────────────────────────────────────────────

public class AdminStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalQuestions { get; set; }
    public int TotalTestsTaken { get; set; }
    public int TotalCertifications { get; set; }
    public List<PopularCourseDto> PopularCourses { get; set; } = new();
}

public class PopularCourseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Code { get; set; } = "";
    public int TopicCount { get; set; }
}

public class AdminCertificationDto
{
    public string Vendor { get; set; } = "";
    public string Name { get; set; } = "";
    public string Code { get; set; } = "";
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? Difficulty { get; set; }
    public string? ImageUrl { get; set; }
}

public class AdminTopicDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int OrderIndex { get; set; }
    public int CertificationId { get; set; }
}

public class AdminQuestionDto
{
    public int Id { get; set; }
    public string QuestionText { get; set; } = "";
    public string? Explanation { get; set; }
    public int DifficultyLevel { get; set; } = 1;
    public int TopicId { get; set; }
    public List<AdminOptionDto> Options { get; set; } = new();
}

public class AdminOptionDto
{
    public int Id { get; set; }
    public string OptionText { get; set; } = "";
    public bool IsCorrect { get; set; }
    public int OrderIndex { get; set; }
}

public class BulkImportDto
{
    public List<BulkQuestionRow> Questions { get; set; } = new();
}

public class BulkQuestionRow
{
    public string QuestionText { get; set; } = "";
    public string OptionA { get; set; } = "";
    public string OptionB { get; set; } = "";
    public string OptionC { get; set; } = "";
    public string OptionD { get; set; } = "";
    public string CorrectAnswer { get; set; } = "A"; // A, B, C or D
    public string? Explanation { get; set; }
    public int DifficultyLevel { get; set; } = 1;
    public int TopicId { get; set; }
}

public class AdminMockTestDto
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string Type { get; set; } = "mock";
    public int? CertificationId { get; set; }
    public int DurationMinutes { get; set; }
    public decimal NegativeMarkingValue { get; set; }
    public int PassingScore { get; set; }
    public int QuestionCount { get; set; }
}

public class AdminCreateMockTestDto
{
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string Type { get; set; } = "mock";
    public int? CertificationId { get; set; }
    public int TopicId { get; set; }
    public int QuestionCount { get; set; }
    public int DurationMinutes { get; set; }
    public decimal NegativeMarkingValue { get; set; }
    public int PassingScore { get; set; }
}

public class AdminUserDto
{
    public string Id { get; set; } = "";
    public string Email { get; set; } = "";
    public string Role { get; set; } = "";
}

public class SetRoleDto
{
    public string Role { get; set; } = "User";
}

public class AdminModuleDto
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public int OrderIndex { get; set; }
    public int CertificationId { get; set; }
    public int LessonCount { get; set; }
}

public class AdminLessonDto
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Content { get; set; } = "";
    public string? CodeExample { get; set; }
    public string? CodeLanguage { get; set; }
    public string? ExternalLinks { get; set; }
    public int OrderIndex { get; set; }
    public int ModuleId { get; set; }
}
