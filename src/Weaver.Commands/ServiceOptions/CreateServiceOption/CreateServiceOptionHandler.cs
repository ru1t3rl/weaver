using Cortex.Mediator.Commands;
using Npgsql;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Common.ServiceOptions;
using Weaver.Domain.Entities;
using Weaver.Domain.Entities.ServiceOptions;
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
            ServiceOption serviceOption = command.Type switch
            {
                OptionType.String => new ServiceOptionString
                {
                    Name = command.Name,
                    Value = command.StringValue!
                },
                OptionType.Number => new ServiceOptionNumber
                {
                    Name = command.Name,
                    Value = command.NumberValue!.Value
                },
                OptionType.Boolean => new ServiceOptionBoolean
                {
                    Name = command.Name,
                    Value = command.BooleanValue!.Value
                },
                OptionType.StringArray => new ServiceOptionStringArray
                {
                    Name = command.Name,
                    Value = command.StringArrayValue!
                },
                OptionType.NumberArray => new ServiceOptionNumberArray
                {
                    Name = command.Name,
                    Value = command.NumberArrayValue!
                }
            };

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