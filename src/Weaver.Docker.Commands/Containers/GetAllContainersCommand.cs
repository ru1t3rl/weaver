using Cortex.Mediator.Commands;
using Docker.DotNet.Models;

namespace Weaver.Docker.Commands.Containers;

public record GetAllContainersCommand() :
    ICommand<ContainerListResponse[]>;