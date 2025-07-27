using Humanizer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Weaver.Domain.Entities;

namespace Weaver.Infrastructure.Configurations;

internal class ServiceTemplateOptionConfiguration : IEntityTypeConfiguration<ServiceTemplateOption>
{
    public void Configure(EntityTypeBuilder<ServiceTemplateOption> builder)
    {
        builder.ToTable(nameof(ServiceTemplateOption).Pluralize());

        builder
            .HasIndex(s => s.Uuid)
            .IsUnique();

        builder
            .HasIndex(s => new {s.Name, s.Type})
            .IsUnique();
    }
}