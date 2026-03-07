using Cortex.Mediator.Commands;
using Docker.DotNet.Models;

namespace Weaver.Docker.Commands.Compose;

public record GetAllStacksCommand(
) : ICommand<List<IGrouping<string, ContainerListResponse>>>;