using Cortex.Mediator.Commands;
using Docker.DotNet;
using Docker.DotNet.Models;

namespace Weaver.Docker.Commands.Compose;

public class GetAllStacksCommandHandler :
    ICommandHandler<GetAllStacksCommand, List<IGrouping<string, ContainerListResponse>>>
{
    private const string DOCKER_COMPOSE_LABEL = "com.docker.compose";
    private const string DOCKER_COMPOSE_PROJECT_LABEL = $"{DOCKER_COMPOSE_LABEL}.project";

    private readonly IDockerClient _dockerClient;

    public GetAllStacksCommandHandler(IDockerClient dockerClient)
    {
        _dockerClient = dockerClient;
    }

    public async Task<List<IGrouping<string, ContainerListResponse>>> Handle(
        GetAllStacksCommand command,
        CancellationToken cancellationToken
    )
    {
        IList<ContainerListResponse> containers = await _dockerClient.Containers.ListContainersAsync(
            new ContainersListParameters { All = false },
            cancellationToken
        );

        List<IGrouping<string, ContainerListResponse>> composeProjects = containers
            .Where(c => c.Labels is not null && c.Labels.ContainsKey(DOCKER_COMPOSE_PROJECT_LABEL))
            .GroupBy(c => c.Labels[DOCKER_COMPOSE_PROJECT_LABEL])
            .ToList();

        return composeProjects;
    }
}