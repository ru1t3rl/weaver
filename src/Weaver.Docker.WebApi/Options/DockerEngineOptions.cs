namespace Weaver.Docker.WebApi.Options;

public class DockerEngineOptions
{
    public const string DockerEngine = "DockerEngine";
    
    public required string Host { get; set; }
}