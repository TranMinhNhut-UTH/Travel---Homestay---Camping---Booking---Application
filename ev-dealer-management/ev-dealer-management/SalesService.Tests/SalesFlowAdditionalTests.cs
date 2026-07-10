using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using SalesService.Controllers;
using SalesService.Data;
using SalesService.DTOs;
using SalesService.Models;
using Xunit;

namespace SalesService.Tests
{
    public class SalesFlowAdditionalTests : IDisposable
    {
        private readonly SalesDbContext _context;
        private readonly OrdersController _ordersController;
        private readonly ContractsController _contractsController;
        private readonly PaymentsController _paymentsController;
        private readonly DeliveriesController _deliveriesController;
        private readonly PromotionsController _promotionsController;

        public SalesFlowAdditionalTests()
        {
            var options = new DbContextOptionsBuilder<SalesDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SalesDbContext(options);

            var logger = new Mock<ILogger<OrdersController>>();
            var config = new Mock<IConfiguration>();
            config.Setup(x => x[It.IsAny<string>()]).Returns("http://localhost:5001");
            _ordersController = new OrdersController(logger.Object, _context, config.Object);

            var contractsLogger = new Mock<ILogger<ContractsController>>();
            _contractsController = new ContractsController(_context, contractsLogger.Object);

            var paymentsLogger = new Mock<ILogger<PaymentsController>>();
            var paymentsConfig = new Mock<IConfiguration>();
            _paymentsController = new PaymentsController(_context, paymentsConfig.Object, paymentsLogger.Object);

            _deliveriesController = new DeliveriesController(_context);
            _promotionsController = new PromotionsController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task CreatePayment_ValidRequest_ReturnsCreatedAndPersistsPayment()
        {
            var order = new Order
            {
                OrderId = 10,
                QuoteId = 1,
                CustomerId = 1,
                DealerId = 1,
                SalespersonId = 1,
                OrderNumber = "ORD-10",
                VehicleId = 1,
                VariantId = 1,
                ColorId = 1,
                Quantity = 1,
                UnitPrice = 1000,
                SubTotal = 1000,
                TotalDiscount = 0,
                TotalPrice = 1000,
                PaymentMethod = "Trả thẳng",
                PaymentForm = "Tiền mặt",
                DeliveryPreferredDate = DateTime.UtcNow,
                DeliveryExpectedDate = DateTime.UtcNow.AddDays(1),
                Status = "Pending"
            };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var request = new CreatePaymentDto
            {
                OrderId = 10,
                Amount = 1000,
                PaymentDate = DateTime.UtcNow,
                PaymentMethod = "Cash",
                Status = "Completed",
                TransactionId = "TXN-001",
                Notes = "Test payment"
            };

            var result = await _paymentsController.CreatePayment(request);

            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var paymentDto = Assert.IsType<PaymentDto>(created.Value);
            Assert.Equal(10, paymentDto.OrderId);
            Assert.Equal("Completed", paymentDto.Status);
            Assert.Equal(1, await _context.Payments.CountAsync());
        }

        [Fact]
        public async Task CreateDelivery_ValidRequest_ReturnsCreatedAndPersistsDelivery()
        {
            var request = new CreateDeliveryDto
            {
                OrderId = 11,
                TrackingNumber = "TRK-001",
                EstimatedDeliveryDate = DateTime.UtcNow.AddDays(2),
                Status = "Scheduled",
                Notes = "Test delivery"
            };

            var result = await _deliveriesController.CreateDelivery(request);

            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var deliveryDto = Assert.IsType<DeliveryDto>(created.Value);
            Assert.Equal("TRK-001", deliveryDto.TrackingNumber);
            Assert.Equal("Scheduled", deliveryDto.Status);
            Assert.Equal(1, await _context.Deliveries.CountAsync());
        }

        [Fact]
        public async Task CreatePromotion_ValidRequest_ReturnsCreatedAndPersistsPromotion()
        {
            var request = new CreatePromotionDto
            {
                Name = "SUMMER2026",
                Description = "Summer promotion",
                DiscountType = "Percent",
                DiscountValue = 10,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(30)
            };

            var result = await _promotionsController.CreatePromotion(request);

            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var promotionDto = Assert.IsType<PromotionDto>(created.Value);
            Assert.Equal("SUMMER2026", promotionDto.Name);
            Assert.Equal(10, promotionDto.DiscountValue);
            Assert.Equal(1, await _context.Promotions.CountAsync());
        }

        [Fact]
        public async Task CompleteOrder_ValidRequest_CreatesOrderAndUpdatesQuoteStatus()
        {
            var quote = new Quote { Id = 1, Status = "Active" };
            _context.Quotes.Add(quote);
            await _context.SaveChangesAsync();

            var request = new CreateOrderRequest
            {
                QuoteId = 1,
                CustomerEmail = "test@example.com",
                CustomerName = "Test User",
                CustomerId = 2,
                DealerId = 3,
                SalespersonId = 4,
                VehicleId = 5,
                VehicleVariantId = 6,
                ColorId = 7,
                Quantity = 2,
                UnitPrice = 1000,
                DiscountAmount = 100,
                PaymentMethod = "Trả thẳng",
                PaymentType = "Tiền mặt",
                DeliveryDate = DateTime.UtcNow.AddDays(5),
                EstimatedDeliveryDate = DateTime.UtcNow.AddDays(10)
            };

            var result = await _ordersController.CompleteOrder(request);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.True((bool)ok.Value.GetType().GetProperty("success")!.GetValue(ok.Value)!);
            Assert.Equal(1, await _context.Orders.CountAsync());
            var savedQuote = await _context.Quotes.FindAsync(1);
            Assert.Equal("ConvertedToOrder", savedQuote!.Status);
        }
    }
}
