using Cortex.Mediator.DependencyInjection;
using Microsoft.Extensions.Hosting;

public static class ServiceCollectionExtensions
{
    public static IHostApplicationBuilder AddCommands(this IHostApplicationBuilder builder)
    {
        builder.Services.AddCortexMediator(
            [typeof(Weaver.Docker.Commands.NamespaceAnchor)]
        );

        return builder;
    }
}