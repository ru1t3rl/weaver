using Cortex.Mediator.Commands;
using Docker.DotNet.Models;
using OneOf;
using OneOf.Types;
using Weaver.Extensions;

namespace Weaver.Docker.Commands.Compose;

/// <param name="StackIdentifier">The sha256 hash of the stack name.</param>
public record GetStackContainersCommand(
    Sha256Hash StackIdentifier
) : ICommand<OneOf<List<ContainerListResponse>, None>>;