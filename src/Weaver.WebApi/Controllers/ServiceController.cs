using Cortex.Mediator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Commands.ServiceOptions;
using Weaver.Commands.ServiceOptions.UpdateServiceOptions;
using Weaver.Commands.Services;
using Weaver.Domain.Common.ServiceOptions;
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

    public ServiceController(IMediator mediator, WeaverDbContext dbContext)
    {
        _mediator = mediator;
        _dbContext = dbContext;
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(Guid templateId, string name, List<ServiceOptionModel> serviceOptions)
    {
        var options = await CreateOrUpdateServiceOptionsCommand(serviceOptions);
        if (options.Any(o => o.IsT1))
        {
            var exceptions = options
                .Where(o => o.IsT1)
                .Select(o => o.AsT1);

            return BadRequest(exceptions);
        }

        CreateServiceCommand createServiceCommand =
            new CreateServiceCommand(name, templateId, options.Select(s => s.AsT0).ToList());
        await _mediator.SendCommandAsync<CreateServiceCommand, OneOf<Service, Error<Exception>>>(createServiceCommand);

        return Created();
    }

    [HttpPatch]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(Guid serviceId, string name,
        List<ServiceOptionModel> serviceOptions)
    {
        var options = await CreateOrUpdateServiceOptionsCommand(serviceOptions);
        if (options.Any(o => o.IsT1))
        {
            var exceptions = options
                .Where(o => o.IsT1)
                .Select(o => o.AsT1);

            return BadRequest(exceptions);
        }

        UpdateServiceCommand updateServiceCommand = new UpdateServiceCommand(
            serviceId, name, options.Select(s => s.AsT0).ToList()
        );
        await _mediator.SendCommandAsync<UpdateServiceCommand, OneOf<Service, Error<Exception>>>(updateServiceCommand);
        return Ok();
    }

    private async Task<List<OneOf<ServiceOption, Error<Exception>>>> CreateOrUpdateServiceOptionsCommand(
        List<ServiceOptionModel> serviceOptions)
    {
        List<ServiceOptionModel> toCreate = serviceOptions.Where(s => s.Id is null).ToList();
        List<ServiceOptionModel> toUpdate = serviceOptions.Where(s => s.Id is not null).ToList();

        CreateServiceOptionsCommand createServiceOptionsCommand = new CreateServiceOptionsCommand(
            toCreate.Select(s => new CreateServiceOptionModel(
                s.Type,
                s.Name,
                s.Type switch
                {
                    OptionType.String => (string)s.Value,
                    OptionType.Number => (double)s.Value,
                    OptionType.Boolean => (bool)s.Value,
                    OptionType.StringArray => (string[])s.Value,
                    OptionType.NumberArray => (double[])s.Value
                }
            )).ToList()
        );

        var createdOptions = await _mediator
            .SendCommandAsync<CreateServiceOptionsCommand, List<OneOf<ServiceOption, Error<Exception>>>>(
                createServiceOptionsCommand
            );

        UpdateServiceOptionsCommand optionsCommand = new UpdateServiceOptionsCommand(
            toUpdate.Select(s => new UpdateServiceOptionModel(
                s.Id!.Value,
                s.Type,
                s.Name,
                s.Type switch
                {
                    OptionType.String => (string)s.Value,
                    OptionType.Number => (double)s.Value,
                    OptionType.Boolean => (bool)s.Value,
                    OptionType.StringArray => (string[])s.Value,
                    OptionType.NumberArray => (double[])s.Value
                }
            )).ToList()
        );

        var updatedOptions = await _mediator.SendCommandAsync<
            UpdateServiceOptionsCommand,
            List<OneOf<ServiceOption, Error<Exception>>>
        >(optionsCommand);

        return [..createdOptions, ..updatedOptions];
    }

    [HttpGet]
    [ProducesResponseType<IEnumerable<ServiceListItemModel>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Get()
    {
        List<ServiceListItemModel> options = await _dbContext.Services
            .Include(s => s.Template)
            .AsNoTracking()
            .Select(s => new ServiceListItemModel
            {
                Id = s.Uuid,
                TemplateId = s.Template.Uuid,
                Name = s.Name,
            })
            .ToListAsync();

        return Ok(options);
    }

    [HttpGet("{uuid:guid}")]
    [ProducesResponseType<ServiceDetailModel>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(Guid uuid)
    {
        Service? service = await _dbContext.Services
            .Include(s => s.Template)
            .Include(s => s.Options)
            .AsNoTracking()
            .SingleOrDefaultAsync(s => s.Uuid == uuid);

        if (service is null)
        {
            return NotFound();
        }

        List<ServiceOptionModel> options = service.Options.Select(o => new ServiceOptionModel
        {
            Id = o.Uuid,
            Name = o.Name,
            Type = o.Type,
            Value = o switch
            {
                ServiceOption<string> s => s.Value,
                ServiceOption<double> d => d.Value,
                ServiceOption<bool> b => b.Value,
                ServiceOption<string[]> s => s.Value,
                ServiceOption<double[]> d => d.Value
            }
        }).ToList();

        return Ok(new ServiceDetailModel
        {
            Id = service.Uuid,
            Name = service.Name,
            TemplateId = service.Template.Uuid,
            Options = options
        });
    }
}