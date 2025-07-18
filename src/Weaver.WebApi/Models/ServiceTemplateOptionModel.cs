using Weaver.Domain.Entities;

namespace Weaver.WebApi.Models;

public record ServiceTemplateOptionModel
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required OptionType Type { get; init; }
}