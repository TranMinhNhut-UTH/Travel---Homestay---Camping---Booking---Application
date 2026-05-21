using NotificationService.DTOs;
using NotificationService.Services;
using Serilog;
using System.Text.Json;

namespace NotificationService.Consumers;

public class VehicleReservedConsumer
{
    private readonly IFcmService _fcmService;

    public VehicleReservedConsumer(IFcmService fcmService)
    {
        _fcmService = fcmService;
    }

    public async Task HandleAsync(string message)
    {
        try
        {
            var reservedEvent = JsonSerializer.Deserialize<VehicleReservedEvent>(message);
            if (reservedEvent == null)
            {
                Log.Warning("Failed to deserialize VehicleReservedEvent from message: {Message}", message);
                return;
            }

            Log.Information("Processing VehicleReservedEvent for Vehicle: {VehicleId}, Customer: {CustomerName}", 
                reservedEvent.VehicleId, reservedEvent.CustomerName);

            // Check if device token is available
            if (string.IsNullOrWhiteSpace(reservedEvent.DeviceToken))
            {
                Log.Warning("No device token found for Vehicle: {VehicleId}, Customer: {CustomerName}. Skipping push notification.", 
                    reservedEvent.VehicleId, reservedEvent.CustomerName);
                return;
            }

            // Send push notification
            var title = "🚗 Đặt xe thành công!";
            var colorInfo = !string.IsNullOrWhiteSpace(reservedEvent.ColorVariantName) 
                ? $" màu {reservedEvent.ColorVariantName}" 
                : "";
            var body = $"Xe {reservedEvent.VehicleName}{colorInfo} (SL: {reservedEvent.Quantity}) đã được đặt thành công. Chúng tôi sẽ liên hệ bạn sớm!";
            var data = new Dictionary<string, string>
            {
                { "type", "orders" },
                { "vehicleId", reservedEvent.VehicleId.ToString() },
                { "vehicleName", reservedEvent.VehicleName },
                { "customerName", reservedEvent.CustomerName },
                { "quantity", reservedEvent.Quantity.ToString() }
            };

            var success = await _fcmService.SendNotificationAsync(
                reservedEvent.DeviceToken,
                title,
                body,
                data
            );

            if (success)
            {
                Log.Information("Reservation confirmation push notification sent for Vehicle: {VehicleId}, Customer: {CustomerName}", 
                    reservedEvent.VehicleId, reservedEvent.CustomerName);
            }
            else
            {
                Log.Error("Failed to send reservation confirmation push notification for Vehicle: {VehicleId}, Customer: {CustomerName}", 
                    reservedEvent.VehicleId, reservedEvent.CustomerName);
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error processing VehicleReservedEvent");
        }
    }
}
