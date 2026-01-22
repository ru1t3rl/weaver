using Weaver.AppHost;

var builder = DistributedApplication.CreateBuilder(args);
var composeEnv = builder.AddDockerComposeEnvironment("compose");

var cache = builder.AddRedis("cache");

var postgres = builder
    .AddPostgres("postgres")
    .WithDbGate()
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent)
    .WithHostPort(5432);

var database = postgres
    .AddDatabase("Weaver");

var apiService = builder
    .AddProject<Projects.Weaver_WebApi>("webapi")
    .WithHttpHealthCheck("/health")
    .WithReference(database)
    .WithMigrator<Projects.Weaver_Migrator>(database);

var dockerApiService = builder
    .AddProject<Projects.Weaver_Docker_WebApi>("docker-webapi")
    .WithHttpHealthCheck("/health")
    .WithUrlForEndpoint("http", url =>
    {
        url.Url = "/docs";
    });

builder
    .AddBunApp("webapp", "../Weaver.WebApp", "dev", true)
    .WithApiClientGenerator("../Weaver.WebApp/packages/shared/", displayName: "Generate WebApi Client")
    .WithApiClientGenerator("../Weaver.WebApp/packages/docker/", displayName: "Generate Docker Api Client")
    .WithBunPackageInstallation()
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiService)
    .WaitFor(apiService)
    .WithReference(dockerApiService)
    .WaitFor(dockerApiService)
    .PublishAsDockerFile()
    .WithHttpEndpoint(4200, env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();