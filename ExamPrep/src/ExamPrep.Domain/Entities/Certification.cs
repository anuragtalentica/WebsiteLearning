namespace ExamPrep.Domain.Entities;

public class Certification
{
    public int Id { get; set; }
    public string Vendor { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? Category { get; set; } // Programming, Cloud, AI, General IT
    public string? Difficulty { get; set; } // Beginner, Intermediate, Advanced
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Topic> Topics { get; set; } = new List<Topic>();
    public ICollection<Module> Modules { get; set; } = new List<Module>();
    public ICollection<MockTest> MockTests { get; set; } = new List<MockTest>();
}
