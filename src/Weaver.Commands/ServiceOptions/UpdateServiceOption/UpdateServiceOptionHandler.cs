using Cortex.Mediator.Commands;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Commands.Services;
using Weaver.Common.Exceptions;
using Weaver.Domain.Common.ServiceOptions;
using Weaver.Domain.Entities;
using Weaver.Domain.Entities.ServiceOptions;
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
            .SingleOrDefaultAsync(s => s.Uuid == command.Uuid);

        if (serviceOption is null)
        {
            return new Error<Exception>(new EntityNotFoundException());
        }

        serviceOption.Name = command.Name;
        switch (serviceOption.Type)
        {
            case OptionType.String:
                (serviceOption as ServiceOptionString).Value = command.StringValue!;
                break;
            case OptionType.Number:
                (serviceOption as ServiceOptionNumber).Value = command.NumberValue!.Value;
                break;
            case OptionType.Boolean:
                (serviceOption as ServiceOptionBoolean).Value = command.BooleanValue!.Value;
                break;
            case OptionType.StringArray:
                (serviceOption as ServiceOptionStringArray).Value = command.StringArrayValue!;
                break;
            case OptionType.NumberArray:
                (serviceOption as ServiceOptionNumberArray).Value = command.NumberArrayValue!;
                break;
            default:
                return new Error<Exception>(new NotImplementedException());
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return serviceOption;
    }
}