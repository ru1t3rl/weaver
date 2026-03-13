namespace Weaver.Docker.Common;

public record struct Error(ErrorType Type, string[] Messages);

public enum ErrorType 
{
    Validation,
    NotFound,
    Database,
    Conflict,
    DockerApi,
    Canceled
}