namespace ExamPrep.Application.DTOs;

public class CertificationDto
{
    public int Id { get; set; }
    public string Vendor { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? Category { get; set; }
    public string? Difficulty { get; set; }
}

public class CertificationDetailDto : CertificationDto
{
    public List<TopicDto> Topics { get; set; } = new();
}

public class TopicDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public int QuestionCount { get; set; }
}
