using Cortex.Mediator;
using Docker.DotNet.Models;
using Microsoft.AspNetCore.Mvc;
using OneOf;
using OneOf.Types;
using Weaver.Docker.Commands.Compose;
using Weaver.Docker.Common;
using Weaver.Docker.WebApi.Models;
using Weaver.Extensions;
using Error = Weaver.Docker.Common.Error;
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
            .Select(g => new { Id = g.Key.ToSha256Hash(), Key = g.Key.Replace("docker", ""), Containers = g.ToList() })
            .Select(g => new ComposeListItemModel()
                {
                    Id = g.Id,
                    Name = g.Key,
                    Health = g.Containers.GetStackHealth(),
                    Status = g.Containers.GetStackStatus(),
                    ContainerNames = g
                        .Containers
                        .Select(c => c.Names.FirstOrDefault() ?? "")
                        .ToList(),
                    Ports = g.Containers.SelectMany(c => c.GetPorts()).Distinct().ToList()
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
                    ComposeName = stackName,
                    DependsOn = c.GetDependsOn(containers),
                    Networks = c.GetNetworks()
                }
            )
            .ToList();

        ComposeDetailModel detailModel = new()
        {
            Id = identifier,
            Name = containers.First().Labels[ContainerLabels.DOCKER_COMPOSE_PROJECT_LABEL] ?? string.Empty,
            Health = containers.GetStackHealth(),
            Status = containers.GetStackStatus(),
            Containers = containerModels,
            Ports = containers.SelectMany(c => c.GetPorts()).Distinct().ToList()
        };

        return Ok(detailModel);
    }

    [HttpPost("{identifier}/start")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Start(string identifier, CancellationToken cancellationToken)
    {
        StartStackCommand command = new(identifier.ToSha256Hash());
        OneOf<Success, Error> result = await _mediator.SendAsync(command, cancellationToken);

        return result.Match<IActionResult>(
            _ => Ok(),
            error => BadRequest(error.Messages)
        );
    }
}