using Cortex.Mediator;
using Docker.DotNet;
using Docker.DotNet.Models;
using Microsoft.AspNetCore.Mvc;
using OneOf;
using OneOf.Types;
using Weaver.Docker.Commands.Containers;
using Weaver.Docker.Common;
using Weaver.Docker.WebApi.Models;
using Weaver.Extensions;
using Error = Weaver.Docker.Common.Error;
using Health = Weaver.Docker.WebApi.Models.Health;
using Status = Weaver.Docker.WebApi.Models.Status;

namespace Weaver.Docker.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ContainerController : ControllerBase
{
    private readonly IDockerClient _dockerClient;
    private readonly IMediator _mediator;

    public ContainerController(IDockerClient dockerClient, IMediator mediator)
    {
        _dockerClient = dockerClient;
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType<List<ContainerListItemModel>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Get(
        CancellationToken cancellationToken
    )
    {
        try
        {
            IList<ContainerListResponse> containers = await _dockerClient.Containers.ListContainersAsync(
                new ContainersListParameters() { All = true },
                cancellationToken
            ) ?? [];

            IList<ContainerInspectResponse> containersDetails = await Task.WhenAll(
                containers.Select(c => _dockerClient.Containers.InspectContainerAsync(
                        c.ID,
                        new ContainerInspectParameters(),
                        cancellationToken
                    )
                )
            );

            List<ContainerListItemModel> models = containers
                .Join(
                    containersDetails,
                    c => c.ID,
                    c => c.ID,
                    (basic, inspect) => (basic, inspect)
                )
                .Select(c => new ContainerListItemModel()
                    {
                        Id = c.basic.ID,
                        Name = c.inspect.Name,
                        Image = c.inspect.Config.Image,
                        Status = c.basic.State.ToEnum<Status>(),
                        Created = c.basic.Created,
                        Health = c.basic.Health.Status.ToEnum<Health>(),
                        DependsOn = c.basic.GetDependsOn(containersDetails.ToList()),
                        ComposeName = c.inspect.Path,
                        Networks = c.basic.GetNetworks()
                    }
                )
                .ToList();

            return Ok(models);
        }
        catch (Exception ex) when (ex is TaskCanceledException or OperationCanceledException)
        {
            return StatusCode(StatusCodes.Status499ClientClosedRequest, "Request canceled");
        }
    }

    [HttpGet("{identifier}")]
    [ProducesResponseType<ContainerDetailModel>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(string identifier, CancellationToken cancellationToken)
    {
        GetContainerDetailsCommand command = new(identifier.AsSha256());
        OneOf<ContainerDetail, Error> response = await _mediator.SendAsync(command, cancellationToken);

        if (response.IsT1 && response.AsT1 is var error)
        {
            return error.Type switch
            {
                ErrorType.NotFound => NotFound(),
                _ => BadRequest(error.Messages)
            };
        }

        ContainerDetail details = response.AsT0;
        ContainerDetailModel model = new()
        {
            Id = details.InspectResponse.ID,
            Names = [details.InspectResponse.Name, ..details.ListResponse.Names ?? []],
            Image = details.InspectResponse.Image,
            ImageId = details.ListResponse.ImageID,
            Created = details.ListResponse.Created,
            Ports = details.ListResponse.Ports.DistinctBy(p => p.PublicPort).ToList(),
            Status = details.ListResponse.State.ToEnum<Status>(),
            Health = details.ListResponse.Health.Status.ToEnum<Health>(),
            HealthSummary = details.ListResponse.Health,
            NetworkSettingsSummary = details.ListResponse.NetworkSettings,
            Mounts = details.ListResponse.Mounts.ToList(),
            EnvironmentVariables = details
                .InspectResponse
                .Config.Env.Select(e =>
                    {
                        var splitValue = e.Split('=');
                        return new EnvironmentVariable(splitValue[0], splitValue[1]);
                    }
                )
                .ToList(),
            Log = details.OutputLogs
        };

        return Ok(model);
    }

    [HttpPut]
    [ProducesResponseType<string>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create(CreateContainerParameters parameters, CancellationToken cancellationToken)
    {
        await _dockerClient.Images.CreateImageAsync(
            new ImagesCreateParameters
            {
                FromImage = parameters.Image
            },
            new AuthConfig(),
            new Progress<JSONMessage>(),
            cancellationToken
        );

        CreateContainerResponse createContainerResponse = await _dockerClient.Containers.CreateContainerAsync(
            parameters,
            cancellationToken
        );

        await _dockerClient.Containers.StartContainerAsync(
            createContainerResponse.ID,
            new ContainerStartParameters(),
            cancellationToken
        );

        return Ok(createContainerResponse.ID);
    }

    [HttpDelete("{identifier}")]
    public async Task<IActionResult> Delete(string identifier, CancellationToken cancellationToken)
    {
        await _dockerClient.Containers.StopContainerAsync(
            identifier,
            new ContainerStopParameters(),
            cancellationToken
        );

        await _dockerClient.Containers.RemoveContainerAsync(
            identifier,
            new ContainerRemoveParameters(),
            cancellationToken
        );

        return Ok();
    }

    [HttpPut("{identifier}/start")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType<string>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Start(string identifier, CancellationToken cancellationToken)
    {
        StartContainerCommand command = new(identifier.ComputeSha256());
        OneOf<Success, Error> result = await _mediator.SendAsync(command, cancellationToken);

        return result.Match<IActionResult>(
            _ => Ok(),
            error => BadRequest(error.Messages)
        );
    }

    [HttpPut("{identifier}/stop")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType<string>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Stop(string identifier, CancellationToken cancellationToken)
    {
        StopContainerCommand command = new(identifier.ComputeSha256());
        OneOf<Success, Error> result = await _mediator.SendAsync(command, cancellationToken);

        return result.Match<IActionResult>(
            _ => Ok(),
            error => BadRequest(error.Messages)
        );
    }
}