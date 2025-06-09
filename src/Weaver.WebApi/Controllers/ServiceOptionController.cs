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
public class ServiceOptionController : ControllerBase
{
    private readonly Mediator _mediator;
    private readonly WeaverDbContext _dbContext;

    public ServiceOptionController(Mediator mediator, WeaverDbContext dbContext)
    {
        _mediator = mediator;
        _dbContext = dbContext;
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(string name, OptionType type)
    {
        var command = new CreateServiceOptionCommand(name, type);

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
    [ProducesResponseType<IEnumerable<ServiceOptionModel>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Get()
    {
        List<ServiceOptionModel> options = await _dbContext.ServiceOptions
            .AsNoTracking()
            .Select(option => new ServiceOptionModel
            {
                Id = option.Uuid,
                Name = option.Name,
                Type = option.Type
            })
            .ToListAsync();

        return Ok(options);
    }

    [HttpGet("{uuid:guid}")]
    [ProducesResponseType<ServiceOptionModel>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(Guid uuid)
    {
        var query = new GetServiceOptionByUuidQuery(uuid);
        var result = await _mediator.SendAsync<GetServiceOptionByUuidQuery, OneOf<ServiceOption, None>>(query);

        return result.Match<IActionResult>(
            option => Ok(new ServiceOptionModel
            {
                Id = option.Uuid,
                Name = option.Name,
                Type = option.Type
            }),
            none => NotFound()
        );
    }
}