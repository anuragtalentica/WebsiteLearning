using System.Security.Claims;
using ExamPrep.API.Models;
using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<DashboardDto>>> GetDashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var dashboard = await _dashboardService.GetUserDashboardAsync(userId);
        return Ok(ApiResponse<DashboardDto>.Ok(dashboard));
    }
}
