using Cortex.Mediator.Commands;
using Microsoft.EntityFrameworkCore;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.Services;

public class CreateServiceHandler : ICommandHandler<CreateServiceCommand>
{
    private readonly WeaverDbContext _dbContext;

    public CreateServiceHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(CreateServiceCommand command, CancellationToken cancellationToken)
    {
        var options = await Task.WhenAll(
            command.Options.Select(async optionUuid => await _dbContext.ServiceOptions
                .SingleAsync(x => x.Uuid == optionUuid, cancellationToken))
        );

        Service service = new Service
        {
            Name = command.Name,
            Type = command.Type,
            Config = options,
        };

        await _dbContext.Services.AddAsync(service, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}