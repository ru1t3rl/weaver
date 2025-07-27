using Cortex.Mediator.Queries;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.Services;

public class GetServiceByUuidHandler : IQueryHandler<GetServiceByUuidQuery, OneOf<Service, None>>
{
    private readonly WeaverDbContext _dbContext;

    public GetServiceByUuidHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OneOf<Service, None>> Handle(GetServiceByUuidQuery query, CancellationToken cancellationToken)
    {
        Service? service = await _dbContext.Services
            .Include(s => s.Template)
            .Include(s => s.Options)
            .AsNoTracking()
            .SingleOrDefaultAsync(s => s.Uuid == query.Uuid, cancellationToken);

        return service is not null ? service : new None();
    }
}