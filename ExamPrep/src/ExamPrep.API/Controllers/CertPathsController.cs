using ExamPrep.API.Models;
using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CertPathsController : ControllerBase
{
    private readonly ICertPathService _certPathService;

    public CertPathsController(ICertPathService certPathService)
    {
        _certPathService = certPathService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<CertPathDto>>>> GetAll()
    {
        var paths = await _certPathService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<CertPathDto>>.Ok(paths));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CertPathDetailDto>>> GetById(int id)
    {
        var path = await _certPathService.GetByIdAsync(id);
        if (path == null)
            return NotFound(ApiResponse<CertPathDetailDto>.Fail("Certification path not found"));
        return Ok(ApiResponse<CertPathDetailDto>.Ok(path));
    }
}
