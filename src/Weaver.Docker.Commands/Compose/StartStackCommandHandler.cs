using Cortex.Mediator;
using Cortex.Mediator.Commands;
using Docker.DotNet.Models;
using OneOf;
using OneOf.Types;
using Weaver.Docker.Commands.Containers;
using Weaver.Docker.Common;
using Weaver.Extensions;
using Error = Weaver.Docker.Common.Error;

namespace Weaver.Docker.Commands.Compose;

public class StartStackCommandHandler : ICommandHandler<StartStackCommand, OneOf<Success, Error>>
{
    private readonly IMediator _mediator;

    public StartStackCommandHandler(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task<OneOf<Success, Error>> Handle(StartStackCommand command, CancellationToken cancellationToken)
    {
        try
        {
            GetStackContainersCommand containersCommand = new(command.StackIdentifier);
            var result = await _mediator.SendAsync(containersCommand, cancellationToken);
            if (result.IsT1)
            {
                return new Error(ErrorType.NotFound);
            }

            List<ContainerListResponse> containers = result.AsT0;
            Task<OneOf<Success, Error>>[] tasks = new Task<OneOf<Success, Error>>[containers.Count];
            for (int i = 0; i < tasks.Length; i++)
            {
                StartContainerCommand startCommand = new(containers[i].ID.ToSha256Hash());
                tasks[i] = _mediator.SendAsync(startCommand, cancellationToken);
            }

            OneOf<Success, Error>[] results = await Task.WhenAll(tasks);

            if (results.Any(r => r.IsT1))
            {
                return new Error(
                    ErrorType.DockerApi,
                    results
                        .Where(r => r.IsT1)
                        .SelectMany(r => r.AsT1.Messages)
                        .ToArray()
                );
            }
        }
        catch (Exception ex) when (ex is TaskCanceledException or OperationCanceledException)
        {
            return new Error(ErrorType.Canceled, [ex.Message, ex.StackTrace ?? String.Empty]);
        }

        return new Success();
    }
}