using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Authorization;

namespace INTEX_II.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
 //   [Authorize]
    public class BrowseRecommendationsController : ControllerBase
    {
        private readonly string _connectionString;

        public BrowseRecommendationsController()
        {
            _connectionString = "Data Source=MainDb.sqlite";
        }
        
        [HttpGet("genre/action/{userId}")]
        public IActionResult GetActionRecommendations(int userId)
        {
            return GetGenreRecommendations("action", userId);
        }

        [HttpGet("genre/comedies/{userId}")]
        public IActionResult GetComedyRecommendations(int userId)
        {
            return GetGenreRecommendations("comedies", userId);
        }

        [HttpGet("genre/dramas/{userId}")]
        public IActionResult GetDramaRecommendations(int userId)
        {
            return GetGenreRecommendations("dramas", userId);
        }
        
        
        
        private IActionResult GetGenreRecommendations(string genre, int userId)
        {
            string tableName = genre switch
            {
                "action" => "act_collab_browse_rec",
                "comedies" => "com_collab_browse_rec",
                "dramas" => "dram_collab_browse_rec",
                _ => null
            };

            if (tableName == null)
                return NotFound($"Genre '{genre}' is not supported.");

            var recommendations = new List<string>();

            using var connection = new SqliteConnection(_connectionString);
            connection.Open();

            var command = connection.CreateCommand();
            command.CommandText = $@"
        SELECT 
            [Recommendation 1], [Recommendation 2], [Recommendation 3],
            [Recommendation 4], [Recommendation 5], [Recommendation 6],
            [Recommendation 7], [Recommendation 8], [Recommendation 9],
            [Recommendation 10]
        FROM {tableName}
        LIMIT 1 OFFSET $userId;
    ";
            command.Parameters.AddWithValue("$userId", userId - 1); // same offset logic

            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                for (int i = 0; i < 10; i++)
                {
                    if (!reader.IsDBNull(i))
                    {
                        recommendations.Add(reader.GetString(i));
                    }
                }
            }

            return Ok(recommendations);
        }

        



        [HttpGet("{userId}")]
        public IActionResult GetRecommendations(int userId)
        {
            var recommendations = new List<string>();

            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();

                var command = connection.CreateCommand();
                command.CommandText = @"
                    SELECT 
                        [Recommendation 1], [Recommendation 2], [Recommendation 3], 
                        [Recommendation 4], [Recommendation 5], [Recommendation 6], 
                        [Recommendation 7], [Recommendation 8], [Recommendation 9], 
                        [Recommendation 10]
                    FROM collab_browse_rec
                    LIMIT 1 OFFSET @UserOffset;
                ";
                command.Parameters.AddWithValue("@UserOffset", userId - 1); // UserID starts at 1

                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        for (int i = 0; i < 10; i++)
                        {
                            if (!reader.IsDBNull(i))
                            {
                                recommendations.Add(reader.GetString(i));
                            }
                        }
                    }
                    else
                    {
                        return NotFound($"No recommendations found for user {userId}");
                    }
                }
            }

            return Ok(recommendations);
        }
    }
}