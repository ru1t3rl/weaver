using Cortex.Mediator.Commands;
using Weaver.Domain.Entities;

namespace Weaver.Commands.ServiceTemplateOptions;

public record CreateServiceTemplateOptionCommand(string Name, OptionType Type) : ICommand<ServiceTemplateOption>;