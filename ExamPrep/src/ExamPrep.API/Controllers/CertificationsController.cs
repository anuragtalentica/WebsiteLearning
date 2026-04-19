using ExamPrep.API.Models;
using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CertificationsController : ControllerBase
{
    private readonly ICertificationService _certService;

    public CertificationsController(ICertificationService certService)
    {
        _certService = certService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<CertificationDto>>>> GetAll()
    {
        var certs = await _certService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<CertificationDto>>.Ok(certs));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CertificationDetailDto>>> GetById(int id)
    {
        var cert = await _certService.GetByIdAsync(id);
        if (cert == null)
            return NotFound(ApiResponse<CertificationDetailDto>.Fail("Certification not found."));

        return Ok(ApiResponse<CertificationDetailDto>.Ok(cert));
    }
}
