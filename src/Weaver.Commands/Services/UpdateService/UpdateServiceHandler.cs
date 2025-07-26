using Cortex.Mediator.Commands;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Common.Exceptions;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.Services;

public class UpdateServiceHandler : ICommandHandler<UpdateServiceCommand, OneOf<Service, Error<Exception>>>
{
    private readonly WeaverDbContext _dbContext;

    public UpdateServiceHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OneOf<Service, Error<Exception>>> Handle(UpdateServiceCommand command,
        CancellationToken cancellationToken)
    {
        Service? service = await _dbContext.Services
            .SingleOrDefaultAsync(s => s.Uuid == command.Uuid, cancellationToken);

        if (service is null)
        {
            return new Error<Exception>(
                new EntityNotFoundException("Service entity not found with uuid: " + command.Uuid)
            );
        }

        service.Name = command.Name;
        service.Options = command.Options;

        return service;
    }
}