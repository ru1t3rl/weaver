using Cortex.Mediator.Commands;
using Weaver.Domain.Entities;

namespace Weaver.Commands.ServiceOptions;

public record CreateServiceOptionCommand(string Name, OptionType Type) : ICommand;