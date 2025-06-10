using Cortex.Mediator.Commands;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.ServiceOptions;

public class CreateServiceOptionHandler : ICommandHandler<CreateServiceOptionCommand>
{
    private readonly WeaverDbContext _dbContext;

    public CreateServiceOptionHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(CreateServiceOptionCommand command, CancellationToken cancellationToken)
    {
        ServiceOption option = new ServiceOption()
        {
            Uuid = Guid.NewGuid(),
            Name = command.Name,
            Type = command.Type,
        };

        await _dbContext.ServiceOptions.AddAsync(option, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}