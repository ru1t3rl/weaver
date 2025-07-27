using Cortex.Mediator.Queries;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Commands.ServiceOptions;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.ServiceTemplateOptions;

public class GetServiceTemplateOptionByUuidHandler : IQueryHandler<GetServiceTemplateOptionByUuidQuery, OneOf<ServiceTemplateOption, None>>
{
    private readonly WeaverDbContext _dbContext;

    public GetServiceTemplateOptionByUuidHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OneOf<ServiceTemplateOption, None>> Handle(GetServiceTemplateOptionByUuidQuery query, CancellationToken cancellationToken)
    {
        ServiceTemplateOption? option = await _dbContext.ServiceTemplateOptions
            .AsNoTracking()
            .SingleOrDefaultAsync(s => s.Uuid == query.Uuid, cancellationToken);
        
        return option is not null ? option : new None();
    }
}