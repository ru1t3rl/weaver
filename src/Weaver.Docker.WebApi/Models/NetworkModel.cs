using Weaver.Extensions;

namespace Weaver.Docker.WebApi.Models;

public record struct NetworkModel
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public required string Ip { get; init; }
    public required string Gateway { get; init; }
    public required string MacAddress { get; init; }
}