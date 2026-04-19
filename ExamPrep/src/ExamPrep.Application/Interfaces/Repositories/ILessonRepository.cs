using ExamPrep.Domain.Entities;

namespace ExamPrep.Application.Interfaces.Repositories;

public interface ILessonRepository : IRepository<Lesson>
{
    Task<IEnumerable<Lesson>> GetByModuleAsync(int moduleId);
    Task<Lesson?> GetWithQuestionsAsync(int lessonId);
}
