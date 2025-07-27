using Weaver.Domain.Entities;

namespace Weaver.WebApi.Models;

public record struct ServiceOptionModel(
    string Name,
    OptionType Type,
    Object Value,
    Guid? Id = null
);