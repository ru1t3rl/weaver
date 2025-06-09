namespace Weaver.Domain.Common;

public abstract class EntityBase
{
    public long Id { get; init; }
    public Guid Uuid { get; init; }
}