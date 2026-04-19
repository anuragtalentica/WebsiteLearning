using ExamPrep.Application.DTOs;

namespace ExamPrep.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardDto> GetUserDashboardAsync(string userId);
}
