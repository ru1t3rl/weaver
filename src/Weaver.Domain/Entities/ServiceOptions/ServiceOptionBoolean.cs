using Weaver.Domain.Common.ServiceOptions;

namespace Weaver.Domain.Entities.ServiceOptions;

public class ServiceOptionBoolean : ServiceOption<bool>
{
    public override OptionType Type => OptionType.Boolean;
}