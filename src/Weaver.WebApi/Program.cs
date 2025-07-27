using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using Scalar.AspNetCore;
using Weaver.Commands;
using Weaver.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddProblemDetails();

builder
    .AddDatabase()
    .AddCommands();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(options =>
{
    options.AddSchemaTransformer(async (schema, context, ct) =>
    {
        if (context.JsonPropertyInfo is not null && context.JsonPropertyInfo.PropertyType.IsEnum)
        {
            schema.Type = "string";
            schema.Enum = context
                .JsonPropertyInfo.PropertyType
                .GetEnumNames()
                .Select(n => new OpenApiString(n))
                .ToList<IOpenApiAny>();
            schema.Format = null;
        }
    });
});

builder.Services
    .AddControllers()
    .AddJsonOptions(opts => { opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); });

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/");
}

app.MapDefaultEndpoints();
app.MapControllers();

app.UseCors(options =>
    options
        .SetIsOriginAllowed(_ => true)
        .AllowAnyHeader()
        .AllowAnyMethod()
);

app.Run();