using System.ComponentModel.DataAnnotations;
using Cortex.Mediator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Commands.ServiceOptions;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;
using Weaver.WebApi.Models;

namespace Weaver.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ServiceTemplateOptionController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly WeaverDbContext _dbContext;

    public ServiceTemplateOptionController(IMediator mediator, WeaverDbContext dbContext)
    {
        _mediator = mediator;
        _dbContext = dbContext;
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(string name, OptionType type)
    {
        var command = new CreateServiceTemplateOptionCommand(name, type);

        try
        {
            await _mediator.SendCommandAsync<CreateServiceTemplateOptionCommand, ServiceTemplateOption>(command);
        }
        catch (ValidationException e)
        {
            return BadRequest(e.Message);
        }

        return Created();
    }

    [HttpGet]
    [ProducesResponseType<IEnumerable<ServiceTemplateOptionModel>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Get()
    {
        List<ServiceTemplateOptionModel> options = await _dbContext.ServiceTemplateOptions
            .AsNoTracking()
            .Select(option => new ServiceTemplateOptionModel
            {
                Id = option.Uuid,
                Name = option.Name,
                Type = option.Type
            })
            .ToListAsync();

        return Ok(options);
    }

    [HttpGet("{uuid:guid}")]
    [ProducesResponseType<ServiceTemplateOptionModel>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(Guid uuid)
    {
        var query = new GetServiceOptionByUuidQuery(uuid);
        var result =
            await _mediator.SendQueryAsync<GetServiceOptionByUuidQuery, OneOf<ServiceTemplateOption, None>>(query);

        return result.Match<IActionResult>(
            option => Ok(new ServiceTemplateOptionModel
            {
                Id = option.Uuid,
                Name = option.Name,
                Type = option.Type
            }),
            none => NotFound()
        );
    }
}