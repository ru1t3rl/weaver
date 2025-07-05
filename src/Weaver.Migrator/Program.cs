using Microsoft.EntityFrameworkCore;
using Weaver.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
builder.AddDatabase();

var app = builder.Build();

using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<WeaverDbContext>();
await dbContext.Database.MigrateAsync();