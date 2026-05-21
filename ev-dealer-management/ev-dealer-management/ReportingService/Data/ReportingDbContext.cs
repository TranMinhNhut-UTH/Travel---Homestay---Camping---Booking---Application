using Microsoft.EntityFrameworkCore;
using ev_dealer_reporting.Models;

namespace ev_dealer_reporting.Data
{
    public class ReportingDbContext : DbContext
    {
        public ReportingDbContext(DbContextOptions<ReportingDbContext> options) : base(options) { }

        public DbSet<ReportRequest> ReportRequests => Set<ReportRequest>();
        public DbSet<ReportExport> ReportExports => Set<ReportExport>();
        public DbSet<SalesSummary> SalesSummaries => Set<SalesSummary>();
        public DbSet<InventorySummary> InventorySummaries => Set<InventorySummary>();
        public DbSet<DebtSummary> DebtSummaries => Set<DebtSummary>(); // Add DebtSummary

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ReportRequest>(eb =>
            {
                eb.HasKey(r => r.Id);
                eb.Property(r => r.Type).IsRequired().HasMaxLength(100);
            });

            modelBuilder.Entity<ReportExport>(eb =>
            {
                eb.HasKey(e => e.Id);
                eb.Property(e => e.FileName).IsRequired().HasMaxLength(255);
                eb.HasOne<ReportRequest>()
                  .WithMany()
                  .HasForeignKey(e => e.ReportRequestId)
                  .OnDelete(DeleteBehavior.SetNull);
            });

            // Cấu hình index để tối ưu truy vấn báo cáo
            modelBuilder.Entity<SalesSummary>(eb =>
            {
                eb.HasKey(s => s.Id);
                eb.Property(s => s.Date).IsRequired();
                eb.Property(s => s.DealerId).IsRequired();
                eb.Property(s => s.DealerName).IsRequired().HasMaxLength(255);
                eb.Property(s => s.Region).IsRequired().HasMaxLength(100);
                eb.Property(s => s.SalespersonId).IsRequired();
                eb.Property(s => s.SalespersonName).IsRequired().HasMaxLength(255);
                eb.Property(s => s.TotalOrders).IsRequired();
                eb.Property(s => s.TotalRevenue).IsRequired().HasColumnType("decimal(18, 2)");
                eb.Property(s => s.LastUpdatedAt).IsRequired();
                eb.HasIndex(s => new { s.Date, s.DealerId, s.SalespersonId });
            });

            modelBuilder.Entity<InventorySummary>(eb =>
            {
                eb.HasKey(i => i.Id);
                eb.Property(i => i.VehicleId).IsRequired();
                eb.Property(i => i.VehicleName).IsRequired().HasMaxLength(255);
                eb.Property(i => i.DealerId).IsRequired();
                eb.Property(i => i.DealerName).IsRequired().HasMaxLength(255);
                eb.Property(i => i.Region).IsRequired().HasMaxLength(100);
                eb.Property(i => i.StockCount).IsRequired();
                eb.Property(i => i.LastUpdatedAt).IsRequired();
                eb.HasIndex(i => new { i.DealerId, i.VehicleId });
            });

            // Cấu hình cho DebtSummary
            modelBuilder.Entity<DebtSummary>(eb =>
            {
                eb.HasKey(d => d.Id);
                eb.Property(d => d.DebtType).IsRequired().HasMaxLength(50);
                eb.Property(d => d.ReferenceType).IsRequired().HasMaxLength(50);
                eb.Property(d => d.ReferenceId).IsRequired().HasMaxLength(100);
                eb.Property(d => d.TotalAmount).IsRequired().HasColumnType("decimal(18, 2)");
                eb.Property(d => d.OutstandingAmount).IsRequired().HasColumnType("decimal(18, 2)");
                eb.Property(d => d.Status).IsRequired().HasMaxLength(50);
                eb.Property(d => d.CreatedAt).IsRequired();
                eb.Property(d => d.LastUpdatedAt).IsRequired();
                eb.HasIndex(d => new { d.DebtType, d.ReferenceType, d.ReferenceId }).IsUnique(); // Đảm bảo duy nhất
                eb.HasIndex(d => d.DealerId);
                eb.HasIndex(d => d.CustomerId);
            });
        }
    }
}
