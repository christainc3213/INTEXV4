using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Authorization;

namespace INTEX_II.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]
    public class DetailsRecommendationController : ControllerBase
    {
        private readonly IConfiguration _config;

        public DetailsRecommendationController(IConfiguration config)
        {
            _config = config;
        }

        private List<string> GetRecommendations(string table, string showId)
        {
            var recs = new List<string>();
            using var conn = new SqliteConnection(_config.GetConnectionString("MainDbConnection"));
            conn.Open();

            var query = $"SELECT * FROM {table} WHERE show_id = @showId";
            using var cmd = new SqliteCommand(query, conn);
            cmd.Parameters.AddWithValue("@showId", showId);

            using var reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                for (int i = 1; i <= 10; i++)
                {
                    recs.Add(reader[$"Recommendation {i}"].ToString());
                }
            }

            return recs;
        }

        [HttpGet("content/{showId}")]
        public IActionResult GetContentRecommendations(string showId) =>
            Ok(GetRecommendations("content_rec", showId));

        [HttpGet("collab/{showId}")]
        public IActionResult GetCollabRecommendations(string showId) =>
            Ok(GetRecommendations("collab_details_rec", showId));

        [HttpGet("action/{showId}")]
        public IActionResult GetActionRecommendations(string showId) =>
            Ok(GetRecommendations("act_collab_details_rec", showId));

        [HttpGet("comedy/{showId}")]
        public IActionResult GetComedyRecommendations(string showId) =>
            Ok(GetRecommendations("com_collab_details_rec", showId));

        [HttpGet("drama/{showId}")]
        public IActionResult GetDramaRecommendations(string showId) =>
            Ok(GetRecommendations("dram_collab_details_rec", showId));
    }

}
