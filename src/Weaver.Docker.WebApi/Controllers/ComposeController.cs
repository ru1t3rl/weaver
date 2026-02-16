using Cortex.Mediator;
using Docker.DotNet.Models;
using Microsoft.AspNetCore.Mvc;
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
        try
        {
            GetAllStacksCommand command = new();
            List<IGrouping<string, ContainerListResponse>> stacks = await _mediator.SendAsync(
                command,
                cancellationToken
            );

            List<ComposeListItemModel> composeProjects = stacks
                .Select(g => new { Key = g.Key.Replace("docker", ""), Containers = g.ToList() })
                .Select(g => new ComposeListItemModel(
                        g.Key.ToSha256Hash(),
                        g.Key,
                        GetStackHealth(g.Containers),
                        GetStackStatus(g.Containers),
                        g
                            .Containers
                            .Select(c => c.Names.FirstOrDefault() ?? "")
                            .ToList(),
                        g.Containers.SelectMany(GetPorts).Distinct().ToList()
                    )
                )
                .ToList();

            return Ok(composeProjects);
        }
        catch (Exception ex) when (ex is TaskCanceledException or OperationCanceledException)
        {
            return StatusCode(StatusCodes.Status499ClientClosedRequest, "Request canceled");
        }
    }

    [HttpGet("{identifier}")]
    [ProducesResponseType<ComposeDetailModel>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(string identifier, CancellationToken cancellationToken)
    {
        try
        {
            GetStackContainersCommand command = new(new Sha256Hash(identifier));
            List<ContainerListResponse> containers = await _mediator.SendAsync(command, cancellationToken);

            if (containers.Count == 0)
            {
                return NotFound();
            }

            List<ContainerListItemModel> containerModels = containers
                .Select(c => new ContainerListItemModel(
                        c.ID,
                        c.Names.First(),
                        c.Image,
                        c.State.ToEnum<Status>(),
                        c.Created,
                        c.Health.Status.ToEnum<Health>(),
                        identifier
                    )
                )
                .ToList();

            ComposeDetailModel detailModel = new(
                identifier,
                containers.First().Labels[ContainerLabels.DOCKER_COMPOSE_PROJECT_LABEL] ?? string.Empty,
                Health.Healthy,
                Status.Running,
                containerModels,
                GetPorts(containers.First())
            );

            return Ok(detailModel);
        }
        catch (Exception ex) when (ex is TaskCanceledException or OperationCanceledException)
        {
            return StatusCode(StatusCodes.Status499ClientClosedRequest, "Request canceled");
        }
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