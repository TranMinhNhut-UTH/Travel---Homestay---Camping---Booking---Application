using SalesService.DTOs;

namespace SalesService.Services;

public interface IDealerApiService
{
    Task<DealerReservationDto?> GetDealerReservationByIdAsync(int dealerReservationId);
    Task<DealerReservationDto?> GetDealerReservationByReservationIdAsync(int reservationId);
}




