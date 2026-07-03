using System;
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
    public class OrdersControllerTests : IDisposable
    {
        private readonly SalesDbContext _context;
        private readonly Mock<ILogger<OrdersController>> _loggerMock;
        private readonly Mock<IConfiguration> _configMock;
        private readonly OrdersController _controller;

        public OrdersControllerTests()
        {
            var options = new DbContextOptionsBuilder<SalesDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SalesDbContext(options);
            _loggerMock = new Mock<ILogger<OrdersController>>();
            
            // Mock Configuration for GetVehicleModelAsync
            _configMock = new Mock<IConfiguration>();
            _configMock.Setup(x => x["Services:VehicleService"]).Returns("http://localhost:5001");

            _controller = new OrdersController(_loggerMock.Object, _context, _configMock.Object);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        private Order CreateValidOrder(int id)
        {
            return new Order 
            { 
                OrderId = id, 
                QuoteId = 1,
                CustomerId = 1,
                DealerId = 1,
                SalespersonId = 1,
                OrderNumber = $"ORD-{id}",
                VehicleId = 1,
                VariantId = 1,
                ColorId = 1,
                Quantity = 1,
                UnitPrice = 100,
                SubTotal = 100,
                TotalDiscount = 0,
                TotalPrice = 100,
                PaymentMethod = "Trả thẳng",
                PaymentForm = "Tiền mặt",
                DeliveryPreferredDate = DateTime.Now.AddDays(7),
                DeliveryExpectedDate = DateTime.Now.AddDays(7),
                Status = "Pending"
            };
        }

        [Fact]
        public async Task CompleteOrder_MissingEmail_ReturnsBadRequest()
        {
            var req = new CreateOrderRequest { CustomerName = "Test" };
            var result = await _controller.CompleteOrder(req);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CompleteOrder_MissingName_ReturnsBadRequest()
        {
            var req = new CreateOrderRequest { CustomerEmail = "test@test.com" };
            var result = await _controller.CompleteOrder(req);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CompleteOrder_TotalPriceZero_ReturnsBadRequest()
        {
            var req = new CreateOrderRequest 
            { 
                CustomerEmail = "test@test.com", 
                CustomerName = "Test",
                UnitPrice = 100,
                Quantity = 1,
                DiscountAmount = 200 // Discount > Subtotal => TotalPrice = 0
            };
            var result = await _controller.CompleteOrder(req);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CompleteOrder_ValidRequest_DiscountAmount_ReturnsOk()
        {
            var req = new CreateOrderRequest 
            { 
                CustomerEmail = "test@test.com", 
                CustomerName = "Test",
                UnitPrice = 1000,
                Quantity = 2,
                DiscountAmount = 100
            };
            var result = await _controller.CompleteOrder(req);
            
            var okResult = Assert.IsType<OkObjectResult>(result);
            // Verify TotalPrice = (1000 * 2) - 100 = 1900
            var order = await _context.Orders.FirstOrDefaultAsync();
            Assert.NotNull(order);
            Assert.Equal(1900, order.TotalPrice);
        }

        [Fact]
        public async Task CompleteOrder_ValidRequest_DiscountPercent_UpdatesQuote_ReturnsOk()
        {
            // Add a Quote
            var quote = new Quote { Id = 1, Status = "Active" };
            _context.Quotes.Add(quote);
            await _context.SaveChangesAsync();

            var req = new CreateOrderRequest 
            { 
                CustomerEmail = "test@test.com", 
                CustomerName = "Test",
                UnitPrice = 1000,
                Quantity = 1,
                DiscountPercent = 10, // 10% of 1000 = 100
                QuoteId = 1
            };
            var result = await _controller.CompleteOrder(req);
            
            var okResult = Assert.IsType<OkObjectResult>(result);
            var order = await _context.Orders.FirstOrDefaultAsync();
            Assert.NotNull(order);
            Assert.Equal(900, order.TotalPrice);
            
            // Verify Quote was updated
            var updatedQuote = await _context.Quotes.FindAsync(1);
            Assert.Equal("ConvertedToOrder", updatedQuote.Status);
        }

        [Fact]
        public async Task UpdateOrderStatus_OrderNotFound_ReturnsNotFound()
        {
            var req = new UpdateStatusRequest { Status = "Completed" };
            var result = await _controller.UpdateOrderStatus(99, req);
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task UpdateOrderStatus_ValidId_UpdatesStatus_ReturnsOk()
        {
            var order = CreateValidOrder(1);
            order.Status = "Pending";
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var req = new UpdateStatusRequest { Status = "Completed" };
            var result = await _controller.UpdateOrderStatus(1, req);
            
            Assert.IsType<OkObjectResult>(result);
            var updatedOrder = await _context.Orders.FindAsync(1);
            Assert.Equal("Completed", updatedOrder.Status);
        }
    }
}
