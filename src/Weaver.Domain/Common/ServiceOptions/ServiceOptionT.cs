namespace Weaver.Domain.Common.ServiceOptions;

public abstract class ServiceOption<T> : ServiceOption
{
    public required T Value { get; set; }
}