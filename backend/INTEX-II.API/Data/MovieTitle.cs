using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INTEX_II.API.Models
{
    [Table("movies_titles")]
    public class MovieTitle
    {
        [Key]
        public string show_id { get; set; }
        public string? type { get; set; }
        public string? title { get; set; }
        public string? director { get; set; }
        public string? cast { get; set; }
        public string? country { get; set; }
        public int release_year { get; set; }
        public string? rating { get; set; }
        public string? duration { get; set; }
        public string? description { get; set; }

        // Genre flags (partial sample shown)
        public int? Action { get; set; }
        public int Adventure { get; set; }
        [Column("Anime Series International TV Shows")]
        public int anime_int_tv { get; set; }
        [Column("British TV Shows Docuseries International TV Shows")]
        public int british_int_tv { get; set; }
        public int? Children {  get; set; }
        public int Comedies { get; set; }
        [Column("Comedies Dramas International Movies")]
        public int comedy_drama_int { get; set; }
        [Column("Comedies International Movies")]
        public int comedy_int {  get; set; }
        [Column("Comedies Romantic Movies")]
        public int comedy_romance {  get; set; }
        [Column("Crime TV Shows Docuseries")]
        public int crime_tv { get; set; }
        public int Documentaries { get; set; }
        [Column("Documentaries International Movies")]
        public int documentary_int { get; set; }
        public int Docuseries { get; set; }
        public int Dramas { get; set; }
        [Column("Dramas International Movies")]
        public int drama_int { get; set; }
        [Column("Dramas Romantic Movies")]
        public int drama_romance { get; set; }
        [Column("Family Movies")]
        public int family {  get; set; }
        public int fantasy {  get; set; }
        [Column("Horror Movies")]
        public int? horror { get; set; }
        [Column("International Movies Thrillers")]
        public int thriller_int { get; set; }
        [Column("International TV Shows Romantic TV Shows TV Dramas")]
        public int drama_romance_int_tv { get; set; }
        [Column("Kids' TV")]
        public int kids_tv { get; set; }
        [Column("Language TV Shows")]
        public int language_tv { get; set; }
        public int Musicals { get; set; }
        [Column("Nature TV")]
        public int nature_tv { get; set; }
        [Column("Reality TV")]
        public int reality_tv { get; set; }
        public int Spirituality { get; set; }
        [Column("TV Action")]
        public int action_tv { get; set; }
        [Column("TV Comedies")]
        public int comedy_tv { get; set; }
        [Column("TV Dramas")]
        public int drama_tv { get; set; }
        [Column("Talk Shows TV Comedies")]
        public int talk_show_comedy_tv { get; set; }
        public int Thrillers { get; set; }
    }
}
