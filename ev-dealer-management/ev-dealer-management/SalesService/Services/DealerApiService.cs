using System.Net.Http.Json;
using SalesService.DTOs;

namespace SalesService.Services;

public class DealerApiService : IDealerApiService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<DealerApiService> _logger;
    private readonly string _dealerServiceBaseUrl;

    public DealerApiService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<DealerApiService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _dealerServiceBaseUrl = configuration["DealerService:BaseUrl"] 
            ?? "http://localhost:5001"; // Default port for Dealer Service
    }

    public async Task<DealerReservationDto?> GetDealerReservationByIdAsync(int dealerReservationId)
    {
        try
        {
            var url = $"{_dealerServiceBaseUrl}/api/processed-reservations/{dealerReservationId}";
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var dealerReservation = await response.Content.ReadFromJsonAsync<DealerReservationDto>();
                return dealerReservation;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                _logger.LogWarning("Dealer reservation {DealerReservationId} not found", dealerReservationId);
                return null;
            }
            else
            {
                _logger.LogError("Error fetching dealer reservation {DealerReservationId}: {StatusCode}",
                    dealerReservationId, response.StatusCode);
                return null;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception while fetching dealer reservation {DealerReservationId}",
                dealerReservationId);
            return null;
        }
    }

    public async Task<DealerReservationDto?> GetDealerReservationByReservationIdAsync(int reservationId)
    {
        try
        {
            var url = $"{_dealerServiceBaseUrl}/api/processed-reservations?reservationId={reservationId}";
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var dealerReservations = await response.Content.ReadFromJsonAsync<List<DealerReservationDto>>();
                return dealerReservations?.FirstOrDefault();
            }
            else
            {
                _logger.LogError("Error fetching dealer reservation by reservationId {ReservationId}: {StatusCode}",
                    reservationId, response.StatusCode);
                return null;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception while fetching dealer reservation by reservationId {ReservationId}",
                reservationId);
            return null;
        }
    }
}




