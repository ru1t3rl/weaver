using Humanizer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Weaver.Domain.Common.ServiceOptions;
using Weaver.Domain.Entities;
using Weaver.Domain.Entities.ServiceOptions;

namespace Weaver.Infrastructure.Configurations;

public class ServiceOptionConfiguration : IEntityTypeConfiguration<ServiceOption>
{
    public void Configure(EntityTypeBuilder<ServiceOption> builder)
    {
        builder.ToTable(nameof(ServiceOption).Pluralize());
        
        builder
            .HasDiscriminator(s => s.Type)
            .HasValue<ServiceOptionString>(OptionType.String)
            .HasValue<ServiceOptionNumber>(OptionType.Number)
            .HasValue<ServiceOptionBoolean>(OptionType.Boolean)
            .HasValue<ServiceOptionStringArray>(OptionType.StringArray)
            .HasValue<ServiceOptionNumberArray>(OptionType.NumberArray);

        builder
            .Property(s => s.Type)
            .IsRequired();
    }
}