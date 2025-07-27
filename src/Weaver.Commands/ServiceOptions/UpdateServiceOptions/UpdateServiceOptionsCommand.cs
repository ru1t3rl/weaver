using Cortex.Mediator.Commands;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Common.ServiceOptions;

namespace Weaver.Commands.ServiceOptions.UpdateServiceOptions;

public record UpdateServiceOptionsCommand(
    List<UpdateServiceOptionModel> Options
) : ICommand<List<OneOf<ServiceOption, Error<Exception>>>>;