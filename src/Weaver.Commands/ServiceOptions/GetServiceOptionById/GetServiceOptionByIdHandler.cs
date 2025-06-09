using Cortex.Mediator.Queries;
using Microsoft.EntityFrameworkCore;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;
using Weaver.Infrastructure;

namespace Weaver.Commands.ServiceOptions;

public class GetServiceOptionByIdHandler : IQueryHandler<GetServiceOptionByIdQuery, OneOf<ServiceOption, None>>
{
    private readonly WeaverDbContext _dbContext;

    public GetServiceOptionByIdHandler(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OneOf<ServiceOption, None>> Handle(GetServiceOptionByIdQuery query, CancellationToken cancellationToken)
    {
        ServiceOption? option = await _dbContext.ServiceOptions
            .SingleOrDefaultAsync(s => s.Id == query.Id, cancellationToken);
        
        return option is not null ? option : new None();
    }
}