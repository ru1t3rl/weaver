using Cortex.Mediator.Commands;
using Docker.DotNet;
using Docker.DotNet.Models;
using OneOf;
using OneOf.Types;
using Weaver.Docker.Common;
using Error = Weaver.Docker.Common.Error;

namespace Weaver.Docker.Commands.Containers;

public class StopContainerCommandHandler : ICommandHandler<StartContainerCommand, OneOf<Success, Error>>
{
    private readonly IDockerClient _dockerClient;

    public StopContainerCommandHandler(IDockerClient dockerClient)
    {
        _dockerClient = dockerClient;
    }

    public async Task<OneOf<Success, Error>> Handle(StartContainerCommand command, CancellationToken cancellationToken)
    {
        try
        {
            await _dockerClient.Containers.StopContainerAsync(
                command.ContainerIdentifier,
                new ContainerStopParameters(),
                cancellationToken
            );
        }
        catch (DockerApiException ex)
        {
            return new Error(ErrorType.DockerApi, [ex.Message, ex.StackTrace ?? String.Empty]);
        }
        catch (Exception ex) when (ex is TaskCanceledException or OperationCanceledException)
        {
            return new Error(ErrorType.Canceled, [ex.Message, ex.StackTrace ?? String.Empty]);
        }

        return new Success();
    }
}