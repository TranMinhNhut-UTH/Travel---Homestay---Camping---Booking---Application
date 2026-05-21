using NotificationService.DTOs;
using NotificationService.Services;
using Serilog;
using System.Text.Json;

namespace NotificationService.Consumers;

public class SaleCompletedConsumer
{
    private readonly IFcmService _fcmService;

    public SaleCompletedConsumer(IFcmService fcmService)
    {
        _fcmService = fcmService;
    }

    public async Task HandleAsync(string message)
    {
        try
        {
            var saleEvent = JsonSerializer.Deserialize<SaleCompletedEvent>(message);
            if (saleEvent == null)
            {
                Log.Warning("Failed to deserialize SaleCompletedEvent from message: {Message}", message);
                return;
            }

            Log.Information("Processing SaleCompletedEvent for Order: {OrderId}", saleEvent.OrderId);

            // Check if device token is available
            if (string.IsNullOrWhiteSpace(saleEvent.DeviceToken))
            {
                Log.Warning("No device token found for Order: {OrderId}. Skipping push notification.", saleEvent.OrderId);
                return;
            }

            // Send push notification
            var title = "🎉 Đơn hàng đã hoàn tất!";
            var body = $"Đơn hàng #{saleEvent.OrderId} của bạn đã được xử lý. Xe {saleEvent.VehicleModel} - Tổng: {saleEvent.TotalPrice:C}. Cảm ơn bạn đã tin tưởng!";
            var data = new Dictionary<string, string>
            {
                { "type", "sale" },
                { "orderId", saleEvent.OrderId },
                { "vehicleModel", saleEvent.VehicleModel },
                { "totalPrice", saleEvent.TotalPrice.ToString("F2") }
            };

            var success = await _fcmService.SendNotificationAsync(
                saleEvent.DeviceToken,
                title,
                body,
                data
            );

            if (success)
            {
                Log.Information("Order confirmation push notification sent for Order: {OrderId}", saleEvent.OrderId);
            }
            else
            {
                Log.Error("Failed to send order confirmation push notification for Order: {OrderId}", saleEvent.OrderId);
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error processing SaleCompletedEvent");
        }
    }
}
