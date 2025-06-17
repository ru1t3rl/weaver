using Cortex.Mediator.Commands;
using Cortex.Mediator.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Weaver.Commands;

public static class ServiceCollectionExtensions
{
    public static IHostApplicationBuilder AddCommands(this IHostApplicationBuilder builder)
    {
        builder.Services.AddCortexMediator(
            builder.Configuration,
            [typeof(Weaver.Commands.NamespaceAnchor)]
        );
        
        return builder;
    }
}