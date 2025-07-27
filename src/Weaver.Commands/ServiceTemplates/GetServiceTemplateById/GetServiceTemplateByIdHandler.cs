using Cortex.Mediator.Queries;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.ServicesTemplates;

public class GetServiceTemplateByIdHandler : IQueryHandler<GetServiceTemplateByIdQuery, OneOf<ServiceTemplate, None>>
{
    private readonly WeaverDbContext _dbContext;

    public GetServiceTemplateByIdHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OneOf<ServiceTemplate, None>> Handle(GetServiceTemplateByIdQuery query, CancellationToken cancellationToken)
    {
        ServiceTemplate? service = await _dbContext.ServicesTemplates
            .Include(s => s.Config)
            .FirstOrDefaultAsync(s => s.Id == query.Id, cancellationToken);
        
        return service is not null ? service : new None();
    }
}