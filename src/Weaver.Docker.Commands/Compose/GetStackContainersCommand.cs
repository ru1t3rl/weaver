using Cortex.Mediator.Commands;
using Cortex.Mediator.Queries;
using Docker.DotNet.Models;
using Weaver.Extensions;

namespace Weaver.Docker.Commands.Compose;

/// <param name="StackIdentifier">The sha256 hash of the stack name.</param>
public record GetStackContainersCommand(
    Sha256Hash StackIdentifier
) : ICommand<List<ContainerListResponse>>;