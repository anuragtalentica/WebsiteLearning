namespace ExamPrep.Application.DTOs;

public class ModuleDto
{
    public int Id { get; set; }
    public int CertificationId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public int LessonCount { get; set; }
}

public class ModuleDetailDto : ModuleDto
{
    public List<LessonSummaryDto> Lessons { get; set; } = new();
}

public class CreateModuleDto
{
    public int CertificationId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
}

public class UpdateModuleDto
{
    public string Title { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
}
