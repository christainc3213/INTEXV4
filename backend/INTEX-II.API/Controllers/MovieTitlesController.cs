using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using INTEX_II.API.Data;
using INTEX_II.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace INTEX_II.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class MovieTitlesController : ControllerBase
    {
        private readonly MainDbContext _context;

        public MovieTitlesController(MainDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieTitle>>> GetAll()
        {
            return await _context.MovieTitles.Take(9000).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MovieTitle>> GetById(string id)
        {
            var movie = await _context.MovieTitles.FindAsync(id);
            return movie == null ? NotFound() : movie;
        }
    }
}
