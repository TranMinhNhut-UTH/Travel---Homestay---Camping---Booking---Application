namespace NotificationService.Services;

public class FakeFcmService : IFcmService
{
    public Task<bool> SendNotificationAsync(string deviceToken, string title, string body, Dictionary<string, string>? data = null)
    {
        return Task.FromResult(!string.IsNullOrWhiteSpace(deviceToken));
    }

    public Task<bool> SendToTopicAsync(string topic, string title, string body, Dictionary<string, string>? data = null)
    {
        return Task.FromResult(!string.IsNullOrWhiteSpace(topic));
    }

    public Task<bool> SendMulticastAsync(List<string> deviceTokens, string title, string body, Dictionary<string, string>? data = null)
    {
        return Task.FromResult(deviceTokens is { Count: > 0 });
    }

    public Task<bool> SubscribeToTopicAsync(string deviceToken, string topic)
    {
        return Task.FromResult(!string.IsNullOrWhiteSpace(deviceToken) && !string.IsNullOrWhiteSpace(topic));
    }

    public Task<bool> UnsubscribeFromTopicAsync(string deviceToken, string topic)
    {
        return Task.FromResult(!string.IsNullOrWhiteSpace(deviceToken) && !string.IsNullOrWhiteSpace(topic));
    }
}
