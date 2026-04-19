namespace ExamPrep.Domain.Entities;

public class CertPathTest
{
    public int Id { get; set; }
    public int CertPathId { get; set; }
    public int MockTestId { get; set; }

    public CertPath CertPath { get; set; } = null!;
    public MockTest MockTest { get; set; } = null!;
}
