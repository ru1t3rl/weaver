using Cortex.Mediator.Queries;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;

namespace Weaver.Commands.ServicesTemplates;

public record GetServiceTemplateByIdQuery(long Id) : IQuery<OneOf<ServiceTemplate, None>>;