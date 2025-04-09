using Microsoft.AspNetCore.Mvc;
using INTEX_II.API.Data;
using INTEX_II.API.Models;
using Microsoft.EntityFrameworkCore;

namespace INTEX_II.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MainDbController : ControllerBase
    {
        private readonly MainDbContext _mainDbContext;

        public MainDbController(MainDbContext mainDbContext)
        {
            _mainDbContext = mainDbContext;
        }


        [HttpGet]
        public IActionResult Get(int pageSize = 5, int pageNumber = 1, string? search = null)
        {
        var query = _mainDbContext.MovieTitles.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(m => m.title.ToLower().Contains(search));
        }

        var totalMovies = query.Count();
        var totalPages = (int)Math.Ceiling((double)totalMovies / pageSize);

        var movieList = query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var movieObject = new
        {
            Movies = movieList,
            TotalNumMovies = totalMovies,
            TotalPages = totalPages
        };

        return Ok(movieObject);
        }


        [HttpPost("AddMovie")]
        public IActionResult AddMovie([FromBody] MovieTitle newMovie)
        {
            if (newMovie == null)
            {
                return BadRequest("Movie data is null");
            }

            // Generate the new show_id for the movie
            newMovie.show_id = GetNextShowId();  // Call the method to generate the next show_id

            // Add the new movie to the database
            _mainDbContext.MovieTitles.Add(newMovie);

            // Save changes to the database
            _mainDbContext.SaveChanges();

            return Ok(newMovie);
        }

        // Method to get the next show_id
        private string GetNextShowId()
        {   
            // Query all show_ids from the database
            var lastShowId = _mainDbContext.MovieTitles
                                        .Select(m => m.show_id)
                                        .ToList()
                                        .Select(id => long.TryParse(id.Substring(1), out var num) ? num : 0) // Extract numeric part
                                        .OrderByDescending(num => num) // Sort numerically
                                        .FirstOrDefault(); // Get the highest number

            // If no movie exists, start with "s1"
            if (lastShowId == 0)
            {
                return "s1";
            }

            // Increment the highest numeric part and return the new show_id
            return "s" + (lastShowId + 1);
        }

        [HttpPut("UpdateMovie/{show_id}")]
        public IActionResult UpdateMovie(string show_id, [FromBody] MovieTitle updatedMovie)
        {
            var existingMovie = _mainDbContext.MovieTitles.Find(show_id);
            if (existingMovie == null)
            {
                return NotFound("Movie not found");
            }

            // Update properties
            existingMovie.type = updatedMovie.type;
            existingMovie.title = updatedMovie.title;
            existingMovie.director = updatedMovie.director;
            existingMovie.cast = updatedMovie.cast;
            existingMovie.country = updatedMovie.country;
            existingMovie.release_year = updatedMovie.release_year;
            existingMovie.rating = updatedMovie.rating;
            existingMovie.duration = updatedMovie.duration;
            existingMovie.description = updatedMovie.description;

            // Update genre flags
            existingMovie.Action = updatedMovie.Action;
            existingMovie.Adventure = updatedMovie.Adventure;
            existingMovie.anime_int_tv = updatedMovie.anime_int_tv;
            existingMovie.british_int_tv = updatedMovie.british_int_tv;
            existingMovie.Children = updatedMovie.Children;
            existingMovie.Comedies = updatedMovie.Comedies;
            existingMovie.comedy_drama_int = updatedMovie.comedy_drama_int;
            existingMovie.comedy_int = updatedMovie.comedy_int;
            existingMovie.comedy_romance = updatedMovie.comedy_romance;
            existingMovie.crime_tv = updatedMovie.crime_tv;
            existingMovie.Documentaries = updatedMovie.Documentaries;
            existingMovie.documentary_int = updatedMovie.documentary_int;
            existingMovie.Docuseries = updatedMovie.Docuseries;
            existingMovie.Dramas = updatedMovie.Dramas;
            existingMovie.drama_int = updatedMovie.drama_int;
            existingMovie.drama_romance = updatedMovie.drama_romance;
            existingMovie.family = updatedMovie.family;
            existingMovie.fantasy = updatedMovie.fantasy;
            existingMovie.horror = updatedMovie.horror;
            existingMovie.thriller_int = updatedMovie.thriller_int;
            existingMovie.drama_romance_int_tv = updatedMovie.drama_romance_int_tv;
            existingMovie.kids_tv = updatedMovie.kids_tv;
            existingMovie.language_tv = updatedMovie.language_tv;
            existingMovie.Musicals = updatedMovie.Musicals;
            existingMovie.nature_tv = updatedMovie.nature_tv;
            existingMovie.reality_tv = updatedMovie.reality_tv;
            existingMovie.Spirituality = updatedMovie.Spirituality;
            existingMovie.action_tv = updatedMovie.action_tv;
            existingMovie.comedy_tv = updatedMovie.comedy_tv;
            existingMovie.drama_tv = updatedMovie.drama_tv;
            existingMovie.talk_show_comedy_tv = updatedMovie.talk_show_comedy_tv;
            existingMovie.Thrillers = updatedMovie.Thrillers;

            _mainDbContext.MovieTitles.Update(existingMovie);
            _mainDbContext.SaveChanges();

            return Ok(existingMovie);
        }

        [HttpDelete("DeleteMovie/{show_id}")]
        public IActionResult DeleteMovie(string show_id)
        {
            var movieToDelete = _mainDbContext.MovieTitles.Find(show_id);
            if (movieToDelete == null)
            {
                return NotFound("Movie not found");
            }

            _mainDbContext.MovieTitles.Remove(movieToDelete);
            _mainDbContext.SaveChanges();

            return Ok($"Movie with ID {show_id} deleted successfully");
        }
    }
}