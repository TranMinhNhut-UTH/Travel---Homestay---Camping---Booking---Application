namespace NotificationService.Services;

public interface IFcmService
{
    /// <summary>
    /// Send notification to a specific device token
    /// </summary>
    Task<bool> SendNotificationAsync(string deviceToken, string title, string body, Dictionary<string, string>? data = null);

    /// <summary>
    /// Send notification to a topic (broadcast to all subscribers)
    /// </summary>
    Task<bool> SendToTopicAsync(string topic, string title, string body, Dictionary<string, string>? data = null);

    /// <summary>
    /// Send notification to multiple device tokens at once
    /// </summary>
    Task<bool> SendMulticastAsync(List<string> deviceTokens, string title, string body, Dictionary<string, string>? data = null);

    /// <summary>
    /// Subscribe a device token to a topic
    /// </summary>
    Task<bool> SubscribeToTopicAsync(string deviceToken, string topic);

    /// <summary>
    /// Unsubscribe a device token from a topic
    /// </summary>
    Task<bool> UnsubscribeFromTopicAsync(string deviceToken, string topic);
}
