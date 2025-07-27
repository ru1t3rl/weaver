using Cortex.Mediator.Commands;
using Microsoft.EntityFrameworkCore;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.ServicesTemplates;

public class CreateServiceTemplateHandler : ICommandHandler<CreateServiceTemplateCommand, ServiceTemplate>
{
    private readonly WeaverDbContext _dbContext;

    public CreateServiceTemplateHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ServiceTemplate> Handle(CreateServiceTemplateCommand templateCommand,
        CancellationToken cancellationToken)
    {
        List<ServiceTemplateOption> templateOptions = new();
        foreach (Guid optionUuid in templateCommand.Options)
        {
            templateOptions.Add(await _dbContext.ServiceTemplateOptions.SingleAsync(
                s => s.Uuid == optionUuid,
                cancellationToken
            ));
        }

        ServiceTemplate serviceTemplate = new ServiceTemplate
        {
            Uuid = Guid.NewGuid(),
            Name = templateCommand.Name,
            Type = templateCommand.Type,
            Config = templateOptions,
        };

        await _dbContext.ServicesTemplates.AddAsync(serviceTemplate, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return serviceTemplate;
    }
}