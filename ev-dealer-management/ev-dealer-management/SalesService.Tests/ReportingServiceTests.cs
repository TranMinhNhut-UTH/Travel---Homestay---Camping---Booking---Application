using ev_dealer_reporting.Data;
using ev_dealer_reporting.Models;
using ev_dealer_reporting.Services;
using Microsoft.EntityFrameworkCore;

namespace SalesService.Tests;

public class ReportingServiceTests : IDisposable
{
    private readonly ReportingDbContext _db;
    private readonly ForecastingService _service;

    public ReportingServiceTests()
    {
        var options = new DbContextOptionsBuilder<ReportingDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _db = new ReportingDbContext(options);
        _service = new ForecastingService(_db);
    }

    [Fact]
    public async Task GenerateDemandForecast_Should_ReturnNoPoints_WhenHistoryEmpty()
    {
        var result = await _service.GenerateDemandForecastAsync(null, null);

        Assert.Empty(result.ForecastData);
        Assert.Equal(0, result.Summary?.NextPeriodForecast);
        Assert.Equal("Not enough data", result.Summary?.TrendDirection);
    }

    [Fact]
    public async Task GenerateDemandForecast_Should_ReturnNoPoints_WhenOnlyOneMonthExists()
    {
        AddSalesSummary(new DateTime(2026, 1, 1), 10);
        await _db.SaveChangesAsync();

        var result = await _service.GenerateDemandForecastAsync(null, null);

        Assert.Empty(result.ForecastData);
        Assert.Equal("Not enough data", result.Summary?.TrendDirection);
    }

    [Fact]
    public async Task GenerateDemandForecast_Should_CreateRequestedPeriods_WhenHistorySufficient()
    {
        AddSalesSummary(new DateTime(2026, 1, 1), 10);
        AddSalesSummary(new DateTime(2026, 2, 1), 20);
        await _db.SaveChangesAsync();

        var result = await _service.GenerateDemandForecastAsync(null, null, periodsToForecast: 2);

        Assert.Equal(2, result.ForecastData.Count);
        Assert.Equal("2026-03", result.ForecastData[0].Period);
        Assert.Equal(30, result.ForecastData[0].ForecastedValue);
        Assert.Equal(10, result.Summary?.TrendStrength);
    }

    [Fact]
    public async Task GenerateDemandForecast_Should_RespectDateRange()
    {
        AddSalesSummary(new DateTime(2026, 1, 1), 10);
        AddSalesSummary(new DateTime(2026, 2, 1), 20);
        await _db.SaveChangesAsync();

        var result = await _service.GenerateDemandForecastAsync(
            new DateTime(2026, 2, 1), new DateTime(2026, 2, 28));

        Assert.Empty(result.ForecastData);
        Assert.Equal("Not enough data", result.Summary?.TrendDirection);
    }

    private void AddSalesSummary(DateTime date, int totalOrders)
    {
        _db.SalesSummaries.Add(new SalesSummary
        {
            Id = Guid.NewGuid(),
            Date = date,
            DealerId = 1,
            DealerName = "Dealer",
            Region = "South",
            SalespersonId = 1,
            SalespersonName = "Staff",
            TotalOrders = totalOrders,
            TotalRevenue = totalOrders * 100,
            LastUpdatedAt = date,
        });
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }
}
