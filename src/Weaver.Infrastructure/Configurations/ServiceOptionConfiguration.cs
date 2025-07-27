using Humanizer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Weaver.Domain.Common.ServiceOptions;
using Weaver.Domain.Entities;

namespace Weaver.Infrastructure.Configurations;

public class ServiceOptionConfiguration : IEntityTypeConfiguration<ServiceOption>
{
    public void Configure(EntityTypeBuilder<ServiceOption> builder)
    {
        builder.ToTable(nameof(ServiceOption).Pluralize());
        
        builder
            .HasDiscriminator(s => s.Type)
            .HasValue<ServiceOption<string>>(OptionType.String)
            .HasValue<ServiceOption<double>>(OptionType.Number)
            .HasValue<ServiceOption<bool>>(OptionType.Boolean)
            .HasValue<ServiceOption<string[]>>(OptionType.StringArray)
            .HasValue<ServiceOption<double[]>>(OptionType.NumberArray);

        builder
            .Property(s => s.Type)
            .IsRequired();
    }
}