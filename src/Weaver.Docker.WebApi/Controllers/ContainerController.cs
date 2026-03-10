using Docker.DotNet;
using Docker.DotNet.Models;
using Microsoft.AspNetCore.Mvc;
using Weaver.Docker.WebApi.Models;
using Weaver.Extensions;
using Health = Weaver.Docker.WebApi.Models.Health;
using Status = Weaver.Docker.WebApi.Models.Status;

namespace Weaver.Docker.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ContainerController : ControllerBase
{
    private readonly IDockerClient _dockerClient;

    public ContainerController(IDockerClient dockerClient)
    {
        _dockerClient = dockerClient;
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
        Task<MultiplexedStream> logsTask = _dockerClient.Containers.GetContainerLogsAsync(
            identifier,
            new ContainerLogsParameters()
            {
                Follow = false,
                ShowStderr = true,
                ShowStdout = true,
                Timestamps = true
            },
            cancellationToken
        );

        IList<ContainerListResponse> containers = await _dockerClient.Containers.ListContainersAsync(
            new ContainersListParameters() { All = true },
            cancellationToken
        );

        ContainerListResponse? response = containers.SingleOrDefault(c => c.ID.Contains(identifier));

        if (response is null)
        {
            return NotFound();
        }

        (string stdout, string stderr) = await (await logsTask).ReadOutputToEndAsync(cancellationToken);

        ContainerDetailModel model = new()
        {
            Id = response.ID,
            Names = response.Names.ToList(),
            Image = response.Image,
            ImageId = response.ImageID,
            Created = response.Created,
            Ports = response.Ports.ToList(),
            Status = response.State.ToEnum<Status>(),
            Health = response.Health.Status.ToEnum<Health>(),
            HealthSummary = response.Health,
            NetworkSettingsSummary = response.NetworkSettings,
            Mounts = response.Mounts.ToList(),
            Log = stdout
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
        try
        {
            await _dockerClient.Containers.StartContainerAsync(
                identifier,
                new ContainerStartParameters(),
                cancellationToken
            );
        }
        catch (DockerApiException ex)
        {
            return BadRequest(ex.Message);
        }

        return Ok();
    }

    [HttpPut("{identifier}/stop")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType<string>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Stop(string identifier, CancellationToken cancellationToken)
    {
        try
        {
            await _dockerClient.Containers.StopContainerAsync(
                identifier,
                new ContainerStopParameters(),
                cancellationToken
            );
        }
        catch (DockerApiException ex)
        {
            return BadRequest(ex.Message);
        }

        return Ok();
    }
}