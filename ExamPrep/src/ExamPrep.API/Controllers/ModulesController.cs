using ExamPrep.API.Models;
using ExamPrep.Application.DTOs;
using ExamPrep.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModulesController : ControllerBase
{
    private readonly IModuleService _moduleService;

    public ModulesController(IModuleService moduleService)
    {
        _moduleService = moduleService;
    }

    [HttpGet("certification/{certificationId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ModuleDto>>>> GetByCertification(int certificationId)
    {
        var modules = await _moduleService.GetByCertificationAsync(certificationId);
        return Ok(ApiResponse<IEnumerable<ModuleDto>>.Ok(modules));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ModuleDetailDto>>> GetById(int id)
    {
        var module = await _moduleService.GetByIdAsync(id);
        if (module == null)
            return NotFound(ApiResponse<ModuleDetailDto>.Fail("Module not found"));
        return Ok(ApiResponse<ModuleDetailDto>.Ok(module));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ApiResponse<ModuleDto>>> Create([FromBody] CreateModuleDto dto)
    {
        var module = await _moduleService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = module.Id }, ApiResponse<ModuleDto>.Ok(module));
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<ModuleDto>>> Update(int id, [FromBody] UpdateModuleDto dto)
    {
        var module = await _moduleService.UpdateAsync(id, dto);
        if (module == null)
            return NotFound(ApiResponse<ModuleDto>.Fail("Module not found"));
        return Ok(ApiResponse<ModuleDto>.Ok(module));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var result = await _moduleService.DeleteAsync(id);
        if (!result)
            return NotFound(ApiResponse<bool>.Fail("Module not found"));
        return Ok(ApiResponse<bool>.Ok(true));
    }
}
