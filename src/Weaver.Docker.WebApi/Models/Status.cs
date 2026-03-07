using System.Text.Json.Serialization;

namespace Weaver.Docker.WebApi.Models;

[JsonConverter( typeof(JsonStringEnumConverter))]
public enum Status
{
    Created = 0,
    Exited = 1,
    Dead = 2,
    Paused = 3,
    Restarting = 4,
    Removing = 5,
    Running = 6,
}