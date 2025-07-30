using Cortex.Mediator.Queries;
using OneOf;
using OneOf.Types;
using Weaver.Domain.Entities;

namespace Weaver.Commands.ServiceTemplateOptions;

public record GetServiceTemplateOptionByIdQuery(long Id) : IQuery<OneOf<ServiceTemplateOption, None>>;