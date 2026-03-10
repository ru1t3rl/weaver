using Cortex.Mediator.Commands;
using Docker.DotNet;
using Docker.DotNet.Models;
using Weaver.Docker.Common;

namespace Weaver.Docker.Commands.Compose;

public class
    GetAllStacksCommandHandler : ICommandHandler<GetAllStacksCommand, List<IGrouping<string, ContainerListResponse>>>
{
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
        try
        {
            IList<ContainerListResponse> containers = await _dockerClient.Containers.ListContainersAsync(
                new ContainersListParameters { All = true },
                cancellationToken
            );

            List<IGrouping<string, ContainerListResponse>> composeProjects = containers
                .Where(c => c.Labels is not null && c.Labels.ContainsKey(ContainerLabels.DOCKER_COMPOSE_PROJECT_LABEL))
                .GroupBy(c => c.Labels[ContainerLabels.DOCKER_COMPOSE_PROJECT_LABEL])
                .ToList();

            return composeProjects;
        }
        catch (Exception ex) when (ex is TaskCanceledException or OperationCanceledException)
        {
        }

        return [];
    }
}