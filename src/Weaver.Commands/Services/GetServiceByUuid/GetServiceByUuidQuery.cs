using Cortex.Mediator.Queries;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;

namespace Weaver.Commands.Services;

public record GetServiceByUuidQuery(Guid Uuid) : IQuery<OneOf<Service, None>>;