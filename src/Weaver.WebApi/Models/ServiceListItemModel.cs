namespace Weaver.WebApi.Models;

public record struct ServiceListItemModel(
    Guid Id,
    string Name,
    Guid TemplateId
);