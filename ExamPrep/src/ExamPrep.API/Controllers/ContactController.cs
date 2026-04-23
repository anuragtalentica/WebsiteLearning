using ExamPrep.API.Models;
using ExamPrep.Domain.Entities;
using ExamPrep.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly ExamPrepDbContext _db;

    public ContactController(ExamPrepDbContext db) => _db = db;

    // POST /api/contact — public, no auth required
    [HttpPost]
    public async Task<ActionResult<ApiResponse<bool>>> Submit([FromBody] ContactMessageDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) ||
            string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Message))
            return BadRequest(ApiResponse<bool>.Fail("Name, email and message are required."));

        _db.ContactMessages.Add(new ContactMessage
        {
            Name    = dto.Name.Trim(),
            Email   = dto.Email.Trim(),
            Phone   = dto.Phone?.Trim(),
            Subject = dto.Subject?.Trim(),
            Message = dto.Message.Trim(),
        });
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }

    // GET /api/contact — admin only
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ContactMessageResponse>>>> GetAll()
    {
        var messages = await _db.ContactMessages
            .OrderByDescending(m => m.SubmittedAt)
            .Select(m => new ContactMessageResponse
            {
                Id          = m.Id,
                Name        = m.Name,
                Email       = m.Email,
                Phone       = m.Phone,
                Subject     = m.Subject,
                Message     = m.Message,
                SubmittedAt = m.SubmittedAt,
                IsRead      = m.IsRead,
            })
            .ToListAsync();
        return Ok(ApiResponse<IEnumerable<ContactMessageResponse>>.Ok(messages));
    }

    // PATCH /api/contact/{id}/read — admin marks as read
    [HttpPatch("{id}/read")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkRead(int id)
    {
        var msg = await _db.ContactMessages.FindAsync(id);
        if (msg == null) return NotFound(ApiResponse<bool>.Fail("Not found"));
        msg.IsRead = true;
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }

    // DELETE /api/contact/{id} — admin deletes
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var msg = await _db.ContactMessages.FindAsync(id);
        if (msg == null) return NotFound(ApiResponse<bool>.Fail("Not found"));
        _db.ContactMessages.Remove(msg);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Ok(true));
    }
}

public class ContactMessageDto
{
    public string Name    { get; set; } = "";
    public string Email   { get; set; } = "";
    public string? Phone  { get; set; }
    public string? Subject { get; set; }
    public string Message { get; set; } = "";
}

public class ContactMessageResponse
{
    public int      Id          { get; set; }
    public string   Name        { get; set; } = "";
    public string   Email       { get; set; } = "";
    public string?  Phone       { get; set; }
    public string?  Subject     { get; set; }
    public string   Message     { get; set; } = "";
    public DateTime SubmittedAt { get; set; }
    public bool     IsRead      { get; set; }
}
