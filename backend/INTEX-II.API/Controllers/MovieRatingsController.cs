using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using INTEX_II.API.Data;
using INTEX_II.API.Models;

namespace INTEX_II.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    //[Authorize]
    public class MovieRatingsController : ControllerBase
    {
        private readonly MainDbContext _context;

        public MovieRatingsController(MainDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieRating>>> GetAll()
        {
            return await _context.MovieRatings.ToListAsync();
        }
    }
}
