using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;

namespace SalesService.Tests;

public class UserServiceTests : IDisposable
{
    private const string Password = "P@ssw0rd!";
    private readonly UserDbContext _db;
    private readonly Mock<IEmailService> _emailService = new();
    private readonly UserServiceImpl _service;

    public UserServiceTests()
    {
        var options = new DbContextOptionsBuilder<UserDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _db = new UserDbContext(options);

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "UnitTestSecretKeyWithAtLeastThirtyTwoCharacters!",
                ["Jwt:Issuer"] = "unit-tests",
                ["Jwt:Audience"] = "unit-tests",
            })
            .Build();

        _service = new UserServiceImpl(_db, configuration, _emailService.Object);
    }

    [Fact]
    public async Task Login_Should_ReturnToken_WhenCredentialValid()
    {
        await AddUserAsync("admin", Password, isActive: true);

        var result = await _service.LoginAsync(new LoginRequest("admin", Password));

        Assert.True(result.Success);
        Assert.False(string.IsNullOrWhiteSpace(result.Token));
        Assert.Equal("admin", result.User?.Username);
    }

    [Fact]
    public async Task Login_Should_Fail_WhenPasswordInvalid()
    {
        await AddUserAsync("admin", Password, isActive: true);

        var result = await _service.LoginAsync(new LoginRequest("admin", "wrong-password"));

        Assert.False(result.Success);
        Assert.Null(result.Token);
    }

    [Fact]
    public async Task Login_Should_Fail_WhenAccountInactive()
    {
        await AddUserAsync("pending", Password, isActive: false);

        var result = await _service.LoginAsync(new LoginRequest("pending", Password));

        Assert.False(result.Success);
        Assert.Null(result.Token);
    }

    [Fact]
    public async Task Register_Should_Fail_WhenUsernameAlreadyExists()
    {
        await AddUserAsync("existing", Password, isActive: true);
        var request = new RegisterRequest(
            "existing", "new@example.com", "New User", Password, "DealerStaff", null);

        var result = await _service.RegisterAsync(request);

        Assert.False(result.Success);
        Assert.Contains("Username already exists", result.Message);
        Assert.Single(await _db.Users.ToListAsync());
    }

    private async Task AddUserAsync(string username, string password, bool isActive)
    {
        _db.Users.Add(new User
        {
            Username = username,
            Email = $"{username}@example.com",
            FullName = username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = "Admin",
            IsActive = isActive,
        });
        await _db.SaveChangesAsync();
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }
}
