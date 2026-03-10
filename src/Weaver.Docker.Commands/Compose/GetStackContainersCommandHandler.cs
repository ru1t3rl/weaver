using Cortex.Mediator.Commands;
using Docker.DotNet;
using Docker.DotNet.Models;
using OneOf;
using OneOf.Types;
using Weaver.Docker.Common;
using Weaver.Extensions;

namespace Weaver.Docker.Commands.Compose;

public class
    GetStackContainersCommandHandler : ICommandHandler<GetStackContainersCommand,
    OneOf<List<ContainerListResponse>, None>>
{
    private readonly IDockerClient _dockerClient;

    public GetStackContainersCommandHandler(IDockerClient dockerClient)
    {
        _dockerClient = dockerClient;
    }

    public async Task<OneOf<List<ContainerListResponse>, None>> Handle(
        GetStackContainersCommand command,
        CancellationToken cancellationToken
    )
    {
        try
        {
            IList<ContainerListResponse> containers = await _dockerClient.Containers.ListContainersAsync(
                new ContainersListParameters { All = true },
                cancellationToken
            );

            List<ContainerListResponse> stackContainers = containers
                .Where(c => c.Labels is not null && c.Labels.ContainsKey(ContainerLabels.DOCKER_COMPOSE_PROJECT_LABEL))
                .Where(c => c.Labels[ContainerLabels.DOCKER_COMPOSE_PROJECT_LABEL].ToSha256Hash() == command.StackIdentifier)
                .ToList();

            if (stackContainers.Count == 0)
            {
                return new None();
            }

            return stackContainers;
        }
        catch (Exception ex) when (ex is TaskCanceledException or OperationCanceledException)
        {
        }

        return new None();
    }
}