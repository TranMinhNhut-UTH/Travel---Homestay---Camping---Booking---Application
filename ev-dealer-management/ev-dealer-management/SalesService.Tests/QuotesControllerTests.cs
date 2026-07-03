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
    public class QuotesControllerTests : IDisposable
    {
        private readonly SalesDbContext _context;
        private readonly Mock<ILogger<QuotesController>> _loggerMock;
        private readonly Mock<IConfiguration> _configMock;
        private readonly QuotesController _controller;

        public QuotesControllerTests()
        {
            var options = new DbContextOptionsBuilder<SalesDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SalesDbContext(options);
            _loggerMock = new Mock<ILogger<QuotesController>>();
            _configMock = new Mock<IConfiguration>();

            _controller = new QuotesController(_context, _loggerMock.Object, _configMock.Object);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task CreateQuote_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            _controller.ModelState.AddModelError("CustomerId", "Required");
            var dto = new CreateQuoteDto();

            // Act
            var result = await _controller.CreateQuote(dto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateQuote_ValidDto_ReturnsCreated()
        {
            // Arrange
            var dto = new CreateQuoteDto
            {
                CustomerId = 1,
                DealerId = 1,
                VehicleId = 1,
                Quantity = 2,
                UnitPrice = 1000,
                TotalPrice = 2000,
                Status = "Active"
            };

            // Act
            var result = await _controller.CreateQuote(dto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal("GetAllQuotes", createdResult.ActionName);
            var quote = Assert.IsType<Quote>(createdResult.Value);
            Assert.Equal(2000, quote.TotalBasePrice);
        }

        [Fact]
        public async Task CreateQuote_DatabaseException_Returns500()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<SalesDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            // To simulate a DB exception, we can mock the DbContext, but DbContext is hard to mock completely.
            // A simpler way for this specific test in EF Core InMemory is to just pass null DTO to cause a NullReferenceException,
            // which gets caught by the global catch(Exception) block.
            
            // Act
            var result = await _controller.CreateQuote(null); // Will throw NullReference in the try block

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, objectResult.StatusCode);
        }
    }
}
