using ExamPrep.Application.DTOs;

namespace ExamPrep.Application.Interfaces;

public interface IMockTestService
{
    Task<IEnumerable<MockTestDto>> GetAllAsync();
    Task<IEnumerable<MockTestDto>> GetByCertificationAsync(int certificationId);
    Task<MockTestDetailDto?> GetByIdAsync(int testId);
    Task<MockTestDto> CreateAsync(CreateMockTestDto dto);
    Task<TestResultDto> SubmitTestAsync(string userId, SubmitTestDto dto);
    Task<IEnumerable<TestAttemptDto>> GetUserAttemptsAsync(string userId);
    Task<TestReviewDto?> GetAttemptReviewAsync(int attemptId, string userId);
    Task<bool> DeleteAsync(int id);
}
