namespace Weaver.Docker.WebApi.Models;

public record struct ComposeListItemModel(
    string Id,
    string Name,
    Health Health,
    Status Status,
    List<string> ContainerNames,
    List<PortMapping> Ports
);