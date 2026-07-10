using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ev_dealer_reporting.Data;
using ev_dealer_reporting.DTOs;
using ev_dealer_reporting.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace SalesService.Tests
{
    public class ReportingServiceTests
    {
        [Fact]
        public async Task GetDealerSalesReportAsync_WithOrders_ReturnsAggregatedRevenue()
        {
            var options = new DbContextOptionsBuilder<ReportingDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            await using var db = new ReportingDbContext(options);
            var salesService = new Mock<ISalesDataService>();
            var vehicleService = new Mock<IVehicleDataService>();
            var customerService = new Mock<ICustomerDataService>();
            var userService = new Mock<IUserDataService>();
            var logger = new Mock<ILogger<ReportService>>();

            vehicleService.Setup(x => x.GetDealersAsync()).ReturnsAsync(new List<DealerDto>
            {
                new DealerDto { Id = 1, Name = "Dealer A", Region = "Miền Bắc" }
            });

            salesService.Setup(x => x.GetOrdersAsync(It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), 1))
                .ReturnsAsync(new List<OrderDataDto>
                {
                    new OrderDataDto { OrderId = 1, Quantity = 2, TotalPrice = 2000, CreatedAt = new DateTime(2026, 1, 10), DealerId = 1, SalespersonId = 1, CustomerId = 1, VehicleId = 1, Status = "Completed" },
                    new OrderDataDto { OrderId = 2, Quantity = 1, TotalPrice = 1000, CreatedAt = new DateTime(2026, 1, 20), DealerId = 1, SalespersonId = 1, CustomerId = 1, VehicleId = 2, Status = "Completed" }
                });

            var service = new ReportService(salesService.Object, vehicleService.Object, customerService.Object, userService.Object, db, logger.Object);

            var result = await service.GetDealerSalesReportAsync(1, "month", new DateTime(2026, 1, 1), new DateTime(2026, 1, 31));

            Assert.Equal(1, result.DealerId);
            Assert.Equal(3, result.TotalVehiclesSold);
            Assert.Equal(3000m, result.TotalRevenue);
            Assert.Single(result.SalesByPeriod);
        }

        [Fact]
        public async Task GetSalesByStaffAsync_WithSalesData_ReturnsStaffSummary()
        {
            var options = new DbContextOptionsBuilder<ReportingDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            await using var db = new ReportingDbContext(options);
            var salesService = new Mock<ISalesDataService>();
            var vehicleService = new Mock<IVehicleDataService>();
            var customerService = new Mock<ICustomerDataService>();
            var userService = new Mock<IUserDataService>();
            var logger = new Mock<ILogger<ReportService>>();

            salesService.Setup(x => x.GetQuotesAsync(It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), null))
                .ReturnsAsync(new List<QuoteDataDto>
                {
                    new QuoteDataDto { QuoteId = 1, SalespersonId = 8, CustomerId = 1, DealerId = 1, VehicleId = 1, Quantity = 1, TotalBasePrice = 1000, Status = "Active", CreatedAt = DateTime.UtcNow }
                });
            salesService.Setup(x => x.GetOrdersAsync(It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), null))
                .ReturnsAsync(new List<OrderDataDto>
                {
                    new OrderDataDto { OrderId = 1, SalespersonId = 8, CustomerId = 1, DealerId = 1, VehicleId = 1, Quantity = 1, TotalPrice = 1000, Status = "Completed", CreatedAt = DateTime.UtcNow }
                });
            salesService.Setup(x => x.GetContractsAsync(It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), null))
                .ReturnsAsync(new List<ContractDataDto>
                {
                    new ContractDataDto { ContractId = 1, SalespersonId = 8, CustomerId = 1, DealerId = 1, OrderId = 1, ContractNumber = "CNTR-1", TotalAmount = 1000, Status = "Approved", PaymentStatus = "Paid", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
                });
            userService.Setup(x => x.GetUsersAsync()).ReturnsAsync(new List<UserDataDto>
            {
                new UserDataDto { Id = 8, FullName = "Staff A", Role = "Sales" }
            });

            var service = new ReportService(salesService.Object, vehicleService.Object, customerService.Object, userService.Object, db, logger.Object);

            var result = await service.GetSalesByStaffAsync(DateTime.UtcNow.AddDays(-30), DateTime.UtcNow);

            var item = Assert.Single(result);
            Assert.Equal(8, item.SalespersonId);
            Assert.Equal(1, item.TotalQuotes);
            Assert.Equal(1, item.TotalOrders);
            Assert.Equal(1, item.TotalContracts);
            Assert.Equal(3, item.TotalDeals);
        }
    }
}
