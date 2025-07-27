using Cortex.Mediator.Queries;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;

namespace Weaver.Commands.ServicesTemplates;

public record GetServiceTemplateByUuidQuery(Guid Uuid) : IQuery<OneOf<ServiceTemplate, None>>;