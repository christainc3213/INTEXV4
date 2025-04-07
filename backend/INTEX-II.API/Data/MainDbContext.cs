using INTEX_II.API.Models;
using Microsoft.EntityFrameworkCore;

namespace INTEX_II.API.Data
{
    public class MainDbContext : DbContext
    {
        public MainDbContext(DbContextOptions<MainDbContext> options) : base(options)
        {
        }
        public DbSet<MovieTitle> MovieTitles { get; set; }
        public DbSet<MovieRating> MovieRatings { get; set; }
        public DbSet<MovieUser> MovieUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MovieTitle>().ToTable("movies_titles");
            modelBuilder.Entity<MovieUser>().ToTable("movies_users");
            modelBuilder.Entity<MovieRating>()
                .ToTable("movies_ratings")
                .HasKey(r => new {r.user_id, r.rating});
        }
    }
}