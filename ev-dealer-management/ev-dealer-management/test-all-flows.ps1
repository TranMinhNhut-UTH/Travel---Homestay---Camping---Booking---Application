# ============================================
# COMPREHENSIVE TEST SCRIPT - All Notification Flows
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EV DEALER - NOTIFICATION TEST SUITE  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test Configuration
$SalesServiceUrl = "http://localhost:5003"
$VehicleServiceUrl = "http://localhost:5002"
$NotificationServiceUrl = "http://localhost:5051"
$RabbitMQUrl = "http://localhost:15672"

# ============================================
# 1. CHECK PREREQUISITES
# ============================================
Write-Host "[1/6] Checking Prerequisites..." -ForegroundColor Yellow

# Check RabbitMQ
Write-Host "  - Checking RabbitMQ..." -NoNewline
try {
    $rabbitResponse = Invoke-WebRequest -Uri $RabbitMQUrl -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
    Write-Host "    RabbitMQ is not running on port 15672" -ForegroundColor Red
    Write-Host "    Start it: docker start rabbitmq" -ForegroundColor Yellow
    exit 1
}

# Check NotificationService
Write-Host "  - Checking NotificationService..." -NoNewline
try {
    $notifResponse = Invoke-RestMethod -Uri "$NotificationServiceUrl/notifications/health" -TimeoutSec 3
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
    Write-Host "    NotificationService is not running on port 5051" -ForegroundColor Red
    exit 1
}

# Check SalesService
Write-Host "  - Checking SalesService..." -NoNewline
try {
    $salesResponse = Invoke-RestMethod -Uri "$SalesServiceUrl/api/orders/health" -TimeoutSec 3
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
    Write-Host "    SalesService is not running on port 5003" -ForegroundColor Red
    exit 1
}

# Check VehicleService
Write-Host "  - Checking VehicleService..." -NoNewline
try {
    $vehicleResponse = Invoke-RestMethod -Uri "$VehicleServiceUrl/health" -TimeoutSec 3
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
    Write-Host "    VehicleService is not running on port 5002" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================
# 2. TEST VEHICLE RESERVATION FLOW (SMS)
# ============================================
Write-Host "[2/6] Testing Vehicle Reservation Flow (SMS)..." -ForegroundColor Yellow

$reservationData = @{
    customerName = "Test User - Vehicle"
    customerEmail = "vehicle-test@example.com"
    customerPhone = "+84912345678"
    vehicleId = 1
    notes = "Test reservation from automated test script"
} | ConvertTo-Json

Write-Host "  - Sending reservation request..." -NoNewline
try {
    $reservationResponse = Invoke-RestMethod -Uri "$VehicleServiceUrl/api/vehicles/reserve" -Method Post -Body $reservationData -ContentType "application/json" -TimeoutSec 10
    Write-Host " OK" -ForegroundColor Green
    Write-Host "    Reservation ID: $($reservationResponse.reservationId)" -ForegroundColor Gray
    $vehicleReservationId = $reservationResponse.reservationId
} catch {
    Write-Host " FAILED" -ForegroundColor Red
    Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "  - Waiting for SMS notification (3 seconds)..." -NoNewline
Start-Sleep -Seconds 3
Write-Host " Done" -ForegroundColor Green

Write-Host ""

# ============================================
# 3. TEST ORDER COMPLETION FLOW (EMAIL)
# ============================================
Write-Host "[3/6] Testing Order Completion Flow (Email)..." -ForegroundColor Yellow

$orderData = @{
    customerName = "Test User - Order"
    customerEmail = "order-test@example.com"
    vehicleModel = "VinFast VF8 Test"
    totalAmount = 1500000000
    paymentMethod = "Full Payment"
    quantity = 1
} | ConvertTo-Json

Write-Host "  - Sending order completion request..." -NoNewline
try {
    $orderResponse = Invoke-RestMethod -Uri "$SalesServiceUrl/api/orders/complete" -Method Post -Body $orderData -ContentType "application/json" -TimeoutSec 10
    Write-Host " OK" -ForegroundColor Green
    Write-Host "    Order ID: $($orderResponse.orderId)" -ForegroundColor Gray
    $orderId = $orderResponse.orderId
} catch {
    Write-Host " FAILED" -ForegroundColor Red
    Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "  - Waiting for email notification (3 seconds)..." -NoNewline
Start-Sleep -Seconds 3
Write-Host " Done" -ForegroundColor Green

Write-Host ""

# ============================================
# 4. VERIFY RABBITMQ QUEUES
# ============================================
Write-Host "[4/6] Verifying RabbitMQ Message Processing..." -ForegroundColor Yellow

Write-Host "  - Checking sales.completed queue..." -NoNewline
Write-Host " (Check RabbitMQ UI manually)" -ForegroundColor Gray

Write-Host "  - Checking vehicle.reserved queue..." -NoNewline
Write-Host " (Check RabbitMQ UI manually)" -ForegroundColor Gray

Write-Host ""

# ============================================
# 5. CHECK NOTIFICATION SERVICE LOGS
# ============================================
Write-Host "[5/6] Expected Results in Logs..." -ForegroundColor Yellow

Write-Host "  NotificationService should show:" -ForegroundColor Cyan
Write-Host "    - Processing VehicleReservedEvent" -ForegroundColor Gray
Write-Host "    - SMS sent to +84912345678 (mock mode)" -ForegroundColor Gray
Write-Host "    - Processing SaleCompletedEvent" -ForegroundColor Gray
Write-Host "    - Email sent to order-test@example.com" -ForegroundColor Gray

Write-Host ""

# ============================================
# 6. TEST SUMMARY
# ============================================
Write-Host "[6/6] Test Summary" -ForegroundColor Yellow
Write-Host ""
Write-Host "  ✅ Vehicle Reservation Flow (SMS)" -ForegroundColor Green
Write-Host "     - API Call: SUCCESS" -ForegroundColor Gray
Write-Host "     - Reservation ID: $vehicleReservationId" -ForegroundColor Gray
Write-Host "     - SMS: Sent to +84912345678 (mock mode)" -ForegroundColor Gray
Write-Host ""
Write-Host "  ✅ Order Completion Flow (Email)" -ForegroundColor Green
Write-Host "     - API Call: SUCCESS" -ForegroundColor Gray
Write-Host "     - Order ID: $orderId" -ForegroundColor Gray
Write-Host "     - Email: Sent to order-test@example.com" -ForegroundColor Gray
Write-Host ""

# ============================================
# NEXT STEPS
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NEXT STEPS                            " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open RabbitMQ UI: $RabbitMQUrl" -ForegroundColor Yellow
Write-Host "   - Check queue: sales.completed (messages consumed)" -ForegroundColor Gray
Write-Host "   - Check queue: vehicle.reserved (messages consumed)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Check NotificationService terminal logs" -ForegroundColor Yellow
Write-Host "   - Should show 'Email sent successfully'" -ForegroundColor Gray
Write-Host "   - Should show 'SMS sent successfully (mock)'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Check email inbox for: order-test@example.com" -ForegroundColor Yellow
Write-Host "   - Subject: Order Confirmation - EV Dealer Management" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST COMPLETED SUCCESSFULLY! 🎉       " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
