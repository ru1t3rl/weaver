using Weaver.Domain.Entities;

namespace Weaver.WebApi.Models;

public record ServiceDetailModel
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public required ServiceType Type { get; init; }
    public IEnumerable<ServiceOption> Config { get; set; } = [];
}