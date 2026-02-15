using Weaver.Extensions;

namespace Weaver.Docker.WebApi.Models;

public record struct ComposeModel(
    string Id,
    string Name,
    Health Health,
    Status Status,
    List<ContainerListItemModel> Containers,
    List<PortMapping> Ports
);