using Cortex.Mediator.Commands;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Common.ServiceOptions;
using Weaver.Domain.Entities;

namespace Weaver.Commands.Services;

public record UpdateServiceCommand(
    Guid Uuid,
    string Name,
    List<ServiceOption> Options
) : ICommand<OneOf<Service, Error<Exception>>>;