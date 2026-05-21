using CustomerService.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CustomerService.Services
{
    public interface ICustomerService
    {
        Task<IEnumerable<CustomerDto>> GetAllCustomersAsync();
        Task<CustomerDto?> GetCustomerByIdAsync(int id);
        Task<CustomerDto> CreateCustomerAsync(CreateCustomerRequest request);
        Task<CustomerDto?> UpdateCustomerAsync(int id, UpdateCustomerRequest request);
        Task<bool> DeleteCustomerAsync(int id);

        // Methods for Test Drive Bookings
        Task<IEnumerable<TestDriveDto>> GetTestDrivesByCustomerIdAsync(int customerId);
        Task<TestDriveDto> CreateTestDriveAsync(int customerId, CreateTestDriveRequest request);
        Task<TestDriveDto?> UpdateTestDriveAsync(int id, UpdateTestDriveRequest request);
        Task<bool> CancelTestDriveAsync(int id);

        // Methods for Complaints
        Task<IEnumerable<ComplaintDto>> GetComplaintsByCustomerIdAsync(int customerId);
        Task<ComplaintDto> CreateComplaintAsync(int customerId, CreateComplaintRequest request);
        Task<ComplaintDto?> UpdateComplaintAsync(int id, UpdateComplaintRequest request);
        Task<bool> ResolveComplaintAsync(int id);

        // Methods for handling Vehicle Reservations
        Task<CustomerDto?> GetCustomerByEmailAsync(string email);
        Task<CustomerDto> CreateOrUpdateCustomerFromReservationAsync(VehicleReservedEvent reservationEvent);
    }
}
