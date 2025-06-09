using Humanizer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Weaver.Domain.Entities;

namespace Weaver.Infrastructure.Configurations;

internal class ServiceOptionConfiguration : IEntityTypeConfiguration<ServiceOption>
{
    public void Configure(EntityTypeBuilder<ServiceOption> builder)
    {
        builder.ToTable(nameof(ServiceOption).Pluralize());

        builder
            .HasIndex(s => s.Uuid)
            .IsUnique();

        builder
            .HasIndex(s => s.Name)
            .IsUnique();
    }
}