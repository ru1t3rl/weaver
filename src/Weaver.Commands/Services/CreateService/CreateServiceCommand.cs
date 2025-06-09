using Cortex.Mediator.Commands;
using Weaver.Domain.Entities;

namespace Weaver.Commands.Services;

public record CreateServiceCommand(string Name, ServiceType Type, IEnumerable<Guid> Options) : ICommand;