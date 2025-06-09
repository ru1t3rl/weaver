using Cortex.Mediator.Queries;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;

namespace Weaver.Commands.Services;

public record GetServiceByIdQuery(long Id) : IQuery<OneOf<Service, None>>;