using Cortex.Mediator;
using Docker.DotNet;
using Docker.DotNet.Models;
using Microsoft.AspNetCore.Mvc;
using Weaver.Docker.Commands.Compose;
using Weaver.Docker.WebApi.Models;
using Weaver.Extensions;

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
    [ProducesResponseType<List<ComposeModel>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        GetAllStacksCommand command = new();
        List<IGrouping<string, ContainerListResponse>> stacks = await _mediator.SendAsync(command, cancellationToken);

        List<ComposeModel> composeProjects = stacks
            .Select(g => new { Key = g.Key.Replace("docker", ""), Containers = g })
            .Select(g => new ComposeModel(
                    g.Key.ToSha256Hash(),
                    g.Key,
                    g
                        .Containers
                        .Select(c => new ContainerListItemModel(
                                c.ID,
                                c.Names.First(),
                                c.Image,
                                c.Status,
                                c.Created,
                                c.Health.Status,
                                g.Key
                            )
                        )
                        .ToList()
                )
            )
            .ToList();

        return Ok(composeProjects);
    }
}