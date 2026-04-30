using Microsoft.EntityFrameworkCore;
using MyJobs.Api.Data;
using MyJobs.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ContentDb") ?? "Data Source=content.db"));
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "frontend",
        policy => policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins("http://localhost:3000", "http://localhost:5173"));
});
builder.Services.AddScoped<ILocalizedContentService, LocalizedContentService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("frontend");
app.MapControllers();
await DbSeeder.SeedAsync(app.Services);

app.Run();
