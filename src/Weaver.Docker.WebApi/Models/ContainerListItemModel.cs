namespace Weaver.Docker.WebApi.Models;

public record struct ContainerListItemModel(
    string Id,
    string Name,
    string Image,
    string Status,
    DateTime Created,
    string Health,
    string? ComposeName
);