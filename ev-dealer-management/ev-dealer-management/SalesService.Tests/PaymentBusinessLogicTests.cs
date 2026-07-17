using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using SalesService.Controllers;
using SalesService.Data;
using SalesService.DTOs;

namespace SalesService.Tests;

public class PaymentBusinessLogicTests : IDisposable
{
    private readonly SalesDbContext _db;
    private readonly PaymentsController _controller;

    public PaymentBusinessLogicTests()
    {
        var options = new DbContextOptionsBuilder<SalesDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _db = new SalesDbContext(options);
        _controller = new PaymentsController(
            _db,
            Mock.Of<IConfiguration>(),
            Mock.Of<ILogger<PaymentsController>>());
    }

    [Fact]
    public async Task CreatePayment_Should_PersistAndReturnPayment_WhenRequestValid()
    {
        var request = ValidRequest();

        var result = await _controller.CreatePayment(request);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var response = Assert.IsType<PaymentDto>(created.Value);
        Assert.Equal(request.Amount, response.Amount);
        Assert.Equal(request.OrderId, response.OrderId);
        Assert.Single(await _db.Payments.ToListAsync());
    }

    [Fact]
    public void CreatePayment_Should_FailValidation_WhenAmountIsZero()
    {
        var request = ValidRequest();
        request.Amount = 0;
        var validationResults = new List<ValidationResult>();

        var valid = Validator.TryValidateObject(
            request, new ValidationContext(request), validationResults, validateAllProperties: true);

        Assert.False(valid);
        Assert.Contains(validationResults, result => result.MemberNames.Contains(nameof(CreatePaymentDto.Amount)));
    }

    [Fact]
    public async Task GetPayments_Should_MapStoredPaymentToDto()
    {
        await _controller.CreatePayment(ValidRequest());

        var result = await _controller.GetPayments();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var payments = Assert.IsAssignableFrom<IEnumerable<PaymentDto>>(ok.Value);
        var payment = Assert.Single(payments);
        Assert.Equal("TXN-UNIT", payment.TransactionId);
        Assert.Equal("Completed", payment.Status);
    }

    private static CreatePaymentDto ValidRequest() => new()
    {
        OrderId = 42,
        Amount = 1500,
        PaymentDate = DateTime.UtcNow,
        PaymentMethod = "Cash",
        Status = "Completed",
        TransactionId = "TXN-UNIT",
    };

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }
}
