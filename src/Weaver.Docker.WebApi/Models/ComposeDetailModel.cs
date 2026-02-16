namespace Weaver.Docker.WebApi.Models;

public record struct ComposeDetailModel(
    string Id,
    string Name,
    Health Health,
    Status Status,
    List<ContainerListItemModel> Containers,
    List<PortMapping> Ports
);