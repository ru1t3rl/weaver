using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Weaver.Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IHostApplicationBuilder AddDatabase(this IHostApplicationBuilder builder)
    {
        // builder.AddNpgsqlDbContext<WeaverDbContext>(connectionName: "Weaver");
        builder.Services.AddDbContext<WeaverDbContext>(
            options => { options.UseNpgsql(builder.Configuration.GetConnectionString("weaver-db")); },
            ServiceLifetime.Transient
        );
        return builder;
    }
}