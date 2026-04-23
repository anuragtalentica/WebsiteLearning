using ExamPrep.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ExamPrep.Infrastructure.Data;

public class ExamPrepDbContext : IdentityDbContext<IdentityUser>
{
    public ExamPrepDbContext(DbContextOptions<ExamPrepDbContext> options) : base(options) { }

    // Existing
    public DbSet<Certification> Certifications => Set<Certification>();
    public DbSet<Topic> Topics => Set<Topic>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<QuestionOption> QuestionOptions => Set<QuestionOption>();
    public DbSet<UserQuestionAttempt> UserQuestionAttempts => Set<UserQuestionAttempt>();

    // New — Structured Learning
    public DbSet<Module> Modules => Set<Module>();
    public DbSet<Lesson> Lessons => Set<Lesson>();

    // New — Mock Tests & Exams
    public DbSet<MockTest> MockTests => Set<MockTest>();
    public DbSet<TestQuestion> TestQuestions => Set<TestQuestion>();
    public DbSet<TestAttempt> TestAttempts => Set<TestAttempt>();

    // New — Certification Paths
    public DbSet<CertPath> CertPaths => Set<CertPath>();
    public DbSet<CertPathCourse> CertPathCourses => Set<CertPathCourse>();
    public DbSet<CertPathTest> CertPathTests => Set<CertPathTest>();

    // New — News
    public DbSet<News> News => Set<News>();

    // New — Bookmarks
    public DbSet<UserBookmark> UserBookmarks => Set<UserBookmark>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // ── Certification ──
        builder.Entity<Certification>(e =>
        {
            e.Property(c => c.Vendor).HasMaxLength(100);
            e.Property(c => c.Name).HasMaxLength(200);
            e.Property(c => c.Code).HasMaxLength(50);
            e.Property(c => c.ImageUrl).HasMaxLength(500);
            e.Property(c => c.Category).HasMaxLength(50);
            e.Property(c => c.Difficulty).HasMaxLength(50);
            e.HasIndex(c => c.Code).IsUnique();
        });

        // ── Topic ──
        builder.Entity<Topic>(e =>
        {
            e.Property(t => t.Name).HasMaxLength(200);
            e.HasOne(t => t.Certification)
                .WithMany(c => c.Topics)
                .HasForeignKey(t => t.CertificationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Module ──
        builder.Entity<Module>(e =>
        {
            e.Property(m => m.Title).HasMaxLength(200);
            e.HasOne(m => m.Certification)
                .WithMany(c => c.Modules)
                .HasForeignKey(m => m.CertificationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Lesson ──
        builder.Entity<Lesson>(e =>
        {
            e.Property(l => l.Title).HasMaxLength(200);
            e.Property(l => l.CodeLanguage).HasMaxLength(50);
            e.HasOne(l => l.Module)
                .WithMany(m => m.Lessons)
                .HasForeignKey(l => l.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Question ──
        builder.Entity<Question>(e =>
        {
            e.HasOne(q => q.Topic)
                .WithMany(t => t.Questions)
                .HasForeignKey(q => q.TopicId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(q => q.Lesson)
                .WithMany(l => l.Questions)
                .HasForeignKey(q => q.LessonId)
                .OnDelete(DeleteBehavior.NoAction);

            e.HasOne(q => q.Certification)
                .WithMany()
                .HasForeignKey(q => q.CertificationId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        // ── QuestionOption ──
        builder.Entity<QuestionOption>(e =>
        {
            e.HasOne(o => o.Question)
                .WithMany(q => q.Options)
                .HasForeignKey(o => o.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── UserQuestionAttempt ──
        builder.Entity<UserQuestionAttempt>(e =>
        {
            e.HasOne(a => a.Question)
                .WithMany(q => q.Attempts)
                .HasForeignKey(a => a.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(a => a.SelectedOption)
                .WithMany()
                .HasForeignKey(a => a.SelectedOptionId)
                .OnDelete(DeleteBehavior.NoAction);

            e.HasIndex(a => new { a.UserId, a.QuestionId });
        });

        // ── MockTest ──
        builder.Entity<MockTest>(e =>
        {
            e.Property(t => t.Title).HasMaxLength(200);
            e.Property(t => t.Type).HasMaxLength(20);
            e.HasOne(t => t.Certification)
                .WithMany(c => c.MockTests)
                .HasForeignKey(t => t.CertificationId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ── TestQuestion ──
        builder.Entity<TestQuestion>(e =>
        {
            e.HasOne(tq => tq.MockTest)
                .WithMany(t => t.TestQuestions)
                .HasForeignKey(tq => tq.MockTestId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(tq => tq.Question)
                .WithMany()
                .HasForeignKey(tq => tq.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── TestAttempt ──
        builder.Entity<TestAttempt>(e =>
        {
            e.HasOne(a => a.MockTest)
                .WithMany(t => t.Attempts)
                .HasForeignKey(a => a.MockTestId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(a => new { a.UserId, a.MockTestId });
        });

        // ── CertPath ──
        builder.Entity<CertPath>(e =>
        {
            e.Property(p => p.Title).HasMaxLength(200);
            e.Property(p => p.BadgeColor).HasMaxLength(30);
        });

        // ── CertPathCourse ──
        builder.Entity<CertPathCourse>(e =>
        {
            e.HasOne(pc => pc.CertPath)
                .WithMany(p => p.Courses)
                .HasForeignKey(pc => pc.CertPathId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(pc => pc.Certification)
                .WithMany()
                .HasForeignKey(pc => pc.CertificationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── CertPathTest ──
        builder.Entity<CertPathTest>(e =>
        {
            e.HasOne(pt => pt.CertPath)
                .WithMany(p => p.Tests)
                .HasForeignKey(pt => pt.CertPathId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(pt => pt.MockTest)
                .WithMany()
                .HasForeignKey(pt => pt.MockTestId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── News ──
        builder.Entity<News>(e =>
        {
            e.Property(n => n.Title).HasMaxLength(300);
            e.Property(n => n.Category).HasMaxLength(50);
            e.Property(n => n.Url).HasMaxLength(500);
        });

        // ── UserBookmark ──
        builder.Entity<UserBookmark>(e =>
        {
            e.HasOne(b => b.Question)
                .WithMany()
                .HasForeignKey(b => b.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(b => new { b.UserId, b.QuestionId }).IsUnique();
        });
    }
}
