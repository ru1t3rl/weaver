using System.Text.Json.Serialization;

namespace Weaver.Docker.WebApi.Models;

[JsonConverter( typeof(JsonStringEnumConverter))]
public enum Health
{
    None = 0,
    Unhealthy = 1,
    Starting = 2,
    Healthy = 3,
}