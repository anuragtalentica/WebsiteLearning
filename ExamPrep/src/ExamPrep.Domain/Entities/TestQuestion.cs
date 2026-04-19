namespace ExamPrep.Domain.Entities;

public class TestQuestion
{
    public int Id { get; set; }
    public int MockTestId { get; set; }
    public int QuestionId { get; set; }
    public int OrderIndex { get; set; }

    public MockTest MockTest { get; set; } = null!;
    public Question Question { get; set; } = null!;
}
