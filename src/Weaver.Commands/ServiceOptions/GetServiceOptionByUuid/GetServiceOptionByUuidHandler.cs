using Cortex.Mediator.Queries;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Common.ServiceOptions;
using Weaver.Infrastructure;

namespace Weaver.Commands.ServiceOptions;

public class GetServiceOptionByUuidHandler : IQueryHandler<GetServiceOptionByUuidQuery, OneOf<ServiceOption, None>>
{
    private readonly WeaverDbContext _dbContext;

    public GetServiceOptionByUuidHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OneOf<ServiceOption, None>> Handle(GetServiceOptionByUuidQuery query,
        CancellationToken cancellationToken)
    {
        ServiceOption? serviceOption = await _dbContext.ServiceOptions
            .AsNoTracking()
            .SingleOrDefaultAsync(s => s.Uuid == query.Uuid, cancellationToken);

        return serviceOption is not null ? serviceOption : new None();
    }
}