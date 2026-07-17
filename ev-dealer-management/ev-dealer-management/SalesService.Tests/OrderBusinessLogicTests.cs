using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using SalesService.Controllers;
using SalesService.Data;
using SalesService.DTOs;
using SalesService.Models;

namespace SalesService.Tests;

public class OrderBusinessLogicTests : IDisposable
{
    private readonly SalesDbContext _db;
    private readonly OrdersController _controller;

    public OrderBusinessLogicTests()
    {
        var options = new DbContextOptionsBuilder<SalesDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _db = new SalesDbContext(options);

        var configuration = new Mock<IConfiguration>();
        configuration.SetupGet(value => value["Services:VehicleService"])
            .Returns("http://127.0.0.1:1");
        _controller = new OrdersController(
            Mock.Of<ILogger<OrdersController>>(), _db, configuration.Object);
    }

    [Fact]
    public async Task CompleteOrder_Should_UseDiscountAmount_WhenBothDiscountsProvided()
    {
        var request = ValidRequest();
        request.DiscountAmount = 100;
        request.DiscountPercent = 50;

        var result = await _controller.CompleteOrder(request);

        Assert.IsType<OkObjectResult>(result);
        var order = Assert.Single(await _db.Orders.ToListAsync());
        Assert.Equal(1900m, order.TotalPrice);
        Assert.Equal(100m, order.TotalDiscount);
    }

    [Fact]
    public async Task CompleteOrder_Should_LeaveQuoteUnchanged_WhenQuoteNotActive()
    {
        _db.Quotes.Add(new Quote { Id = 7, Status = "Expired" });
        await _db.SaveChangesAsync();
        var request = ValidRequest();
        request.QuoteId = 7;

        var result = await _controller.CompleteOrder(request);

        Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Expired", (await _db.Quotes.FindAsync(7))?.Status);
    }

    [Fact]
    public async Task CompleteOrder_Should_GenerateDifferentOrderNumbers_ForSequentialOrders()
    {
        await _controller.CompleteOrder(ValidRequest());
        await _controller.CompleteOrder(ValidRequest());

        var orderNumbers = await _db.Orders.Select(order => order.OrderNumber).ToListAsync();
        Assert.Equal(2, orderNumbers.Distinct().Count());
    }

    private static CreateOrderRequest ValidRequest() => new()
    {
        CustomerEmail = "customer@example.com",
        CustomerName = "Customer",
        Quantity = 2,
        UnitPrice = 1000,
        PaymentMethod = "Cash",
        PaymentType = "Full",
        DeliveryDate = DateTime.UtcNow.AddDays(3),
        EstimatedDeliveryDate = DateTime.UtcNow.AddDays(5),
    };

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }
}
