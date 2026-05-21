using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using Serilog;

namespace NotificationService.Services;

public class FirebaseFcmService : IFcmService
{
    private readonly FirebaseMessaging _messaging;
    private readonly string _projectId;

    public FirebaseFcmService(IConfiguration configuration)
    {
        var credentialPath = configuration["Firebase:CredentialPath"] 
            ?? throw new ArgumentNullException("Firebase:CredentialPath not configured");
        
        _projectId = configuration["Firebase:ProjectId"] 
            ?? throw new ArgumentNullException("Firebase:ProjectId not configured");

        try
        {
            // Initialize Firebase App if not already initialized
            if (FirebaseApp.DefaultInstance == null)
            {
                FirebaseApp.Create(new AppOptions
                {
                    Credential = GoogleCredential.FromFile(credentialPath),
                    ProjectId = _projectId
                });

                Log.Information("Firebase App initialized successfully for project: {ProjectId}", _projectId);
            }

            _messaging = FirebaseMessaging.DefaultInstance;
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Failed to initialize Firebase App");
            throw;
        }
    }

    public async Task<bool> SendNotificationAsync(string deviceToken, string title, string body, Dictionary<string, string>? data = null)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(deviceToken))
            {
                Log.Warning("Device token is null or empty");
                return false;
            }

            var message = new Message
            {
                Token = deviceToken,
                Notification = new Notification
                {
                    Title = title,
                    Body = body
                },
                Data = data,
                // Add web push config for better browser support
                Webpush = new WebpushConfig
                {
                    Notification = new WebpushNotification
                    {
                        Title = title,
                        Body = body,
                        Icon = "/logo.png"
                    }
                }
            };

            var response = await _messaging.SendAsync(message);
            
            Log.Information("FCM notification sent successfully. MessageId: {MessageId}, Token: {Token}", 
                response, MaskToken(deviceToken));
            
            return true;
        }
        catch (FirebaseMessagingException ex)
        {
            Log.Error(ex, "Firebase Messaging error. Code: {ErrorCode}, Token: {Token}", 
                ex.MessagingErrorCode, MaskToken(deviceToken));
            return false;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Failed to send FCM notification to token: {Token}", MaskToken(deviceToken));
            return false;
        }
    }

    public async Task<bool> SendToTopicAsync(string topic, string title, string body, Dictionary<string, string>? data = null)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(topic))
            {
                Log.Warning("Topic is null or empty");
                return false;
            }

            var message = new Message
            {
                Topic = topic,
                Notification = new Notification
                {
                    Title = title,
                    Body = body
                },
                Data = data,
                Webpush = new WebpushConfig
                {
                    Notification = new WebpushNotification
                    {
                        Title = title,
                        Body = body,
                        Icon = "/logo.png"
                    }
                }
            };

            var response = await _messaging.SendAsync(message);
            
            Log.Information("FCM topic notification sent successfully. MessageId: {MessageId}, Topic: {Topic}", 
                response, topic);
            
            return true;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Failed to send FCM notification to topic: {Topic}", topic);
            return false;
        }
    }

    public async Task<bool> SendMulticastAsync(List<string> deviceTokens, string title, string body, Dictionary<string, string>? data = null)
    {
        try
        {
            if (deviceTokens == null || !deviceTokens.Any())
            {
                Log.Warning("Device tokens list is null or empty");
                return false;
            }

            var message = new MulticastMessage
            {
                Tokens = deviceTokens,
                Notification = new Notification
                {
                    Title = title,
                    Body = body
                },
                Data = data,
                Webpush = new WebpushConfig
                {
                    Notification = new WebpushNotification
                    {
                        Title = title,
                        Body = body,
                        Icon = "/logo.png"
                    }
                }
            };

            var response = await _messaging.SendEachForMulticastAsync(message);
            
            Log.Information("FCM multicast sent. Success: {SuccessCount}, Failed: {FailureCount}, Total: {TotalCount}", 
                response.SuccessCount, response.FailureCount, deviceTokens.Count);
            
            // Log failed tokens if any
            if (response.FailureCount > 0)
            {
                for (int i = 0; i < response.Responses.Count; i++)
                {
                    if (!response.Responses[i].IsSuccess)
                    {
                        Log.Warning("Failed to send to token {TokenIndex}: {Exception}", 
                            i, response.Responses[i].Exception?.Message);
                    }
                }
            }

            return response.SuccessCount > 0;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Failed to send FCM multicast notification");
            return false;
        }
    }

    public async Task<bool> SubscribeToTopicAsync(string deviceToken, string topic)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(deviceToken) || string.IsNullOrWhiteSpace(topic))
            {
                Log.Warning("Device token or topic is null or empty");
                return false;
            }

            var response = await _messaging.SubscribeToTopicAsync(new List<string> { deviceToken }, topic);
            
            if (response.SuccessCount > 0)
            {
                Log.Information("Device token subscribed to topic: {Topic}", topic);
                return true;
            }
            else
            {
                Log.Warning("Failed to subscribe to topic: {Topic}. Errors: {Errors}", 
                    topic, response.Errors?.FirstOrDefault()?.Reason);
                return false;
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Failed to subscribe device token to topic: {Topic}", topic);
            return false;
        }
    }

    public async Task<bool> UnsubscribeFromTopicAsync(string deviceToken, string topic)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(deviceToken) || string.IsNullOrWhiteSpace(topic))
            {
                Log.Warning("Device token or topic is null or empty");
                return false;
            }

            var response = await _messaging.UnsubscribeFromTopicAsync(new List<string> { deviceToken }, topic);
            
            if (response.SuccessCount > 0)
            {
                Log.Information("Device token unsubscribed from topic: {Topic}", topic);
                return true;
            }
            else
            {
                Log.Warning("Failed to unsubscribe from topic: {Topic}. Errors: {Errors}", 
                    topic, response.Errors?.FirstOrDefault()?.Reason);
                return false;
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Failed to unsubscribe device token from topic: {Topic}", topic);
            return false;
        }
    }

    /// <summary>
    /// Mask device token for logging (show first and last 8 chars only)
    /// </summary>
    private string MaskToken(string token)
    {
        if (string.IsNullOrWhiteSpace(token) || token.Length < 20)
            return "***";
        
        return $"{token[..8]}...{token[^8..]}";
    }
}
