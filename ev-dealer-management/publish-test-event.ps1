# Quick test: Publish a vehicle reservation event to RabbitMQ manually
# This simulates VehicleService publishing an event

param(
    [string]$DeviceToken = "TEST_DEVICE_TOKEN_123",
    [string]$CustomerName = "Nguyễn Văn A",
    [string]$VehicleName = "Tesla Model 3"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Manual RabbitMQ Event Publisher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if RabbitMQ Management plugin is available
try {
    $rabbitMQBase = "http://localhost:15672/api"
    $auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("guest:guest"))
    $headers = @{
        "Authorization" = "Basic $auth"
        "Content-Type" = "application/json"
    }

    # Create test event payload
    $event = @{
        vehicleId = 1
        vehicleName = $VehicleName
        customerName = $CustomerName
        customerEmail = "test@example.com"
        customerPhone = "0123456789"
        colorVariantId = $null
        colorVariantName = $null
        quantity = 1
        notes = "Test reservation from manual script"
        reservedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        deviceToken = $DeviceToken
    } | ConvertTo-Json

    Write-Host "`n[Payload]" -ForegroundColor Yellow
    Write-Host $event -ForegroundColor Gray

    # Publish to vehicle.reserved queue
    $publishBody = @{
        properties = @{}
        routing_key = "vehicle.reserved"
        payload = $event
        payload_encoding = "string"
    } | ConvertTo-Json -Depth 5

    Write-Host "`n[Publishing to RabbitMQ]" -ForegroundColor Yellow
    Write-Host "  Queue: vehicle.reserved" -ForegroundColor White
    
    $response = Invoke-RestMethod -Uri "$rabbitMQBase/exchanges/%2F/amq.default/publish" `
        -Method Post `
        -Headers $headers `
        -Body $publishBody

    if ($response.routed) {
        Write-Host "  ✅ Event published successfully!" -ForegroundColor Green
        Write-Host "`n[Next Steps]" -ForegroundColor Yellow
        Write-Host "  1. Check NotificationService logs" -ForegroundColor White
        Write-Host "  2. Verify push notification was sent" -ForegroundColor White
        Write-Host "  3. Check browser for notification popup" -ForegroundColor White
    } else {
        Write-Host "  ⚠️  Event published but not routed to any queue" -ForegroundColor Yellow
        Write-Host "     Make sure NotificationService is running and consuming from 'vehicle.reserved' queue" -ForegroundColor Gray
    }

} catch {
    Write-Host "`n❌ Failed to publish event" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "`nTroubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Make sure RabbitMQ is running: docker start rabbitmq" -ForegroundColor White
    Write-Host "  2. Wait 10 seconds for RabbitMQ to fully start" -ForegroundColor White
    Write-Host "  3. Try accessing http://localhost:15672 (guest/guest)" -ForegroundColor White
    Write-Host "  4. Make sure NotificationService is running" -ForegroundColor White
}

Write-Host ""
