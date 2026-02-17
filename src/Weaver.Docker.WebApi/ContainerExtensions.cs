using Docker.DotNet.Models;
using Weaver.Docker.Common;
using Weaver.Docker.WebApi.Models;
using Weaver.Extensions;
using Health = Weaver.Docker.WebApi.Models.Health;
using Status = Weaver.Docker.WebApi.Models.Status;

namespace Weaver.Docker;

public static class ContainerExtensions
{
    public static List<PortMapping> GetPorts(this ContainerListResponse container)
    {
        return container
            .Ports
            .Select(p => new PortMapping(
                    p.PublicPort == 0 ? null : p.PublicPort,
                    p.PrivatePort
                )
            )
            .ToList();
    }

    public static Health GetStackHealth(this List<ContainerListResponse> containers)
    {
        return containers
            .Select(c => c.Health.Status.ToEnum<Health>())
            .GroupBy(c => c)
            .Select(healthGroup => new
                {
                    count = healthGroup.Count(),
                    status = healthGroup.Key
                }
            )
            .Where(c => c.status != Health.None)
            .MaxBy(c => c.count)
            ?.status ?? Health.None;
    }

    public static Status GetStackStatus(this List<ContainerListResponse> containers)
    {
        return containers
            .Select(c => c.State.ToEnum<Status>())
            .GroupBy(c => c)
            .Select(statusGroup => new
                {
                    count = statusGroup.Count(),
                    status = statusGroup.Key
                }
            )
            .MaxBy(c => c.count)
            ?.status ?? Status.Dead;
    }

    public static string[] GetDependsOn(this ContainerListResponse container, List<ContainerListResponse> containers)
    {
        if (!container.Labels.ContainsKey(ContainerLabels.DOCKER_COMPOSE_DEPENDS_ON))
        {
            return [];
        }

        string containerDependsOnLabel = container.Labels[ContainerLabels.DOCKER_COMPOSE_DEPENDS_ON];
        if (string.IsNullOrEmpty(containerDependsOnLabel))
        {
            return [];
        }

        string[] containerNames = containerDependsOnLabel
            .Split(',')
            .Select(s => s.Split(':').First())
            .ToArray();

        string[] dependencyIds = containers
            .Where(c => containerNames.Any(label => c.Names.First().ToLower().Contains(label.ToLower())))
            .Where(c => c.ID != container.ID)
            .Select(c => c.ID)
            .ToArray();

        return dependencyIds;
    }

    public static string[] GetDependsOn(this ContainerListResponse container, List<ContainerInspectResponse> containers)
    {
        if (!container.Labels.ContainsKey(ContainerLabels.DOCKER_COMPOSE_DEPENDS_ON))
        {
            return [];
        }

        string[] containerLabels = container
            .Labels[ContainerLabels.DOCKER_COMPOSE_DEPENDS_ON]
            .Split(',')
            .Select(s => s.Split(':').First())
            .ToArray();

        string[] dependencyIds = containers
            .Where(c => containerLabels.Any(label => c.Name.ToLower().Contains(label.ToLower())))
            .Where(c => c.ID != container.ID)
            .Select(c => c.ID)
            .ToArray();

        return dependencyIds;
    }
}