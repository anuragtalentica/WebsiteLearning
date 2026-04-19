namespace ExamPrep.Domain.Entities;

public class CertPathCourse
{
    public int Id { get; set; }
    public int CertPathId { get; set; }
    public int CertificationId { get; set; }
    public int OrderIndex { get; set; }
    public string? Description { get; set; } // Why this course is in the path

    public CertPath CertPath { get; set; } = null!;
    public Certification Certification { get; set; } = null!;
}
