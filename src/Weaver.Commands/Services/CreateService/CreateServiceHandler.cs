using Cortex.Mediator.Commands;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Common.Exceptions;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.Services;

public class CreateServiceHandler :
    ICommandHandler<CreateServiceCommand, OneOf<Service, Error<Exception>>>
{
    private readonly WeaverDbContext _dbContext;

    public CreateServiceHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OneOf<Service, Error<Exception>>> Handle(CreateServiceCommand command,
        CancellationToken cancellationToken)
    {
        ServiceTemplate? template = await _dbContext.ServicesTemplates
            .SingleOrDefaultAsync(s => s.Uuid == command.TemplateUuid, cancellationToken);

        if (template is null)
        {
            return new Error<Exception>(
                new EntityNotFoundException("Template entity not found with uuid: " + command.TemplateUuid)
            );
        }

        Service service = new Service
        {
            Template = template,
            Name = command.Name,
            Options = command.Options
        };

        return service;
    }
}