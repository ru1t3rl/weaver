using Cortex.Mediator.Queries;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;

namespace Weaver.Commands.ServiceOptions;

public record GetServiceOptionByUuidQuery(Guid Uuid) : IQuery<OneOf<ServiceOption, None>>;