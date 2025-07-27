namespace Weaver.WebApi.Models;

public record struct ServiceDetailModel(
    Guid Id,
    string Name,
    Guid TemplateId,
    List<ServiceOptionModel> Options
);