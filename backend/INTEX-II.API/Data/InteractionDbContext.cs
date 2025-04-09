using INTEX_II.Data;
using Microsoft.EntityFrameworkCore;

namespace INTEX_II.API.Data
{
    public class InteractionDbContext : DbContext
    {
        public InteractionDbContext(DbContextOptions<InteractionDbContext> options) 
            : base(options)
        {
        }

        public DbSet<Interaction> Interactions { get; set; }
    }
}
