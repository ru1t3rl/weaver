using Weaver.Domain.Common;

namespace Weaver.Domain.Entities;

public class ServiceTemplate : EntityBase
{
    public required string Name { get; init; }
    public required ServiceType Type { get; init; }
    public IEnumerable<ServiceTemplateOption> Config { get; set; } = new List<ServiceTemplateOption>();
}