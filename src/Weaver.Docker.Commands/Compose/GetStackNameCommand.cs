using System.Windows.Input;
using Cortex.Mediator.Commands;
using OneOf;
using OneOf.Types;
using Weaver.Extensions;

namespace Weaver.Docker.Commands.Compose;

public record GetStackNameCommand(
    Sha256Hash StackIdentifier
) : ICommand<OneOf<string, None>>;