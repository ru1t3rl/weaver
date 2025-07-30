using Cortex.Mediator.Commands;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Common.Exceptions;
using Weaver.Domain.Common.ServiceOptions;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.ServiceOptions;

public class UpdateServiceOptionHandler : ICommandHandler<
    UpdateServiceOptionCommand,
    OneOf<ServiceOption, Error<Exception>>
>
{
    private readonly WeaverDbContext _dbContext;

    public UpdateServiceOptionHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OneOf<ServiceOption, Error<Exception>>> Handle(UpdateServiceOptionCommand command,
        CancellationToken cancellationToken)
    {
        ServiceOption? serviceOption = await _dbContext.ServiceOptions
            .SingleOrDefaultAsync(s => s.Uuid == command.Uuid, cancellationToken);

        if (serviceOption is null)
        {
            return new Error<Exception>(new EntityNotFoundException());
        }

        serviceOption.Name = command.Name;
        UpdateServiceOptionValue(command, serviceOption);

        await _dbContext.SaveChangesAsync(cancellationToken);
        return serviceOption;
    }

    private void UpdateServiceOptionValue(UpdateServiceOptionCommand command, ServiceOption serviceOption)
    {
        if (command.Value.Value is string stringValue)
        {
            (serviceOption as ServiceOption<string>).Value = stringValue;
        }

        if (command.Value.Value is double doubleValue)
        {
            (serviceOption as ServiceOption<double>).Value = doubleValue;
        }

        if (command.Value.Value is bool boolValue)
        {
            (serviceOption as ServiceOption<bool>).Value = boolValue;
        }

        if (command.Value.Value is string[] stringArrayValue)
        {
            (serviceOption as ServiceOption<string[]>).Value = stringArrayValue;
        }

        if (command.Value.Value is double[] doubleArrayValue)
        {
            (serviceOption as ServiceOption<double[]>).Value = doubleArrayValue;
        }
    }
}