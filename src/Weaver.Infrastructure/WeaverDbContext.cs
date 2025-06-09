using Microsoft.EntityFrameworkCore;
using Weaver.Domain.Entities;

namespace Weaver.Infrastructure;

public class WeaverDbContext : DbContext
{
    public DbSet<Service> Services { get; set; }
    public DbSet<ServiceOption> ServiceOptions { get; set; }

    public WeaverDbContext(DbContextOptions<WeaverDbContext> options) : base(options)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(WeaverDbContext).Assembly);
    }
}