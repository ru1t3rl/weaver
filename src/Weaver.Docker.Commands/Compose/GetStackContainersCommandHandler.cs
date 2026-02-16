using Cortex.Mediator.Commands;
using Cortex.Mediator.Queries;
using Docker.DotNet;
using Docker.DotNet.Models;
using Weaver.Extensions;

namespace Weaver.Docker.Commands.Compose;

public class GetStackContainersCommandHandler : ICommandHandler<GetStackContainersCommand, List<ContainerListResponse>>
{
    private const string DOCKER_COMPOSE_LABEL = "com.docker.compose";
    private const string DOCKER_COMPOSE_PROJECT_LABEL = $"{DOCKER_COMPOSE_LABEL}.project";

    private readonly IDockerClient _dockerClient;

    public GetStackContainersCommandHandler(IDockerClient dockerClient)
    {
        _dockerClient = dockerClient;
    }

    public async Task<List<ContainerListResponse>> Handle(
        GetStackContainersCommand command,
        CancellationToken cancellationToken
    )
    {
        IList<ContainerListResponse> containers = await _dockerClient.Containers.ListContainersAsync(
            new ContainersListParameters { All = false },
            cancellationToken
        );

        List<ContainerListResponse> stackContainers = containers
            .Where(c => c.Labels is not null && c.Labels.ContainsKey(DOCKER_COMPOSE_PROJECT_LABEL))
            .Where(c => c.Labels[DOCKER_COMPOSE_PROJECT_LABEL].ToSha256Hash() == command.StackIdentifier)
            .ToList();

        return stackContainers;
    }
}