using Cortex.Mediator.Commands;
using Docker.DotNet;
using Docker.DotNet.Models;
using Microsoft.Extensions.Logging;
using Weaver.Docker.Common;
using OneOf;

namespace Weaver.Docker.Commands.Containers;

public class
    GetContainerDetailsCommandHandler : ICommandHandler<GetContainerDetailsCommand, OneOf<ContainerDetail, Error>>
{
    private readonly IDockerClient _dockerClient;
    private readonly ILogger<GetContainerDetailsCommandHandler> _logger;

    public GetContainerDetailsCommandHandler(
        IDockerClient dockerClient,
        ILogger<GetContainerDetailsCommandHandler> logger
    )
    {
        _dockerClient = dockerClient;
        _logger = logger;
    }

    public async Task<OneOf<ContainerDetail, Error>> Handle(
        GetContainerDetailsCommand command,
        CancellationToken cancellationToken
    )
    {
        try
        {
            IList<ContainerListResponse> containers = await _dockerClient.Containers.ListContainersAsync(
                new ContainersListParameters() { All = true },
                cancellationToken
            );

            ContainerListResponse? containerListResponse = containers.SingleOrDefault(c => c.ID == command.ContainerId);

            if (containerListResponse is null)
            {
                return new Error(ErrorType.NotFound);
            }
            
            ContainerInspectResponse containerInspect =
                await _dockerClient.Containers.InspectContainerAsync(command.ContainerId, cancellationToken);

            Task<MultiplexedStream> logsTask = _dockerClient.Containers.GetContainerLogsAsync(
                command.ContainerId,
                new ContainerLogsParameters()
                {
                    Follow = false,
                    ShowStderr = true,
                    ShowStdout = true,
                    Timestamps = true
                },
                cancellationToken
            );

            (string stdout, string stderr) = await (await logsTask).ReadOutputToEndAsync(cancellationToken);

            return new ContainerDetail
            {
                InspectResponse = containerInspect,
                ListResponse = containerListResponse,
                ErrorLogs = stderr,
                OutputLogs = stdout
            };
        }
        catch (Exception ex) when (ex is DockerApiException)
        {
            _logger.LogError("{message}:\r{trace}", ex.Message, ex.StackTrace);
            return new Error(ErrorType.DockerApi, [ex.Message, ex.StackTrace ?? String.Empty]);
        }
        catch (Exception ex) when (ex is TaskCanceledException or OperationCanceledException)
        {
            _logger.LogError("{message}:\r{trace}", ex.Message, ex.StackTrace);
            return new Error(ErrorType.Canceled, [ex.Message, ex.StackTrace ?? String.Empty]);
        }
    }
}