using Cortex.Mediator.Commands;
using OneOf;
using OneOf.Types;
using Weaver.Extensions;
using Error = Weaver.Docker.Common.Error;

namespace Weaver.Docker.Commands.Compose;

public record StartStackCommand(
    Sha256Hash StackIdentifier
) : ICommand<OneOf<Success, Error>>;