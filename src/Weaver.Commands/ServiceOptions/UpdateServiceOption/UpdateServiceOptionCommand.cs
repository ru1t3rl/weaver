using Cortex.Mediator.Commands;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Common.ServiceOptions;
using Weaver.Domain.Entities;

namespace Weaver.Commands.ServiceOptions;

public record UpdateServiceOptionCommand(
    Guid Uuid,
    OptionType Type,
    string Name,
    OneOf<string, double, bool, string[], double[]> Value
) : UpdateServiceOptionModel(Uuid, Type, Name, Value), ICommand<OneOf<ServiceOption, Error<Exception>>>;