# Simple Test - Send Order Email
# Just send the test order without checking prerequisites

Write-Host "Sending Test Order..." -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Change email to your real email
$customerEmail = "duytest@example.com"
$customerName = "Duy Test Order"

$testOrder = @{
    customerName = $customerName
    customerEmail = $customerEmail
    vehicleModel = "VinFast VF 8 Plus"
    totalAmount = 950000000
    paymentMethod = "Bank Transfer"
    quantity = 1
}

Write-Host "Order Details:" -ForegroundColor Yellow
Write-Host "  Customer: $customerName" -ForegroundColor White
Write-Host "  Email: $customerEmail" -ForegroundColor White
Write-Host "  Vehicle: VinFast VF 8 Plus" -ForegroundColor White
Write-Host "  Amount: 950,000,000 VND" -ForegroundColor White
Write-Host ""

$body = $testOrder | ConvertTo-Json

Write-Host "Calling API..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5003/api/orders/complete" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Green
    Write-Host "Order ID: $($response.orderId)" -ForegroundColor Cyan
    Write-Host "Message: $($response.message)" -ForegroundColor White
    Write-Host ""
    Write-Host "Check your email: $customerEmail" -ForegroundColor Yellow
    Write-Host ""
    
    # Open RabbitMQ UI
    Start-Process "http://localhost:15672"
    Write-Host "RabbitMQ UI opened (guest/guest)" -ForegroundColor Gray
    
} catch {
    Write-Host ""
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host "======================================" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure these are running:" -ForegroundColor Yellow
    Write-Host "  1. RabbitMQ (docker)" -ForegroundColor White
    Write-Host "  2. NotificationService (port 5051)" -ForegroundColor White
    Write-Host "  3. SalesService (port 5003)" -ForegroundColor White
    Write-Host ""
}

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
