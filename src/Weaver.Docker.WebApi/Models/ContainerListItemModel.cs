namespace Weaver.Docker.WebApi.Models;

public record struct ContainerListItemModel(
    string Id,
    string Name,
    string Image,
    Status State,
    DateTime Created,
    Health Status,
    string? ComposeName
);