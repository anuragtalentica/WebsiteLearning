namespace ExamPrep.Domain.Entities;

public class Module
{
    public int Id { get; set; }
    public int CertificationId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int OrderIndex { get; set; }

    public Certification Certification { get; set; } = null!;
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}
