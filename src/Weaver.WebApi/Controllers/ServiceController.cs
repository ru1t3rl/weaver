using Cortex.Mediator;
using Cortex.Mediator.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Commands.Services;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;
using Weaver.WebApi.Models;

namespace Weaver.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ServiceController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly WeaverDbContext _dbContext;

    public ServiceController(Mediator mediator, WeaverDbContext dbContext)
    {
        _mediator = mediator;
        _dbContext = dbContext;
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(string name, ServiceType type, IEnumerable<Guid> options)
    {
        var command = new CreateServiceCommand(name, type, options);

        try
        {
            await _mediator.SendAsync(command);
        }
        catch (ValidationException e)
        {
            return BadRequest(e.Message);
        }

        return Created();
    }

    [HttpGet]
    [ProducesResponseType<IEnumerable<ServiceListItemModel>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Get()
    {
        IEnumerable<ServiceListItemModel> services = await _dbContext.Services
            .AsNoTracking()
            .Select(s => new ServiceListItemModel
            {
                Id = s.Uuid,
                Name = s.Name,
                Type = s.Type
            })
            .ToListAsync();

        return Ok(services);
    }

    [HttpGet("{uuid:guid}")]
    [ProducesResponseType<ServiceDetailModel>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(Guid uuid, CancellationToken cancellationToken = default)
    {
        var query = new GetServiceByUuidQuery(uuid);
        var result = await _mediator.SendAsync<GetServiceByUuidQuery, OneOf<Service, None>>(query, cancellationToken);

        return result.Match<IActionResult>(
            service => Ok(new ServiceDetailModel
            {
                Id = service.Uuid,
                Name = service.Name,
                Type = service.Type,
                Config = service.Config
            }),
            none => NotFound()
        );
    }
}