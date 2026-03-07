namespace Weaver.Docker.WebApi.Models;

public record struct ContainerListItemModel
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public required string Image { get; init; }
    public required Status Status { get; init; }
    public required DateTime Created { get; init; }
    public required Health Health { get; init; }
    public required string[] DependsOn { get; init; }
    public required NetworkModel[] Networks { get; init; }
    public string? ComposeName { get; init; }
}