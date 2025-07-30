using Weaver.Domain.Entities;
using OneOf;

namespace Weaver.Commands.ServiceOptions;

public record UpdateServiceOptionModel(
    Guid Uuid,
    OptionType Type,
    string Name,
    OneOf<string, double, bool, string[], double[]> Value
);