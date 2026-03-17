using Cortex.Mediator.Commands;
using Docker.DotNet.Models;
using Weaver.Docker.Common;
using Weaver.Extensions;
using OneOf;

namespace Weaver.Docker.Commands.Containers;

public record struct ContainerDetail
{
    public ContainerInspectResponse InspectResponse { get; init; }
    public ContainerListResponse ListResponse { get; init; }
    public string ErrorLogs { get; init; }
    public string OutputLogs { get; init; }
}

public record GetContainerDetailsCommand(
    Sha256Hash ContainerId
) : ICommand<OneOf<ContainerDetail, Error>>;