using Microsoft.AspNetCore.Mvc;

namespace INTEX_II.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InteractionController : ControllerBase
    {
        public class InteractionEvent
        {
            public string EventType { get; set; }
            public string MovieId { get; set; }
        }

        [HttpPost]
        public IActionResult LogInteraction([FromBody] InteractionEvent interaction)
        {
            if (!Request.Cookies.TryGetValue("interactionId", out string interactionId))
            {
                interactionId = Guid.NewGuid().ToString();
                Response.Cookies.Append("interactionId", interactionId);
            }

            // Save interaction to a persistent store
            SaveInteraction(interactionId, interaction.EventType, interaction.MovieId);

            return Ok(new { message = "Interaction logged", interactionId });
        }

        // Added method to fix CS0103 error
        private void SaveInteraction(string interactionId, string eventType, string movieId)
        {
            // Implementation for saving interaction (e.g., database or logging)
            // Example: Log to console (replace with actual implementation)
            Console.WriteLine($"InteractionId: {interactionId}, EventType: {eventType}, MovieId: {movieId}");
        }
    }
}
