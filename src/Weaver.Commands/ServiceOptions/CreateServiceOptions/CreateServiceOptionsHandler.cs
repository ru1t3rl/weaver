using Cortex.Mediator;
using Cortex.Mediator.Commands;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Common.ServiceOptions;

namespace Weaver.Commands.ServiceOptions.CreateServiceOptions;

public class CreateServiceOptionsHandler : ICommandHandler<
    CreateServiceOptionsCommand,
    List<OneOf<ServiceOption, Error<Exception>>>
>
{
    private readonly IMediator _mediator;

    public CreateServiceOptionsHandler(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task<List<OneOf<ServiceOption, Error<Exception>>>> Handle(CreateServiceOptionsCommand command,
        CancellationToken cancellationToken)
    {
        Task<OneOf<ServiceOption, Error<Exception>>>[] tasks =
            new Task<OneOf<ServiceOption, Error<Exception>>>[command.Options.Count];

        for (int i = 0; i < command.Options.Count; i++)
        {
            CreateServiceOptionCommand optionCommand = new CreateServiceOptionCommand(
                command.Options[i].Type,
                command.Options[i].Name,
                command.Options[i].Value
            );
            tasks[i] = _mediator.SendCommandAsync<CreateServiceOptionCommand, OneOf<ServiceOption, Error<Exception>>>(
                optionCommand,
                cancellationToken
            );
        }

        return (await Task.WhenAll(tasks)).ToList();
    }
}