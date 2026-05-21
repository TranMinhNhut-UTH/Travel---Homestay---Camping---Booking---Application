using CustomerService.DTOs;
using CustomerService.Models;

namespace CustomerService.Services
{
    public interface ITestDriveService
    {
        Task<IEnumerable<TestDriveDto>> GetAllTestDrivesAsync(); // New method
        Task<TestDriveDto> CreateTestDriveAsync(CreateTestDriveRequest request);
        Task<TestDriveDto?> GetTestDriveByIdAsync(int id);
        Task<IEnumerable<TestDriveDto>> GetTestDrivesByCustomerIdAsync(int customerId);
        Task<TestDriveDto?> UpdateTestDriveAsync(int id, UpdateTestDriveRequest request);
        Task<bool> DeleteTestDriveAsync(int id);
    }
}
