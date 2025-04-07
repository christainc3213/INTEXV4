using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX_II.API.Models
{
    [Table("movies_users")]
    public class MovieUser
    {
        [Key]
        public int user_id { get; set; }
        public string name { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public int age { get; set; }
        public string gender { get; set; }
        public int Netflix { get; set; }
        [Column("Amazon Prime")]
        public int amazon_prime { get; set; }
        [Column("Disney+")]
        public int disney_plus { get; set; }
        [Column("Paramount+")]
        public int paramount_plus { get; set; }
        public int Max { get; set; }
        public int Hulu { get; set; }
        [Column("Apple TV+")]
        public int apple_tv_plus { get; set; }
        public int Peacock { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public int zip { get; set; }
    }
}
