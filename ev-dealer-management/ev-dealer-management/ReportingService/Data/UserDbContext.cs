using Microsoft.EntityFrameworkCore;
using ev_dealer_reporting.Models;

namespace ev_dealer_reporting.Data
{
    /// <summary>
    /// Read-only DbContext để access dữ liệu Users từ users.db
    /// </summary>
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Dealer> Dealers { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Map to exact table names from UserService
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<Dealer>().ToTable("Dealer");
        }
    }
}
