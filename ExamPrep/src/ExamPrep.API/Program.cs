using ExamPrep.API.Extensions;
using ExamPrep.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddExamPrepServices(builder.Configuration);

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
    await context.Database.EnsureCreatedAsync();
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

// Temp diagnostic endpoint — remove after fixing startup error
app.MapGet("/startup-error", async () =>
{
    var logPath = Path.Combine(AppContext.BaseDirectory, "startup-error.txt");
    return File.Exists(logPath) ? await File.ReadAllTextAsync(logPath) : "No startup error logged.";
});

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
