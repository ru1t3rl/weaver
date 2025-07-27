namespace Weaver.Domain.Common.ServiceOptions;

public class ServiceOption<T> : ServiceOption
{
    public required T Value { get; set; }
}