namespace ev_dealer_reporting.Services;

/// <summary>
/// Service để fetch dữ liệu từ UserService
/// </summary>
public interface IUserDataService
{
    Task<UserDataDto?> GetUserByIdAsync(int userId);
    Task<List<UserDataDto>> GetUsersAsync();
}

public class UserDataDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int? DealerId { get; set; }
}

