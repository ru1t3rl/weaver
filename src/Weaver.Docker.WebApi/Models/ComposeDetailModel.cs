namespace Weaver.Docker.WebApi.Models;

public record struct ComposeDetailModel
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public required Health Health { get; init; }
    public required Status Status { get; init; }
    public required List<ContainerListItemModel> Containers { get; init; }
    public required List<PortMapping> Ports { get; init; }
}