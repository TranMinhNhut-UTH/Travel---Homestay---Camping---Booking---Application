using NotificationService.Services;

namespace SalesService.Tests;

public class NotificationServiceTests
{
    private readonly FakeFcmService _service = new();

    [Fact]
    public async Task SendNotification_Should_Succeed_WhenDeviceTokenProvided()
    {
        var result = await _service.SendNotificationAsync("device-token", "Title", "Body");

        Assert.True(result);
    }

    [Fact]
    public async Task SendNotification_Should_Fail_WhenDeviceTokenEmpty()
    {
        var result = await _service.SendNotificationAsync(" ", "Title", "Body");

        Assert.False(result);
    }

    [Fact]
    public async Task SendMulticast_Should_Fail_WhenTokenListEmpty()
    {
        var result = await _service.SendMulticastAsync([], "Title", "Body");

        Assert.False(result);
    }

    [Fact]
    public async Task SubscribeToTopic_Should_Fail_WhenTopicEmpty()
    {
        var result = await _service.SubscribeToTopicAsync("device-token", "");

        Assert.False(result);
    }
}
