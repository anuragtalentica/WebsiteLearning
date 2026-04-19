using System.Text;
using ExamPrep.Application.Interfaces;
using ExamPrep.Application.Interfaces.Repositories;
using ExamPrep.Application.Services;
using ExamPrep.Infrastructure.Data;
using ExamPrep.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ExamPrep.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddExamPrepServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        services.AddDbContext<ExamPrepDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // Identity
        services.AddIdentity<IdentityUser, IdentityRole>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 6;
        })
        .AddEntityFrameworkStores<ExamPrepDbContext>()
        .AddDefaultTokenProviders();

        // JWT Authentication
        var jwtKey = configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };
        });

        // Repositories
        services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
        services.AddScoped<ICertificationRepository, CertificationRepository>();
        services.AddScoped<IQuestionRepository, QuestionRepository>();
        services.AddScoped<IModuleRepository, ModuleRepository>();
        services.AddScoped<ILessonRepository, LessonRepository>();
        services.AddScoped<IMockTestRepository, MockTestRepository>();
        services.AddScoped<ITestAttemptRepository, TestAttemptRepository>();
        services.AddScoped<ICertPathRepository, CertPathRepository>();
        services.AddScoped<INewsRepository, NewsRepository>();

        // Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICertificationService, CertificationService>();
        services.AddScoped<IQuestionService, QuestionService>();
        services.AddScoped<IModuleService, ModuleService>();
        services.AddScoped<ILessonService, LessonService>();
        services.AddScoped<IMockTestService, MockTestService>();
        services.AddScoped<ICertPathService, CertPathService>();
        services.AddScoped<INewsService, NewsService>();
        services.AddScoped<IDashboardService, DashboardService>();

        return services;
    }
}
