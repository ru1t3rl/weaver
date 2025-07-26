using Weaver.Domain.Common.ServiceOptions;

namespace Weaver.Domain.Entities.ServiceOptions;

public class ServiceOptionStringArray : ServiceOption<string[]>
{
    public override OptionType Type => OptionType.StringArray;
}