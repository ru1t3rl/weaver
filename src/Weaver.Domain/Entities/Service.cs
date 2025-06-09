using Weaver.Domain.Common;

namespace Weaver.Domain.Entities;

public class Service : EntityBase
{
    public required string Name { get; init; }
    public required ServiceType Type { get; init; }
    public IEnumerable<ServiceOption> Config { get; set; } = new List<ServiceOption>();
}