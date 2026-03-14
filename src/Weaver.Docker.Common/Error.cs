namespace Weaver.Docker.Common;

public record struct Error
{
    public ErrorType Type { get; init; }
    public string[] Messages { get; init; } = [];
    
    public Error(ErrorType type)
    {
        Type = type;
    }
    
    public Error(ErrorType type, string[] messages)
    {
        Type = type;
        Messages = messages;
    }

}

public enum ErrorType 
{
    Validation,
    NotFound,
    Database,
    Conflict,
    DockerApi,
    Canceled
}