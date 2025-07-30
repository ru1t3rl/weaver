using Weaver.Domain.Entities;

namespace Weaver.Domain.Common.ServiceOptions;

public abstract class ServiceOption : EntityBase
{
    public virtual OptionType Type { get; init; } = OptionType.String;
    public required string Name { get; set; }
}