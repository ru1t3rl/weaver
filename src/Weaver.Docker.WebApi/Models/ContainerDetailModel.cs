using Docker.DotNet.Models;

namespace Weaver.Docker.WebApi.Models;

public record struct ContainerDetailModel(
    string Id,
    List<string> Names,
    string Image,
    string ImageId,
    DateTime Created,
    List<PortSummary> Ports,
    string State,
    string Status,
    HealthSummary Health,
    NetworkSettingsSummary NetworkSettingsSummary,
    List<MountPoint> Mounts,
    string Logs
);