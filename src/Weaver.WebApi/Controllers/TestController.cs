using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Weaver.Infrastructure;
using Weaver.WebApi.Models;

namespace Weaver.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    private readonly WeaverDbContext _dbContext;

    public TestController(WeaverDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    [ProducesResponseType<IEnumerable<ServiceOptionModel>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Get()
    {
        List<ServiceOptionModel> options = await _dbContext.ServiceOptions
            .AsNoTracking()
            .Select(option => new ServiceOptionModel
            {
                Id = option.Uuid,
                Name = option.Name,
                Type = option.Type
            })
            .ToListAsync();

        return Ok(options);
    }
}