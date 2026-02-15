using Weaver.Extensions;

namespace Weaver.Docker.WebApi.Models;

public record struct ComposeModel(
    string Id,
    string Name,
    List<ContainerListItemModel> Containers
);