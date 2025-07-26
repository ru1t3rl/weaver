using Weaver.Domain.Common.ServiceOptions;

namespace Weaver.Domain.Entities.ServiceOptions;

public sealed class ServiceOptionString : ServiceOption<string>
{
    public override OptionType Type => OptionType.String;
}