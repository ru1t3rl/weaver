using Weaver.Domain.Common.ServiceOptions;

namespace Weaver.Domain.Entities.ServiceOptions;

public class ServiceOptionNumber : ServiceOption<double>
{
    public override OptionType Type => OptionType.Number;
}