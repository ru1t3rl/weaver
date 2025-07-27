using Weaver.Domain.Common;
using Weaver.Domain.Common.ServiceOptions;

namespace Weaver.Domain.Entities;

public class Service : EntityBase
{
    public required ServiceTemplate Template { get; init; }

    public required string Name { get; set; }
    public required List<ServiceOption> Options { get; set; }
}