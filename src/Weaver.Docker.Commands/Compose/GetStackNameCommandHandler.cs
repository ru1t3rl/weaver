using Cortex.Mediator.Commands;
using Docker.DotNet;
using Docker.DotNet.Models;
using OneOf;
using OneOf.Types;
using Weaver.Extensions;

namespace Weaver.Docker.Commands.Compose;

public class GetStackNameCommandHandler : ICommandHandler<GetStackNameCommand, OneOf<string, None>>
{
    private const string DOCKER_COMPOSE_LABEL = "com.docker.compose";
    private const string DOCKER_COMPOSE_PROJECT_LABEL = $"{DOCKER_COMPOSE_LABEL}.project";

    private readonly IDockerClient _dockerClient;

    public GetStackNameCommandHandler(IDockerClient dockerClient)
    {
        _dockerClient = dockerClient;
    }

    public async Task<OneOf<string, None>> Handle(
        GetStackNameCommand command,
        CancellationToken cancellationToken
    )
    {
        try
        {
            IList<ContainerListResponse> containers = await _dockerClient.Containers.ListContainersAsync(
                new ContainersListParameters { All = false },
                cancellationToken
            );

            ContainerListResponse? stackContainers = containers
                .Where(c => c.Labels is not null && c.Labels.ContainsKey(DOCKER_COMPOSE_PROJECT_LABEL))
                .FirstOrDefault(c => c.Labels[DOCKER_COMPOSE_PROJECT_LABEL].ToSha256Hash() == command.StackIdentifier);

            if (stackContainers is null)
            {
                return new None();
            }

            return stackContainers.Labels[DOCKER_COMPOSE_PROJECT_LABEL];
        }
        catch (Exception ex) when (ex is TaskCanceledException or OperationCanceledException)
        {
        }

        return new None();
    }
}