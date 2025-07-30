using Cortex.Mediator.Queries;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Common.ServiceOptions;

namespace Weaver.Commands.ServiceOptions;

public record GetServiceOptionByUuidQuery(
    Guid Uuid
) : IQuery<OneOf<ServiceOption, None>>;