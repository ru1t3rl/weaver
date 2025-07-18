using Cortex.Mediator.Commands;
using Microsoft.EntityFrameworkCore;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.Services;

public class CreateServiceTemplateHandler : ICommandHandler<CreateServiceTemplateCommand>
{
    private readonly WeaverDbContext _dbContext;

    public CreateServiceTemplateHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(CreateServiceTemplateCommand templateCommand, CancellationToken cancellationToken)
    {
        var options = await Task.WhenAll(
            templateCommand.Options.Select(async optionUuid => await _dbContext.ServiceOptions
                .SingleAsync(x => x.Uuid == optionUuid, cancellationToken))
        );

        ServiceTemplate serviceTemplate = new ServiceTemplate
        {
            Uuid = Guid.NewGuid(),
            Name = templateCommand.Name,
            Type = templateCommand.Type,
            Config = options,
        };

        await _dbContext.Services.AddAsync(serviceTemplate, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}