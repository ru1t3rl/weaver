using Cortex.Mediator.Queries;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.ServicesTemplates;

public class GetServiceTemplateByUuidHandler : IQueryHandler<GetServiceTemplateByUuidQuery, OneOf<ServiceTemplate, None>>
{
    private readonly WeaverDbContext _dbContext;

    public GetServiceTemplateByUuidHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OneOf<ServiceTemplate, None>> Handle(GetServiceTemplateByUuidQuery query, CancellationToken cancellationToken)
    {
        ServiceTemplate? service = await _dbContext.ServicesTemplates
            .Include(s => s.Config)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Uuid == query.Uuid, cancellationToken);
        
        return service is not null ? service : new None();
    }
}