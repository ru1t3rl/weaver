using Cortex.Mediator.Queries;

namespace Weaver.Docker.Commands.Containers;

public record StreamContainerLogsQuery(
    string ContainerId,
    bool Follow = true,
    bool Timestamps = true,
    string? Tail = "100"
) : IQuery<IAsyncEnumerable<string>>;