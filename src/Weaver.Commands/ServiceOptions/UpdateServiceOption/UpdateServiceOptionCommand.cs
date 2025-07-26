using Cortex.Mediator.Commands;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Common.ServiceOptions;
using Weaver.Domain.Entities;

namespace Weaver.Commands.ServiceOptions;

public record UpdateServiceOptionCommand(
    Guid Uuid,
    string Name,
    string? StringValue = null,
    double? NumberValue = null,
    bool? BooleanValue = null,
    string[]? StringArrayValue = null,
    double[]? NumberArrayValue = null
) : ICommand<OneOf<ServiceOption, Error<Exception>>>;