using Cortex.Mediator;
using Docker.DotNet.Models;
using Microsoft.AspNetCore.Mvc;
using OneOf;
using OneOf.Types;
using Weaver.Docker.Commands.Compose;
using Weaver.Docker.Common;
using Weaver.Docker.WebApi.Models;
using Weaver.Extensions;
using Status = Weaver.Docker.WebApi.Models.Status;
using Health = Weaver.Docker.WebApi.Models.Health;

namespace Weaver.Docker.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ComposeController : ControllerBase
{
    private readonly IMediator _mediator;

    public ComposeController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType<List<ComposeListItemModel>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        GetAllStacksCommand command = new();
        List<IGrouping<string, ContainerListResponse>> stacks = await _mediator.SendAsync(
            command,
            cancellationToken
        );

        List<ComposeListItemModel> composeProjects = stacks
            .Select(g => new { Key = g.Key.Replace("docker", ""), Containers = g.ToList() })
            .Select(g => new ComposeListItemModel()
                {
                    Id = g.Key.ToSha256Hash(),
                    Name = g.Key,
                    Health = GetStackHealth(g.Containers),
                    Status = GetStackStatus(g.Containers),
                    ContainerNames = g
                        .Containers
                        .Select(c => c.Names.FirstOrDefault() ?? "")
                        .ToList(),
                    Ports = g.Containers.SelectMany(GetPorts).Distinct().ToList()
                }
            )
            .ToList();

        return Ok(composeProjects);
    }

    [HttpGet("{identifier}")]
    [ProducesResponseType<ComposeDetailModel>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(string identifier, CancellationToken cancellationToken)
    {
        GetStackContainersCommand command = new(new Sha256Hash(identifier));
        OneOf<List<ContainerListResponse>, None> result = await _mediator.SendAsync(command, cancellationToken);

        GetStackNameCommand nameCommand = new(new Sha256Hash(identifier));
        OneOf<string, None> nameResult = await _mediator.SendAsync(nameCommand, cancellationToken);

        if (!result.TryPickT0(out List<ContainerListResponse> containers, out _) ||
            !nameResult.TryPickT0(out string stackName, out _))
        {
            return NotFound();
        }

        List<ContainerListItemModel> containerModels = containers
            .Select(c => new ContainerListItemModel()
                {
                    Id = c.ID,
                    Name = c.Names.First(),
                    Image = c.Image,
                    Status = c.State.ToEnum<Status>(),
                    Created = c.Created,
                    Health = c.Health.Status.ToEnum<Health>(),
                    ComposeName = stackName
                }
            )
            .ToList();

        ComposeDetailModel detailModel = new()
        {
            Id = identifier,
            Name = containers.First().Labels[ContainerLabels.DOCKER_COMPOSE_PROJECT_LABEL] ?? string.Empty,
            Health = Health.Healthy,
            Status = Status.Running,
            Containers = containerModels,
            Ports = containers.SelectMany(GetPorts).Distinct().ToList()
        };

        return Ok(detailModel);
    }

    private List<PortMapping> GetPorts(ContainerListResponse container)
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

    private Health GetStackHealth(List<ContainerListResponse> containers)
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

    private Status GetStackStatus(List<ContainerListResponse> containers)
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
}