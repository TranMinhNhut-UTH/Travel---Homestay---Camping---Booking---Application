using ev_dealer_reporting.Data;
using ev_dealer_reporting.DTOs;
using ev_dealer_reporting.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ev_dealer_reporting.Services
{
    public class ForecastingService : IForecastingService
    {
        private readonly ReportingDbContext _db;

        public ForecastingService(ReportingDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Generates a demand forecast using a simple linear regression model based on historical sales data.
        /// </summary>
        public async Task<DemandForecastDto> GenerateDemandForecastAsync(DateTime? from, DateTime? to, int periodsToForecast = 3)
        {
            // 1. Get historical data, grouped by month
            var historicalData = await GetMonthlySalesAsync(from, to);

            // 2. Perform linear regression if there's enough data
            var forecastPoints = new List<ForecastDatapointDto>();
            (double slope, double intercept) = (0, 0);

            if (historicalData.Count >= 2)
            {
                (slope, intercept) = CalculateLinearRegression(historicalData);

                // 3. Generate forecast for the next N periods
                var lastPeriod = historicalData.Max(p => p.Key);
                for (int i = 1; i <= periodsToForecast; i++)
                {
                    var nextPeriodDate = lastPeriod.AddMonths(i);
                    // The 'x' value is the number of months since the first data point
                    var x = (nextPeriodDate.Year - historicalData.Min(p => p.Key.Year)) * 12 + nextPeriodDate.Month - historicalData.Min(p => p.Key.Month);

                    var forecastedValue = slope * x + intercept;

                    forecastPoints.Add(new ForecastDatapointDto
                    {
                        Period = nextPeriodDate.ToString("yyyy-MM"),
                        ForecastedValue = Math.Max(0, Math.Round(forecastedValue)), // Ensure forecast is not negative
                        // Confidence bounds could be added with more advanced stats
                        ConfidenceLowerBound = Math.Max(0, Math.Round(forecastedValue * 0.85)), // Simple 15% bounds
                        ConfidenceUpperBound = Math.Round(forecastedValue * 1.15)
                    });
                }
            }

            // 4. Create summary
            var summary = CreateForecastSummary(slope, forecastPoints);
            
            // 5. Build and return DTO
            var forecastDto = new DemandForecastDto
            {
                Title = "Dự báo nhu cầu bán hàng",
                Description = $"Dự báo cho {periodsToForecast} tháng tới dựa trên dữ liệu bán hàng lịch sử.",
                GeneratedAt = DateTime.UtcNow,
                ForecastData = forecastPoints,
                Summary = summary,
            };

            return forecastDto;
        }

        private async Task<Dictionary<DateTime, double>> GetMonthlySalesAsync(DateTime? from, DateTime? to)
        {
            var query = _db.SalesSummaries.AsQueryable();

            if (from.HasValue)
                query = query.Where(s => s.Date >= from.Value);
            if (to.HasValue)
                query = query.Where(s => s.Date <= to.Value);
            
            // Step 1: Fetch the raw data needed from the database into memory.
            var salesData = await query
                .Select(s => new { s.Date, s.TotalOrders })
                .ToListAsync();

            // Step 2: Perform the grouping and summation in-memory (client-side evaluation).
            var monthlySales = salesData
                .GroupBy(s => new { s.Date.Year, s.Date.Month })
                .Select(g => new
                {
                    Period = new DateTime(g.Key.Year, g.Key.Month, 1),
                    TotalSales = g.Sum(s => (double)s.TotalOrders)
                })
                .OrderBy(r => r.Period)
                .ToDictionary(r => r.Period, r => r.TotalSales);
            
            return monthlySales;
        }
        
        private (double slope, double intercept) CalculateLinearRegression(Dictionary<DateTime, double> data)
        {
            int n = data.Count;
            if (n < 2) return (0, 0);

            var xValues = new List<double>();
            var yValues = data.Values.ToList();
            var firstDate = data.Min(kvp => kvp.Key);

            foreach(var entry in data)
            {
                // x is the number of months from the start
                xValues.Add((entry.Key.Year - firstDate.Year) * 12 + entry.Key.Month - firstDate.Month);
            }

            double sumX = xValues.Sum();
            double sumY = yValues.Sum();
            double sumX2 = xValues.Sum(x => x * x);
            double sumXY = xValues.Zip(yValues, (x, y) => x * y).Sum();

            double slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            double intercept = (sumY - slope * sumX) / n;
            
            return (slope, intercept);
        }

        private ForecastSummaryDto CreateForecastSummary(double slope, List<ForecastDatapointDto> forecastPoints)
        {
            if (!forecastPoints.Any())
            {
                return new ForecastSummaryDto
                {
                    NextPeriodForecast = 0,
                    TrendDirection = "Not enough data",
                    TrendStrength = 0
                };
            }

            string trendDirection;
            if (slope > 5) trendDirection = "Tăng trưởng";
            else if (slope < -5) trendDirection = "Suy giảm";
            else trendDirection = "Ổn định";

            return new ForecastSummaryDto
            {
                NextPeriodForecast = forecastPoints.First().ForecastedValue,
                TrendDirection = trendDirection,
                TrendStrength = Math.Round(slope, 2) // Represent strength as the slope value
            };
        }
    }
}
