using Weaver.Domain.Common.ServiceOptions;

namespace Weaver.Domain.Entities.ServiceOptions;

public class ServiceOptionNumberArray : ServiceOption<double[]>
{
    public override OptionType Type => OptionType.NumberArray;
}