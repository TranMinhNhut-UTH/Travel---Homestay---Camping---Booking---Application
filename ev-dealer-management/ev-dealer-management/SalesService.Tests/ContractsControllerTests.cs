using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using SalesService.Controllers;
using SalesService.Data;
using SalesService.DTOs;
using SalesService.Models;
using Xunit;

namespace SalesService.Tests
{
    public class ContractsControllerTests : IDisposable
    {
        private readonly SalesDbContext _context;
        private readonly Mock<ILogger<ContractsController>> _loggerMock;
        private readonly ContractsController _controller;

        public ContractsControllerTests()
        {
            var options = new DbContextOptionsBuilder<SalesDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SalesDbContext(options);
            _loggerMock = new Mock<ILogger<ContractsController>>();
            _controller = new ContractsController(_context, _loggerMock.Object);
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
        public async Task CreateContract_InvalidModelState_ReturnsBadRequest()
        {
            _controller.ModelState.AddModelError("OrderId", "Required");
            var result = await _controller.CreateContract(new CreateContractRequest());
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateContract_OrderNotFound_ReturnsNotFound()
        {
            var req = new CreateContractRequest { OrderId = 99 };
            var result = await _controller.CreateContract(req);
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task CreateContract_ContractAlreadyExists_ReturnsBadRequest()
        {
            var order = CreateValidOrder(1);
            _context.Orders.Add(order);
            _context.Contracts.Add(new Contract { OrderId = 1, ContractNumber = "CN-1", Status = "Pending", PaymentStatus = "Unpaid" });
            await _context.SaveChangesAsync();

            var req = new CreateContractRequest { OrderId = 1 };
            var result = await _controller.CreateContract(req);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateContract_InvalidSalespersonId_ReturnsBadRequest()
        {
            var order = CreateValidOrder(2);
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var req = new CreateContractRequest { OrderId = 2, SalespersonId = "ABC" };
            var result = await _controller.CreateContract(req);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateContract_ValidRequest_DepositTrue_ReturnsCreated()
        {
            var order = CreateValidOrder(3);
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var req = new CreateContractRequest 
            { 
                OrderId = 3, 
                SalespersonId = "123",
                DepositAmountReceived = true 
            };
            
            var result = await _controller.CreateContract(req);
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            var contract = Assert.IsType<Contract>(createdResult.Value);
            
            Assert.Equal("Partial", contract.PaymentStatus);
            Assert.Equal("PendingApproval", order.Status);
        }

        [Fact]
        public async Task UpdateContractStatus_ContractNotFound_ReturnsNotFound()
        {
            var req = new UpdateStatusRequest { Status = "Approved" };
            var result = await _controller.UpdateContractStatus(99, req);
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task UpdateContractStatus_Rejected_RemovesContractAndOrder_ReturnsOk()
        {
            var order = CreateValidOrder(1);
            var contract = new Contract { ContractId = 1, OrderId = 1, Order = order, ContractNumber = "C1", Status = "P", PaymentStatus = "P" };
            _context.Orders.Add(order);
            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();

            var req = new UpdateStatusRequest { Status = "Rejected" };
            var result = await _controller.UpdateContractStatus(1, req);
            
            Assert.IsType<OkObjectResult>(result);
            Assert.Null(await _context.Contracts.FindAsync(1));
            Assert.Null(await _context.Orders.FindAsync(1));
        }

        [Fact]
        public async Task UpdateContractStatus_Approved_SetsOrderReadyForDelivery_ReturnsOk()
        {
            var order = CreateValidOrder(2);
            var contract = new Contract { ContractId = 2, OrderId = 2, Order = order, ContractNumber = "C2", Status = "P", PaymentStatus = "P" };
            _context.Orders.Add(order);
            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();

            var req = new UpdateStatusRequest { Status = "Approved" };
            var result = await _controller.UpdateContractStatus(2, req);
            
            Assert.IsType<OkObjectResult>(result);
            
            var updatedOrder = await _context.Orders.FindAsync(2);
            Assert.Equal("ReadyForDelivery", updatedOrder.Status);
            
            var updatedContract = await _context.Contracts.FindAsync(2);
            Assert.Equal("Approved", updatedContract.Status);
        }

        [Fact]
        public async Task UpdateContractStatus_OtherStatus_UpdatesBoth_ReturnsOk()
        {
            var order = CreateValidOrder(3);
            var contract = new Contract { ContractId = 3, OrderId = 3, Order = order, ContractNumber = "C3", Status = "P", PaymentStatus = "P" };
            _context.Orders.Add(order);
            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();

            var req = new UpdateStatusRequest { Status = "CustomStatus" };
            var result = await _controller.UpdateContractStatus(3, req);
            
            Assert.IsType<OkObjectResult>(result);
            
            var updatedOrder = await _context.Orders.FindAsync(3);
            Assert.Equal("CustomStatus", updatedOrder.Status);
        }
    }
}
