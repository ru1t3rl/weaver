using Cortex.Mediator.Queries;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.Services;

public class GetServiceByIdHandler : IQueryHandler<GetServiceByIdQuery, OneOf<Service, None>>
{
    private readonly WeaverDbContext _dbContext;

    public GetServiceByIdHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OneOf<Service, None>> Handle(GetServiceByIdQuery query, CancellationToken cancellationToken)
    {
        Service? service = await _dbContext.Services
            .Include(s => s.Config)
            .FirstOrDefaultAsync(s => s.Id == query.Id, cancellationToken);
        
        return service is not null ? service : new None();
    }
}