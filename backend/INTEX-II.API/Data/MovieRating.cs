using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX_II.API.Models
{
    [Table("movies_ratings")]
    public class MovieRating
    {
        public int user_id { get; set; }
        public string show_id { get; set; }
        public int rating { get; set; }
    }
}
