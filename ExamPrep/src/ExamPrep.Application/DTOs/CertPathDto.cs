namespace ExamPrep.Application.DTOs;

public class CertPathDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Goal { get; set; }
    public string? BadgeColor { get; set; }
    public int EstimatedWeeks { get; set; }
    public int CourseCount { get; set; }
    public int TestCount { get; set; }
}

public class CertPathDetailDto : CertPathDto
{
    public List<CertPathCourseDto> Courses { get; set; } = new();
    public List<CertPathTestDto> Tests { get; set; } = new();
}

public class CertPathCourseDto
{
    public int Id { get; set; }
    public int CertificationId { get; set; }
    public string CertificationName { get; set; } = string.Empty;
    public string? CertificationCode { get; set; }
    public int OrderIndex { get; set; }
    public string? Description { get; set; }
}

public class CertPathTestDto
{
    public int Id { get; set; }
    public int MockTestId { get; set; }
    public string MockTestTitle { get; set; } = string.Empty;
}
