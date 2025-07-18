using Weaver.Domain.Common;

namespace Weaver.Domain.Entities;

public class ServiceTemplateOption : EntityBase
{
    public required string Name { get; init; }
    public required OptionType Type { get; set; }
}