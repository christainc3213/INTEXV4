using System;

namespace INTEX_II.Data
{
    public class Interaction
    {
        public int Id { get; set; }
        public string InteractionId { get; set; }
        public string EventType { get; set; }
        public string MovieId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
