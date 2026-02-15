namespace Weaver.Docker.WebApi.Models;

public record struct PortMapping(
    ushort? HostPort,
    ushort ContainerPort
);