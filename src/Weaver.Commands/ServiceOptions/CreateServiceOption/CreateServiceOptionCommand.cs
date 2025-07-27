using Cortex.Mediator.Commands;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Common.ServiceOptions;
using Weaver.Domain.Entities;

namespace Weaver.Commands.ServiceOptions;

public record CreateServiceOptionCommand(
    OptionType Type,
    string Name,
    OneOf<string, double, bool, string[], double[]> Value
) : CreateServiceOptionModel(Type, Name, Value), ICommand<OneOf<ServiceOption, Error<Exception>>>;