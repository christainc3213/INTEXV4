using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using INTEX_II.API.Data;
using INTEX_II.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace INTEX_II.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    // [Authorize]
    public class MovieUsersController : ControllerBase
    {
        private readonly MainDbContext _context;

        public MovieUsersController(MainDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieUser>>> GetAll()
        {
            return await _context.MovieUsers.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MovieUser>> GetById(int id)
        {
            var user = await _context.MovieUsers.FindAsync(id);
            return user == null ? NotFound() : user;
        }
    }
}
