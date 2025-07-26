using Cortex.Mediator.Commands;
using Weaver.Domain.Entities;

namespace Weaver.Commands.Services;

public record CreateServiceTemplateCommand(
    string Name,
    ServiceType Type,
    IEnumerable<Guid> Options
) : ICommand<ServiceTemplate>;