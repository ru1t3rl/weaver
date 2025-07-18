using Cortex.Mediator.Commands;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.ServiceOptions;

public class CreateServiceTemplateOptionHandler : ICommandHandler<CreateServiceTemplateOptionCommand>
{
    private readonly WeaverDbContext _dbContext;

    public CreateServiceTemplateOptionHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(CreateServiceTemplateOptionCommand command, CancellationToken cancellationToken)
    {
        ServiceTemplateOption templateOption = new ServiceTemplateOption()
        {
            Uuid = Guid.NewGuid(),
            Name = command.Name,
            Type = command.Type,
        };

        await _dbContext.ServiceOptions.AddAsync(templateOption, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}