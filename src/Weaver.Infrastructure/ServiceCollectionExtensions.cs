using Microsoft.Extensions.Hosting;

namespace Weaver.Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IHostApplicationBuilder AddDatabase(this IHostApplicationBuilder builder)
    {
        builder.AddNpgsqlDbContext<WeaverDbContext>(connectionName: "Weaver");
        return builder;
    }
}