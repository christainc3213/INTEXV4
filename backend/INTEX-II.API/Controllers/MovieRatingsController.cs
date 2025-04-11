using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using INTEX_II.API.Data;
using INTEX_II.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace INTEX_II.API.Controllers
{
    [ApiController]
    [Route("api/ratings")]
    [Authorize]
    public class MovieRatingsController : ControllerBase
    {
        private readonly MainDbContext _context;

        public MovieRatingsController(MainDbContext context)
        {
            _context = context;
        }

        // GET: api/ratings/{userId}/{showId}
        [HttpGet("{userId}/{showId}")]
        public async Task<ActionResult<MovieRating>> GetRating(int userId, string showId)
        {
            var rating = await _context.MovieRatings
                .FirstOrDefaultAsync(r => r.user_id == userId && r.show_id == showId);

            if (rating == null)
            {
                return NotFound();
            }

            return Ok(rating);
        }

        // POST: api/ratings
        [HttpPost]
        public async Task<IActionResult> AddOrUpdateRating([FromBody] MovieRating rating)
        {
            var existing = await _context.MovieRatings
                .FirstOrDefaultAsync(r => r.user_id == rating.user_id && r.show_id == rating.show_id);

            if (existing != null)
            {
                existing.rating = rating.rating;
                _context.MovieRatings.Update(existing);
            }
            else
            {
                _context.MovieRatings.Add(rating);
            }

            await _context.SaveChangesAsync();
            return Ok(rating);
        }
    }
}
