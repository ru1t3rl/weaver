using Cortex.Mediator.Queries;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;

namespace Weaver.Commands.ServiceTemplateOptions;

public record GetServiceTemplateOptionByUuidQuery(Guid Uuid) : IQuery<OneOf<ServiceTemplateOption, None>>;