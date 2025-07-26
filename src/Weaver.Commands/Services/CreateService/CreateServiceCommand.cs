using Cortex.Mediator.Commands;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Common.ServiceOptions;
using Weaver.Domain.Entities;

namespace Weaver.Commands.Services;

public record CreateServiceCommand(
    Guid? Uuid,
    string Name,
    Guid TemplateUuid,
    List<ServiceOption> Options
) : ICommand<OneOf<Service, Error<Exception>>>;