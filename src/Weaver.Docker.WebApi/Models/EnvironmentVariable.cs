namespace Weaver.Docker.WebApi.Models;

public record struct EnvironmentVariable(
    string Name,
    string Value
);