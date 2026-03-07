using System.Diagnostics;
using CommunityToolkit.Aspire.Utils;

namespace Weaver.AppHost;

internal static class ResourceBuilderExtensions
{
    public static IResourceBuilder<T> WithApiClientGenerator<T>(
        this IResourceBuilder<T> builder,
        string workingDirectory,
        string command = "bun",
        string arguments = "run generate-clients",
        string displayName = "Generate Clients"
    ) where T : IResource
    {
        workingDirectory = Path.Combine(
            builder.ApplicationBuilder.AppHostDirectory,
            workingDirectory
        ).NormalizePathForCurrentPlatform();

        if (!Directory.Exists(workingDirectory))
        {
            throw new DirectoryNotFoundException(workingDirectory);
        }

        builder.WithCommand(
            name: $"generate-clients-{displayName}",
            displayName: displayName,
            executeCommand: _ => OnRunGenerateClients(
                builder,
                workingDirectory,
                command,
                arguments
            ),
            commandOptions: new CommandOptions()
            {
                IconName = "BuildingFactory",
                IconVariant = IconVariant.Regular
            }
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
            RedirectStandardError = true,
            RedirectStandardOutput = true,
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

        process.ErrorDataReceived += (_, args) =>
        {
            Console.WriteLine(args.Data);
        };

        await process.WaitForExitAsync();

        var y = await process.StandardOutput.ReadToEndAsync();
        Console.WriteLine(y);
        
        var x = await process.StandardError.ReadToEndAsync();
        Console.WriteLine(x);
        
        return new ExecuteCommandResult
        {
            Success = process.ExitCode == 0
        };
    }
}