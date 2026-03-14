using Cortex.Mediator.Commands;
using OneOf;
using OneOf.Types;
using Weaver.Extensions;
using Error = Weaver.Docker.Common.Error;

namespace Weaver.Docker.Commands.Containers;

public record StartContainerCommand(
    Sha256Hash ContainerIdentifier
) : ICommand<OneOf<Success, Error>>;