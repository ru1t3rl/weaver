var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");

var postgres = builder.AddPostgres("postgres")
    .WithDbGate()
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent)
    .WithHostPort(5432);

var database = postgres
    .AddDatabase("Weaver");

var apiService = builder.AddProject<Projects.Weaver_WebApi>("webapi")
    .WithHttpHealthCheck("/health")
    .WithReference(database)
    .WithClientGenerator("../Weaver.WebApp/packages/shared");

builder.AddBunApp("webapp", "../Weaver.WebApp", "dev", true)
    .WithExternalHttpEndpoints()
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiService)
    .WaitFor(apiService)
    .WithHttpEndpoint(4200, env: "PORT");

builder.Build().Run();
