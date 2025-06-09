using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Weaver.Infrastructure;

namespace Weaver.Commands.Services;

public class CreateServiceValidator : AbstractValidator<CreateServiceCommand>
{
    public CreateServiceValidator(WeaverDbContext dbContext)
    {
        RuleFor(x => x.Type).NotEmpty();
        RuleFor(x => x.Name)
            .NotEmpty()
            .MustAsync(async (name, cancellationToken) =>
            {
                bool serviceExists = await dbContext.Services
                    .AnyAsync(option => option.Name == name, cancellationToken);

                return !serviceExists;
            });
    }
}