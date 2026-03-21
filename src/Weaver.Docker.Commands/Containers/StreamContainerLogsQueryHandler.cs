using System.Runtime.CompilerServices;
using System.Text;
using Cortex.Mediator.Queries;
using Docker.DotNet;
using Docker.DotNet.Models;
using ReadResult = Docker.DotNet.MultiplexedStream.ReadResult;

namespace Weaver.Docker.Commands.Containers;

public class StreamContainerLogsQueryHandler : IQueryHandler<StreamContainerLogsQuery, IAsyncEnumerable<string>>
{
    private readonly IDockerClient _dockerClient;

    public StreamContainerLogsQueryHandler(IDockerClient dockerClient)
    {
        _dockerClient = dockerClient;
    }

    public Task<IAsyncEnumerable<string>> Handle(
        StreamContainerLogsQuery request,
        CancellationToken ct
    )
    {
        return Task.FromResult(StreamLogs(request, ct));
    }

    private async IAsyncEnumerable<string> StreamLogs(
        StreamContainerLogsQuery request,
        [EnumeratorCancellation] CancellationToken ct
    )
    {
        var buffer = new byte[4096];

        MultiplexedStream? logStream;

        try
        {
            logStream = await _dockerClient.Containers.GetContainerLogsAsync(
                request.ContainerId,
                new ContainerLogsParameters
                {
                    Follow = request.Follow,
                    ShowStdout = true,
                    ShowStderr = true,
                    Timestamps = request.Timestamps,
                    Tail = request.Tail,
                },
                ct
            );
        }
        catch (Exception ex) when (ex is TaskCanceledException or OperationCanceledException &&
                                   ct.IsCancellationRequested)
        {
            yield break;
        }

        using (logStream)
        {
            while (!ct.IsCancellationRequested)
            {
                ReadResult? result;
                try
                {
                    result = await logStream.ReadOutputAsync(buffer, 0, buffer.Length, ct);
                }
                catch (Exception ex) when (ex is TaskCanceledException or OperationCanceledException &&
                                           ct.IsCancellationRequested)
                {
                    yield break;
                }

                if (result is not null && result.Value.EOF)
                    break;

                if (result is not null && result.Value.Count > 0)
                    yield return Encoding.UTF8.GetString(buffer, 0, result.Value.Count);
            }
        }
    }
}