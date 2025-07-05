using System.Diagnostics;

namespace Weaver.AppHost;

internal static class MigratorExtensions
{
    public static IResourceBuilder<ProjectResource> WithMigrator<TMigrator>(
        this IResourceBuilder<ProjectResource> builder,
        IResourceBuilder<PostgresDatabaseResource> database,
        string? arguments = null,
        string displayName = "Run Migrator")
        where TMigrator : IProjectMetadata, new()
    {
        var project = new TMigrator();
        var migratorPath = project.ProjectPath;
        
        builder.WithCommand(
            name: "run-migrator",
            displayName: displayName,
            executeCommand: _ => OnRunMigrator(migratorPath, database, arguments),
            commandOptions: new CommandOptions
            {
                IconName = "TaskListSquareDatabase",
                IconVariant = IconVariant.Regular
            }
        );

        return builder;
    }

    
    private static async Task<ExecuteCommandResult> OnRunMigrator(string projectPath, IResourceBuilder<PostgresDatabaseResource> database, string? arguments)
    {
        if (string.IsNullOrEmpty(projectPath))
        {
            return new ExecuteCommandResult
            {
                Success = false,
                ErrorMessage = "Invalid migrator project path"
            };
        }

        var connectionString = await database.Resource.ConnectionStringExpression.GetValueAsync(CancellationToken.None);
        var databaseName = database.Resource.DatabaseName;
        
        var process = Process.Start(new ProcessStartInfo
        {
            FileName = "dotnet",
            Arguments = $"run --project \"{projectPath}\" {arguments}".TrimEnd(),
            UseShellExecute = false,
            RedirectStandardError = true,
            RedirectStandardOutput = true,
            CreateNoWindow = true,
            Environment = {
                [$"ConnectionStrings__{databaseName}"] = connectionString
            }
        });
    
        if (process is null)
        {
            return new ExecuteCommandResult
            {
                Success = false,
                ErrorMessage = "Failed to start migrator process"
            };
        }

        process.ErrorDataReceived += (_, args) =>
        {
            if (!string.IsNullOrEmpty(args.Data))
                Console.WriteLine(args.Data);
        };

        process.OutputDataReceived += (_, args) =>
        {
            if (!string.IsNullOrEmpty(args.Data))
                Console.WriteLine(args.Data);
        };

        process.BeginOutputReadLine();
        process.BeginErrorReadLine();

        await process.WaitForExitAsync();

        return new ExecuteCommandResult
        {
            Success = process.ExitCode == 0,
            ErrorMessage = process.ExitCode != 0 ? $"Migrator failed with exit code: {process.ExitCode}" : null
        };
    }
}