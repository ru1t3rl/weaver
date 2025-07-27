using Cortex.Mediator;
using Cortex.Mediator.Commands;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Common.ServiceOptions;

namespace Weaver.Commands.ServiceOptions.UpdateServiceOptions;

public class UpdateServiceOptionsHandler : ICommandHandler<
    UpdateServiceOptionsCommand,
    List<OneOf<ServiceOption, Error<Exception>>>
>
{
    private readonly IMediator _mediator;

    public UpdateServiceOptionsHandler(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task<List<OneOf<ServiceOption, Error<Exception>>>> Handle(UpdateServiceOptionsCommand command,
        CancellationToken cancellationToken)
    {
        Task<OneOf<ServiceOption, Error<Exception>>>[] tasks =
            new Task<OneOf<ServiceOption, Error<Exception>>>[command.Options.Count];

        for (int i = 0; i < command.Options.Count; i++)
        {
            UpdateServiceOptionCommand optionCommand = new UpdateServiceOptionCommand(
                command.Options[i].Uuid,
                command.Options[i].Type,
                command.Options[i].Name,
                command.Options[i].Value
            );
            tasks[i] = _mediator.SendCommandAsync<UpdateServiceOptionCommand, OneOf<ServiceOption, Error<Exception>>>(
                optionCommand,
                cancellationToken
            );
        }

        return (await Task.WhenAll(tasks)).ToList();
    }
}