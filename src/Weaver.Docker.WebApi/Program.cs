using Docker.DotNet;
using Scalar.AspNetCore;
using Weaver.Docker.WebApi.Options;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddProblemDetails();

builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.AddCommands();

builder.Services.AddSingleton<IDockerClient>(_ =>
    {
        var dockerOptions = builder
            .Configuration
            .GetSection(DockerEngineOptions.DockerEngine)
            .Get<DockerEngineOptions>();

        if (dockerOptions is null)
        {
            throw new InvalidOperationException("Can't start the docker web api without configuration");
        }

        var uri = new Uri(dockerOptions.Host);
        return new DockerClientConfiguration(uri).CreateClient();
    }
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/docs");
}

app.UseCors(options =>
    options
        .SetIsOriginAllowed(_ => true)
        .AllowAnyHeader()
        .AllowAnyMethod()
);

app.MapControllers();
app.MapDefaultEndpoints();

app.Run();