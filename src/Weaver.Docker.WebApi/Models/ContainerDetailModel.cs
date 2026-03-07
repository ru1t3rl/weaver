using Docker.DotNet.Models;

namespace Weaver.Docker.WebApi.Models;

public record struct ContainerDetailModel
{
    public required string Id { get; init; }
    public required List<string> Names { get; init; }
    public required string Image { get; init; }
    public required string ImageId { get; init; }
    public required DateTime Created { get; init; }
    public required List<PortSummary> Ports { get; init; }
    public required Status Status { get; init; }
    public required Health Health { get; init; }
    public required HealthSummary HealthSummary { get; init; }
    public required NetworkSettingsSummary NetworkSettingsSummary { get; init; }
    public required List<MountPoint> Mounts { get; init; }
    public required string Log { get; init; }
}