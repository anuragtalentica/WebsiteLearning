namespace ExamPrep.Domain.Entities;

public class Topic
{
    public int Id { get; set; }
    public int CertificationId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int OrderIndex { get; set; }

    public Certification Certification { get; set; } = null!;
    public ICollection<Question> Questions { get; set; } = new List<Question>();
}
