using Microsoft.EntityFrameworkCore;
using VehicleService.Data;
using VehicleService.DTOs;
using Xunit;

namespace VehicleService.Tests;

public class VehicleServiceTests
{
    private static ApplicationDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlite("Data Source=:memory:")
            .Options;

        var context = new ApplicationDbContext(options);
        context.Database.OpenConnection();
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task GetVehicleByIdAsync_ReturnsNull_WhenVehicleMissing()
    {
        await using var context = CreateContext();
        var service = new VehicleService.Services.VehicleService(context);

        var result = await service.GetVehicleByIdAsync(999);

        Assert.Null(result);
    }

    [Fact]
    public async Task CreateVehicleAsync_PersistsVehicle_WhenPayloadIsValid()
    {
        await using var context = CreateContext();
        var service = new VehicleService.Services.VehicleService(context);

        var dto = new CreateVehicleDto
        {
            Model = "Test EV",
            Type = "sedan",
            Price = 10000,
            BatteryCapacity = 70,
            Range = 300,
            StockQuantity = 3,
            Description = "Created in test",
            DealerId = 1
        };

        var result = await service.CreateVehicleAsync(dto, null);

        Assert.NotNull(result);
        Assert.Equal("Test EV", result.Model);
        Assert.Equal(1, result.DealerId);
    }

    [Fact]
    public async Task UpdateVehicleAsync_ReturnsNull_WhenVehicleMissing()
    {
        await using var context = CreateContext();
        var service = new VehicleService.Services.VehicleService(context);

        var result = await service.UpdateVehicleAsync(999, new UpdateVehicleDto
        {
            Model = "Missing",
            Type = "sedan",
            Price = 1000,
            BatteryCapacity = 60,
            Range = 250,
            StockQuantity = 1,
            DealerId = 1
        });

        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteVehicleAsync_ReturnsFalse_WhenVehicleMissing()
    {
        await using var context = CreateContext();
        var service = new VehicleService.Services.VehicleService(context);

        var result = await service.DeleteVehicleAsync(999);

        Assert.False(result);
    }

    [Fact]
    public async Task CreateDealerAsync_ReturnsDealerWithZeroVehicleCount()
    {
        await using var context = CreateContext();
        var service = new VehicleService.Services.VehicleService(context);

        var dto = new CreateDealerDto
        {
            Name = "Test Dealer",
            Region = "HCM",
            Contact = "0901111111",
            Email = "test@example.com",
            Address = "123 Test"
        };

        var result = await service.CreateDealerAsync(dto);

        Assert.NotNull(result);
        Assert.Equal(0, result.VehicleCount);
        Assert.Equal("Test Dealer", result.Name);
    }
}
