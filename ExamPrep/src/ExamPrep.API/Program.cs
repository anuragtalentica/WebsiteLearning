using System.Threading.RateLimiting;
using ExamPrep.API.Extensions;
using ExamPrep.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddExamPrepServices(builder.Configuration);

// Rate limiting — 10 requests per minute per IP on auth endpoints
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("auth", limiter =>
    {
        limiter.Window = TimeSpan.FromMinutes(1);
        limiter.PermitLimit = 10;
        limiter.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiter.QueueLimit = 0;
    });
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

// CORS — allow dev server + production Vercel URL via config
var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins")
    .Get<string[]>() ?? ["http://localhost:5173", "http://localhost:5174"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// Seed data on every startup (safe — checks if data exists before inserting)
try
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ExamPrepDbContext>();

    // If the DB already has tables but no migration history (EnsureCreated was used before),
    // insert the InitialCreate migration record so MigrateAsync only runs newer migrations.
    await context.Database.EnsureCreatedAsync();
    await context.Database.ExecuteSqlRawAsync(
        "INSERT INTO \"__EFMigrationsHistory\" (\"MigrationId\", \"ProductVersion\") " +
        "VALUES ('20260419065348_InitialCreate', '9.0.0') ON CONFLICT DO NOTHING");

    await context.Database.MigrateAsync();

    await SeedData.SeedAsync(context);
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    await SeedData.SeedAdminAsync(userManager, roleManager);
}
catch (Exception ex)
{
    var logPath = Path.Combine(AppContext.BaseDirectory, "startup-error.txt");
    await File.WriteAllTextAsync(logPath, $"{DateTime.UtcNow}\n{ex}");
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
