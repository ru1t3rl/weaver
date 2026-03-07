namespace Weaver.Docker.Common;

public class ContainerLabels
{
    public const string DOCKER_COMPOSE_LABEL = "com.docker.compose";
    public const string DOCKER_COMPOSE_PROJECT_LABEL = $"{DOCKER_COMPOSE_LABEL}.project";
    public const string DOCKER_COMPOSE_CONFIG_HASH = $"{DOCKER_COMPOSE_LABEL}.config-hash";
    public const string DOCKER_COMPOSE_DEPENDS_ON = $"{DOCKER_COMPOSE_LABEL}.depends_on";
}