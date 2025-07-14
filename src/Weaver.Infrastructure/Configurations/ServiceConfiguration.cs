using Humanizer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Weaver.Domain.Entities;

namespace Weaver.Infrastructure.Configurations;

internal class ServiceConfiguration : IEntityTypeConfiguration<Service>
{
    public void Configure(EntityTypeBuilder<Service> builder)
    {
        builder.ToTable(nameof(Service).Pluralize());

        builder
            .HasIndex(s => s.Uuid)
            .IsUnique();

        builder.HasIndex(s => s.Name);

        builder
            .HasMany(s => s.Config)
            .WithMany()
            .UsingEntity(j => j.ToTable(nameof(Service) + nameof(ServiceOption)));
    }
}