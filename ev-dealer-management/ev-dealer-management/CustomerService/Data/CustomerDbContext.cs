using Microsoft.EntityFrameworkCore;
using CustomerService.Models; // Ensure Models namespace is included

namespace CustomerService.Data
{
    public class CustomerDbContext : DbContext
    {
        public CustomerDbContext(DbContextOptions<CustomerDbContext> options) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<TestDrive> TestDrives { get; set; }
        public DbSet<Complaint> Complaints { get; set; }

        public DbSet<ComplaintAttachment> ComplaintAttachments { get; set; }
        public DbSet<ComplaintHistoryEntry> ComplaintHistoryEntries { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired();
                entity.HasIndex(e => e.Email).IsUnique();

                // A customer can have many test drives
                entity.HasMany(c => c.TestDrives)
                      .WithOne(td => td.Customer)
                      .HasForeignKey(td => td.CustomerId);

                // Cấu hình mối quan hệ với Complaints
                entity.HasMany(c => c.Complaints) // Customer có nhiều Complaints
                      .WithOne(comp => comp.Customer) // Mỗi Complaint thuộc về một Customer
                      .HasForeignKey(comp => comp.CustomerId); // Khóa ngoại là CustomerId trong Complaint
            });

            modelBuilder.Entity<TestDrive>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            // Cấu hình cho Complaint
            modelBuilder.Entity<Complaint>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Priority).HasMaxLength(20);

                // Mối quan hệ với Customer đã được cấu hình ở trên (từ phía Customer)
                // entity.HasOne(c => c.Customer)
                //       .WithMany()
                //       .HasForeignKey(c => c.CustomerId);

                // Mối quan hệ với ComplaintAttachment
                entity.HasMany(c => c.Attachments)
                      .WithOne(ca => ca.Complaint)
                      .HasForeignKey(ca => ca.ComplaintId);


                // Mối quan hệ với ComplaintHistoryEntry
                entity.HasMany(c => c.History)
                      .WithOne(che => che.Complaint)
                      .HasForeignKey(che => che.ComplaintId);
            });

            // Cấu hình cho ComplaintAttachment
            modelBuilder.Entity<ComplaintAttachment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FilePath).IsRequired().HasMaxLength(500);
            });

            // Cấu hình cho ComplaintHistoryEntry
            modelBuilder.Entity<ComplaintHistoryEntry>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ActionType).IsRequired().HasMaxLength(100);
            });
        }
    }
}
