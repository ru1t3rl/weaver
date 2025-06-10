using System.Diagnostics;

internal static class RedisResourceBuilderExtensions
{
    public static IResourceBuilder<T> WithClientGenerator<T>(
        this IResourceBuilder<T> builder,
        string workingDirectory,
        string command = "bun",
        string arguments = "run scripts/generate-clients.ts",
        string displayName = "Generate Clients"
    ) where T : IResource
    {
        builder.WithCommand(
            name: "generate-clients",
            displayName: displayName,
            executeCommand: context => OnRunGenerateClients(
                builder,
                workingDirectory,
                command,
                arguments
            )
        );
        return builder;
    }

    private static async Task<ExecuteCommandResult> OnRunGenerateClients<T>(
        IResourceBuilder<T> builder,
        string workingDirectory,
        string command,
        string arguments
    ) where T : IResource
    {
        var process = Process.Start(new ProcessStartInfo
        {
            FileName = command,
            Arguments = arguments,
            WorkingDirectory = workingDirectory,
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            CreateNoWindow = true
        });

        if (process is null)
        {
            return new ExecuteCommandResult
            {
                Success = false,
                ErrorMessage = "Process is null, result unknown!"
            };
        }

        await process.WaitForExitAsync();

        return new ExecuteCommandResult
        {
            Success = process.ExitCode == 0
        };
    }
}