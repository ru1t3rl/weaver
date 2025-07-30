using Cortex.Mediator.Commands;
using Npgsql;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Common.ServiceOptions;
using Weaver.Infrastructure;

namespace Weaver.Commands.ServiceOptions;

public class CreateServiceOptionHandler : ICommandHandler<
    CreateServiceOptionCommand,
    OneOf<ServiceOption, Error<Exception>>
>
{
    private readonly WeaverDbContext _dbContext;

    public CreateServiceOptionHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OneOf<ServiceOption, Error<Exception>>> Handle(CreateServiceOptionCommand command,
        CancellationToken cancellationToken)
    {
        try
        {
            ServiceOption serviceOption = command.Value.Match<ServiceOption>(
                stringValue => new ServiceOption<string>
                {
                    Type = command.Type,
                    Name = command.Name,
                    Value = stringValue
                },
                doubleValue => new ServiceOption<double>
                {
                    Type = command.Type,
                    Name = command.Name,
                    Value = doubleValue
                },
                boolValue => new ServiceOption<bool>
                {
                    Type = command.Type,
                    Name = command.Name,
                    Value = boolValue
                },
                stringArrayValue => new ServiceOption<string[]>
                {
                    Type = command.Type,
                    Name = command.Name,
                    Value = stringArrayValue
                },
                doubleArrayValue => new ServiceOption<double[]>
                {
                    Type = command.Type,
                    Name = command.Name,
                    Value = doubleArrayValue
                }
            );

            serviceOption = (await _dbContext.ServiceOptions.AddAsync(serviceOption, cancellationToken)).Entity;
            await _dbContext.SaveChangesAsync(cancellationToken);

            return serviceOption;
        }
        catch (NpgsqlException ex)
        {
            return new Error<Exception>(ex);
        }
    }
}