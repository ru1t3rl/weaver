using Cortex.Mediator.Commands;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Common.ServiceOptions;

namespace Weaver.Commands.ServiceOptions;

public record CreateServiceOptionsCommand(
    List<CreateServiceOptionModel> Options
) : ICommand<List<OneOf<ServiceOption, Error<Exception>>>>;