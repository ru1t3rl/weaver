using Humanizer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Weaver.Domain.Entities;

namespace Weaver.Infrastructure.Configurations;

internal class ServiceTemplateConfiguration : IEntityTypeConfiguration<ServiceTemplate>
{
    public void Configure(EntityTypeBuilder<ServiceTemplate> builder)
    {
        builder.ToTable(nameof(ServiceTemplate).Pluralize());

        builder
            .HasIndex(s => s.Uuid)
            .IsUnique();

        builder.HasIndex(s => s.Name);

        builder
            .HasMany(s => s.Config)
            .WithMany()
            .UsingEntity(j => j.ToTable(nameof(ServiceTemplate) + nameof(ServiceTemplateOption)));
    }
}