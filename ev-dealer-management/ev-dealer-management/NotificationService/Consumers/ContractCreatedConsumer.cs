using NotificationService.DTOs;
using NotificationService.Services;
using Serilog;
using System.Text.Json;

namespace NotificationService.Consumers;

public class ContractCreatedConsumer
{
    private readonly IFcmService _fcmService;

    public ContractCreatedConsumer(IFcmService fcmService)
    {
        _fcmService = fcmService;
    }

    public async Task HandleAsync(string message)
    {
        try
        {
            Log.Debug("📥 Received ContractCreated event: {Message}", message);
            
            var contractEvent = JsonSerializer.Deserialize<ContractCreatedEvent>(message);
            if (contractEvent == null)
            {
                Log.Warning("⚠️ Failed to deserialize ContractCreatedEvent from message: {Message}", message);
                return;
            }

            Log.Information("📄 Contract #{ContractNumber} - Order: {OrderId}, Customer: {CustomerId}, Amount: {TotalAmount:N0} VND, Status: {Status}",
                contractEvent.ContractNumber, contractEvent.OrderId, contractEvent.CustomerId, contractEvent.TotalAmount, contractEvent.Status);

            // Prepare notification content
            var title = "📋 Hợp đồng mới đã được tạo!";
            var body = $"Hợp đồng #{contractEvent.ContractNumber} cho đơn hàng #{contractEvent.OrderId} đã được tạo. Tổng giá trị: {contractEvent.TotalAmount:N0} VND.";
            var data = new Dictionary<string, string>
            {
                { "type", "contract" },
                { "contractId", contractEvent.ContractId },
                { "contractNumber", contractEvent.ContractNumber },
                { "orderId", contractEvent.OrderId.ToString() },
                { "customerId", contractEvent.CustomerId.ToString() },
                { "totalAmount", contractEvent.TotalAmount.ToString("F2") },
                { "status", contractEvent.Status }
            };

            // Always log the notification
            Log.Information("📢 [THÔNG BÁO HỢP ĐỒNG] {Title} | {Body}", title, body);

            // Try to send push notification if device token is available
            if (!string.IsNullOrWhiteSpace(contractEvent.DeviceToken))
            {
                var success = await _fcmService.SendNotificationAsync(
                    contractEvent.DeviceToken,
                    title,
                    body,
                    data
                );

                if (success)
                {
                    Log.Information("✅ Push notification sent successfully for Contract: {ContractNumber}", contractEvent.ContractNumber);
                }
                else
                {
                    Log.Warning("⚠️ Push notification failed for Contract: {ContractNumber} (notification logged only)", contractEvent.ContractNumber);
                }
            }
            else
            {
                Log.Information("ℹ️ No device token for Contract {ContractNumber}. Notification logged only (no push sent).", contractEvent.ContractNumber);
            }

            Log.Debug("✅ ContractCreated event processed successfully for Contract: {ContractNumber}", contractEvent.ContractNumber);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "❌ Error processing ContractCreatedEvent");
        }
    }
}

