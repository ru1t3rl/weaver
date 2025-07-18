using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Weaver.Infrastructure;

namespace Weaver.Commands.ServiceOptions;

public class CreateServiceTemplateOptionValidator : AbstractValidator<CreateServiceTemplateOptionCommand>
{
    public CreateServiceTemplateOptionValidator(WeaverDbContext dbContext)
    {
        RuleFor(x => x.Type).NotEmpty();
        RuleFor(x => x.Name)
            .NotEmpty()
            .MustAsync(async (name, cancellationToken) =>
            {
                bool nameExists = await dbContext.ServiceOptions
                    .AnyAsync(option => option.Name == name, cancellationToken);

                return !nameExists;
            })
            .WithMessage("A Service Option with that name already exists.");
    }
}