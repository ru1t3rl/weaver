using Cortex.Mediator.Queries;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.ServiceOptions;

public class GetServiceOptionByUuidHandler : IQueryHandler<GetServiceOptionByUuidQuery, OneOf<ServiceTemplateOption, None>>
{
    private readonly WeaverDbContext _dbContext;

    public GetServiceOptionByUuidHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OneOf<ServiceTemplateOption, None>> Handle(GetServiceOptionByUuidQuery query, CancellationToken cancellationToken)
    {
        ServiceTemplateOption? option = await _dbContext.ServiceOptions
            .AsNoTracking()
            .SingleOrDefaultAsync(s => s.Uuid == query.Uuid, cancellationToken);
        
        return option is not null ? option : new None();
    }
}