using Cortex.Mediator.Commands;
using Docker.DotNet;
using Docker.DotNet.Models;
using Microsoft.Extensions.Logging;
using OneOf;
using OneOf.Types;
using Weaver.Docker.Common;
using Error = Weaver.Docker.Common.Error;

namespace Weaver.Docker.Commands.Containers;

public class StartContainerCommandHandler : ICommandHandler<StartContainerCommand, OneOf<Success, Error>>
{
    private readonly IDockerClient _dockerClient;
    private readonly ILogger<StartContainerCommandHandler> _logger;

    public StartContainerCommandHandler(IDockerClient dockerClient, ILogger<StartContainerCommandHandler> logger)
    {
        _dockerClient = dockerClient;
        _logger = logger;
    }

    public async Task<OneOf<Success, Error>> Handle(StartContainerCommand command, CancellationToken cancellationToken)
    {
        try
        {
            await _dockerClient.Containers.StartContainerAsync(
                command.ContainerIdentifier,
                new ContainerStartParameters(),
                cancellationToken
            );
        }
        catch (DockerApiException ex)
        {
            _logger.LogError("{message}:\r{trace}", ex.Message, ex.StackTrace);
            return new Error(ErrorType.DockerApi, [ex.Message, ex.StackTrace ?? String.Empty]);
        }
        catch (Exception ex) when (ex is TaskCanceledException or OperationCanceledException)
        {
            _logger.LogError("{message}:\r{trace}", ex.Message, ex.StackTrace);
            return new Error(ErrorType.Canceled, [ex.Message, ex.StackTrace ?? String.Empty]);
        }

        return new Success();
    }
}