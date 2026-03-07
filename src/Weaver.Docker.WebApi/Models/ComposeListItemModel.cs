namespace Weaver.Docker.WebApi.Models;

public record struct ComposeListItemModel
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public required Health Health { get; init; }
    public required Status Status { get; init; }
    public required List<string> ContainerNames { get; init; }
    public required List<PortMapping> Ports { get; init; }
}