using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ev_dealer_reporting.Services;

public class UserDataService : IUserDataService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<UserDataService> _logger;

    public UserDataService(HttpClient httpClient, IConfiguration configuration, ILogger<UserDataService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;

        var userServiceUrl = _configuration["Services:UserService"] ?? "http://localhost:7001";
        _httpClient.BaseAddress = new Uri(userServiceUrl);
        _httpClient.Timeout = TimeSpan.FromSeconds(30);
    }

    public async Task<UserDataDto?> GetUserByIdAsync(int userId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/users/{userId}");
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to fetch user {UserId} from UserService: {StatusCode}", userId, response.StatusCode);
                return null;
            }

            var jsonContent = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonContent);
            JsonElement root = doc.RootElement;

            // Handle different response formats
            JsonElement userElement;
            if (root.TryGetProperty("user", out var userProp))
            {
                userElement = userProp;
            }
            else if (root.TryGetProperty("User", out var userProp2))
            {
                userElement = userProp2;
            }
            else
            {
                userElement = root;
            }

            return new UserDataDto
            {
                Id = userElement.TryGetProperty("id", out var id) ? id.GetInt32() : userId,
                FullName = userElement.TryGetProperty("fullName", out var fn) ? fn.GetString() ?? "" : "",
                Username = userElement.TryGetProperty("username", out var un) ? un.GetString() ?? "" : "",
                Email = userElement.TryGetProperty("email", out var em) ? em.GetString() ?? "" : "",
                Role = userElement.TryGetProperty("role", out var rl) ? rl.GetString() ?? "" : "",
                IsActive = userElement.TryGetProperty("isActive", out var ia) && ia.GetBoolean(),
                DealerId = userElement.TryGetProperty("dealerId", out var did) && did.ValueKind != JsonValueKind.Null ? did.GetInt32() : null
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching user {UserId} from UserService", userId);
            return null;
        }
    }

    public async Task<List<UserDataDto>> GetUsersAsync()
    {
        try
        {
            // Thử lấy từ internal endpoint trước (không cần auth)
            var response = await _httpClient.GetAsync("/api/internal/users");
            if (!response.IsSuccessStatusCode)
            {
                // Fallback: thử endpoint /api/users (yêu cầu Admin role)
                response = await _httpClient.GetAsync("/api/users");
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Failed to fetch users from UserService: {StatusCode}", response.StatusCode);
                    return new List<UserDataDto>();
                }
            }

            var jsonContent = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonContent);
            JsonElement root = doc.RootElement;

            // Handle different response formats
            // UserService trả về UserListResult: { Success, Message, Users }
            JsonElement usersElement;
            if (root.TryGetProperty("users", out var usersProp))
            {
                usersElement = usersProp;
            }
            else if (root.TryGetProperty("Users", out var usersProp2))
            {
                usersElement = usersProp2;
            }
            else if (root.ValueKind == JsonValueKind.Array)
            {
                usersElement = root;
            }
            else
            {
                // Nếu không tìm thấy, có thể response format khác
                _logger.LogWarning("Unexpected response format from UserService /api/users. Root: {RootKind}", root.ValueKind);
                return new List<UserDataDto>();
            }

            var users = new List<UserDataDto>();
            if (usersElement.ValueKind == JsonValueKind.Array)
            {
                foreach (var userElement in usersElement.EnumerateArray())
                {
                    users.Add(new UserDataDto
                    {
                        Id = userElement.TryGetProperty("id", out var id) ? id.GetInt32() : 0,
                        FullName = userElement.TryGetProperty("fullName", out var fn) ? fn.GetString() ?? "" : "",
                        Username = userElement.TryGetProperty("username", out var un) ? un.GetString() ?? "" : "",
                        Email = userElement.TryGetProperty("email", out var em) ? em.GetString() ?? "" : "",
                        Role = userElement.TryGetProperty("role", out var rl) ? rl.GetString() ?? "" : "",
                        IsActive = userElement.TryGetProperty("isActive", out var ia) && ia.GetBoolean(),
                        DealerId = userElement.TryGetProperty("dealerId", out var did) && did.ValueKind != JsonValueKind.Null ? did.GetInt32() : null
                    });
                }
            }

            return users;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching users from UserService");
            return new List<UserDataDto>();
        }
    }
}

