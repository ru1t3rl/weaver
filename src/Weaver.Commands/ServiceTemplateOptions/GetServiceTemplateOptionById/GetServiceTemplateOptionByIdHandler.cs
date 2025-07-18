using Cortex.Mediator.Queries;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.ServiceOptions;

public class GetServiceTemplateOptionByIdHandler : IQueryHandler<GetServiceTemplateOptionByIdQuery, OneOf<ServiceTemplateOption, None>>
{
    private readonly WeaverDbContext _dbContext;

    public GetServiceTemplateOptionByIdHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OneOf<ServiceTemplateOption, None>> Handle(GetServiceTemplateOptionByIdQuery query, CancellationToken cancellationToken)
    {
        ServiceTemplateOption? option = await _dbContext.ServiceOptions
            .SingleOrDefaultAsync(s => s.Id == query.Id, cancellationToken);
        
        return option is not null ? option : new None();
    }
}