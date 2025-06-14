using Cortex.Mediator.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Weaver.Commands;

public static class ServiceCollectionExtensions
{
    public static IHostApplicationBuilder AddCommands(this IHostApplicationBuilder builder)
    {
        builder.Services.AddCortexMediator(
            builder.Configuration,
            [typeof(Weaver.Commands.NamespaceAnchor)]
            // options => options.AddDefaultBehaviors()
        );

        return builder;
    }
}