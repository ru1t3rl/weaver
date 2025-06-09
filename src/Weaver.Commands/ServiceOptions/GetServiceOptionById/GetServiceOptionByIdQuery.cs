using Cortex.Mediator.Queries;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;

namespace Weaver.Commands.ServiceOptions;

public record GetServiceOptionByIdQuery(long Id) : IQuery<OneOf<ServiceOption, None>>;