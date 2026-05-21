# RabbitMQ Test Message Publisher
# Script này giúp publish test messages đến RabbitMQ queues để test NotificationService

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("sales", "reservation", "testdrive", "all")]
    [string]$EventType = "all",
    
    [Parameter(Mandatory=$false)]
    [string]$Email = "test@gmail.com",
    
    [Parameter(Mandatory=$false)]
    [string]$Phone = "+84901234567"
)

$rabbitMQUrl = "http://localhost:15672"
$username = "guest"
$password = "guest"

# Tạo authorization header
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{
    Authorization = "Basic $auth"
    "Content-Type" = "application/json"
}

function Publish-Message {
    param(
        [string]$QueueName,
        [string]$Payload
    )
    
    $body = @{
        properties = @{}
        routing_key = $QueueName
        payload = $Payload
        payload_encoding = "string"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod `
            -Uri "$rabbitMQUrl/api/exchanges/%2F/amq.default/publish" `
            -Method Post `
            -Headers $headers `
            -Body $body
        
        if ($response.routed -eq $true) {
            Write-Host "✓ Message published to queue: $QueueName" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ Message NOT routed to queue: $QueueName" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "✗ Error publishing to $QueueName : $_" -ForegroundColor Red
        return $false
    }
}

function Test-RabbitMQConnection {
    try {
        $response = Invoke-RestMethod -Uri "$rabbitMQUrl/api/overview" -Headers $headers
        Write-Host "✓ Connected to RabbitMQ: $($response.product) version $($response.rabbitmq_version)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Cannot connect to RabbitMQ at $rabbitMQUrl" -ForegroundColor Red
        Write-Host "  Make sure RabbitMQ is running with Management plugin enabled" -ForegroundColor Yellow
        return $false
    }
}

# Main Script
Write-Host "`n=== RabbitMQ Test Message Publisher ===" -ForegroundColor Cyan
Write-Host "Target: $rabbitMQUrl" -ForegroundColor Gray
Write-Host "Event Type: $EventType`n" -ForegroundColor Gray

# Kiểm tra connection
if (-not (Test-RabbitMQConnection)) {
    exit 1
}

# Publish messages theo event type
$success = $true

if ($EventType -eq "sales" -or $EventType -eq "all") {
    Write-Host "`n--- Publishing Sale Completed Event ---" -ForegroundColor Yellow
    
    $saleMessage = @{
        orderId = "ORD-TEST-$(Get-Random -Minimum 1000 -Maximum 9999)"
        customerEmail = $Email
        customerName = "Test Customer"
        vehicleModel = "Tesla Model 3 Long Range"
        totalPrice = 45000.00
        completedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    } | ConvertTo-Json
    
    Write-Host "Message Payload:" -ForegroundColor Gray
    Write-Host $saleMessage -ForegroundColor DarkGray
    
    $success = $success -and (Publish-Message -QueueName "sales.completed" -Payload $saleMessage)
    Write-Host "→ Expected: Order confirmation email sent to $Email" -ForegroundColor Cyan
}

if ($EventType -eq "reservation" -or $EventType -eq "all") {
    Write-Host "`n--- Publishing Vehicle Reserved Event ---" -ForegroundColor Yellow
    
    $reservationMessage = @{
        reservationId = "RES-TEST-$(Get-Random -Minimum 1000 -Maximum 9999)"
        customerPhone = $Phone
        customerName = "Test Customer"
        vehicleModel = "Tesla Model Y Performance"
        colorName = "Pearl White Multi-Coat"
        reservedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    } | ConvertTo-Json
    
    Write-Host "Message Payload:" -ForegroundColor Gray
    Write-Host $reservationMessage -ForegroundColor DarkGray
    
    $success = $success -and (Publish-Message -QueueName "vehicle.reserved" -Payload $reservationMessage)
    Write-Host "→ Expected: Reservation confirmation SMS sent to $Phone" -ForegroundColor Cyan
}

if ($EventType -eq "testdrive" -or $EventType -eq "all") {
    Write-Host "`n--- Publishing Test Drive Scheduled Event ---" -ForegroundColor Yellow
    
    $testDriveDate = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss")
    
    $testDriveMessage = @{
        testDriveId = Get-Random -Minimum 100 -Maximum 999
        customerEmail = $Email
        customerName = "Test Customer"
        vehicleModel = "Tesla Model S Plaid"
        appointmentDate = $testDriveDate
        vehicleId = Get-Random -Minimum 1 -Maximum 50
    } | ConvertTo-Json
    
    Write-Host "Message Payload:" -ForegroundColor Gray
    Write-Host $testDriveMessage -ForegroundColor DarkGray
    
    $success = $success -and (Publish-Message -QueueName "testdrive.scheduled" -Payload $testDriveMessage)
    Write-Host "→ Expected: Test drive confirmation email sent to $Email" -ForegroundColor Cyan
}

# Summary
Write-Host "`n==================================" -ForegroundColor Cyan
if ($success) {
    Write-Host "✓ All messages published successfully!" -ForegroundColor Green
    Write-Host "`nNext Steps:" -ForegroundColor Yellow
    Write-Host "1. Check NotificationService console logs" -ForegroundColor White
    Write-Host "2. Check your email inbox: $Email" -ForegroundColor White
    Write-Host "3. Check your phone for SMS: $Phone" -ForegroundColor White
    Write-Host "4. View RabbitMQ Management UI: $rabbitMQUrl" -ForegroundColor White
} else {
    Write-Host "✗ Some messages failed to publish" -ForegroundColor Red
    Write-Host "`nTroubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Check if queues exist in RabbitMQ Management UI" -ForegroundColor White
    Write-Host "2. Verify RabbitMQ credentials (guest/guest)" -ForegroundColor White
    Write-Host "3. Ensure NotificationService is running" -ForegroundColor White
}
Write-Host "==================================" -ForegroundColor Cyan

# Usage Examples
<#
.EXAMPLE
.\TestProducer.ps1
Publish all event types with default email/phone

.EXAMPLE
.\TestProducer.ps1 -EventType sales -Email "customer@example.com"
Publish only sale completed event to specific email

.EXAMPLE
.\TestProducer.ps1 -EventType reservation -Phone "+84987654321"
Publish only vehicle reserved event to specific phone

.EXAMPLE
.\TestProducer.ps1 -EventType testdrive -Email "test@gmail.com"
Publish only test drive event

.EXAMPLE
.\TestProducer.ps1 -EventType all -Email "myemail@gmail.com" -Phone "+84901234567"
Publish all events with custom email and phone
#>
