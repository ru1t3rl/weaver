using Weaver.AppHost;

var builder = DistributedApplication.CreateBuilder(args);
builder.AddDockerComposeEnvironment("compose");

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
    .WithMigrator<Projects.Weaver_Migrator>(database);

builder.AddBunApp("webapp", "../Weaver.WebApp", "dev", true)
    .WithApiClientGenerator("../Weaver.WebApp/packages/shared/")
    .WithBunPackageInstallation()
    .WithExternalHttpEndpoints()
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiService)
    .WaitFor(apiService)
    .WithHttpEndpoint(4200, env: "PORT");

builder.Build().Run();
