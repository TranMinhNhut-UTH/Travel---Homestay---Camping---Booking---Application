using ev_dealer_reporting.DTOs;
using System;
using System.Threading.Tasks;

namespace ev_dealer_reporting.Services
{
    public interface IForecastingService
    {
        Task<DemandForecastDto> GenerateDemandForecastAsync(DateTime? from, DateTime? to, int periodsToForecast = 3);
    }
}
