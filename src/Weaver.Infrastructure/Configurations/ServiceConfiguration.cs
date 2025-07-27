using Humanizer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Weaver.Domain.Entities;

namespace Weaver.Infrastructure.Configurations;

public class ServiceConfiguration : IEntityTypeConfiguration<Service>
{
    public void Configure(EntityTypeBuilder<Service> builder)
    {
        builder.ToTable(nameof(Service).Pluralize());

        builder
            .HasIndex(s => s.Uuid)
            .IsUnique();

        builder
            .HasOne(s => s.Template)
            .WithMany()
            .OnDelete(DeleteBehavior.Restrict);
    }
}