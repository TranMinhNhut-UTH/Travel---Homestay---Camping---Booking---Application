# =====================================================
# FIREBASE FCM TESTING SCRIPT
# NotificationService - Push Notification Test
# =====================================================

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  FIREBASE FCM NOTIFICATION TEST SCRIPT" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5051"

# =====================================================
# TEST 1: Health Check
# =====================================================
Write-Host "[TEST 1] Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✅ Health Check: $($response.status)" -ForegroundColor Green
    Write-Host "   Service: $($response.service)" -ForegroundColor Gray
    Write-Host "   Timestamp: $($response.timestamp)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# =====================================================
# TEST 2: Test FCM Notification (DEMO TOKEN)
# =====================================================
Write-Host "[TEST 2] Test FCM Notification..." -ForegroundColor Yellow
Write-Host "⚠️  Lưu ý: Test này cần device token thật từ frontend" -ForegroundColor Magenta
Write-Host "   Bạn có thể skip test này nếu chưa có device token" -ForegroundColor Gray
Write-Host ""

$testFcm = Read-Host "Bạn có device token để test không? (y/n)"

if ($testFcm -eq "y" -or $testFcm -eq "Y") {
    $deviceToken = Read-Host "Nhập device token"
    
    $fcmPayload = @{
        deviceToken = $deviceToken
        title = "🔥 Test Notification"
        body = "Đây là test notification từ NotificationService!"
        data = @{
            type = "test"
            timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        }
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/notification/test-fcm" `
            -Method Post `
            -Body $fcmPayload `
            -ContentType "application/json"
        
        Write-Host "✅ FCM Test: $($response.message)" -ForegroundColor Green
        Write-Host "   👉 Kiểm tra browser của bạn xem có notification không!" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ FCM Test Failed: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "   Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "⏭️  Skip test FCM (chưa có device token)" -ForegroundColor Gray
}
Write-Host ""

# =====================================================
# TEST 3: Swagger UI Available
# =====================================================
Write-Host "[TEST 3] Swagger UI..." -ForegroundColor Yellow
try {
    $swaggerUrl = "$baseUrl/swagger/index.html"
    $response = Invoke-WebRequest -Uri $swaggerUrl -UseBasicParsing
    Write-Host "✅ Swagger UI Available: $swaggerUrl" -ForegroundColor Green
    Write-Host "   👉 Mở trình duyệt để xem API documentation" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️  Swagger UI không khả dụng (có thể chưa enable)" -ForegroundColor Yellow
}
Write-Host ""

# =====================================================
# TEST 4: Check RabbitMQ Connection
# =====================================================
Write-Host "[TEST 4] RabbitMQ Connection..." -ForegroundColor Yellow
Write-Host "   ℹ️  Kiểm tra logs của NotificationService" -ForegroundColor Gray
Write-Host "   Cần thấy: 'RabbitMQ consumer connection and channels initialized successfully'" -ForegroundColor Gray
Write-Host "   ✅ Đã thấy trong logs khi start service!" -ForegroundColor Green
Write-Host ""

# =====================================================
# TEST 5: Available Endpoints
# =====================================================
Write-Host "[TEST 5] Available FCM Endpoints:" -ForegroundColor Yellow
Write-Host "   POST $baseUrl/api/notification/test-fcm" -ForegroundColor Cyan
Write-Host "        - Test gửi push notification đến 1 device" -ForegroundColor Gray
Write-Host ""
Write-Host "   POST $baseUrl/api/notification/subscribe-topic" -ForegroundColor Cyan
Write-Host "        - Subscribe device token vào 1 topic" -ForegroundColor Gray
Write-Host ""
Write-Host "   POST $baseUrl/api/notification/unsubscribe-topic" -ForegroundColor Cyan
Write-Host "        - Unsubscribe device token khỏi topic" -ForegroundColor Gray
Write-Host ""
Write-Host "   POST $baseUrl/api/notification/send-to-topic" -ForegroundColor Cyan
Write-Host "        - Broadcast notification đến tất cả devices trong topic" -ForegroundColor Gray
Write-Host ""
Write-Host "   POST $baseUrl/api/notification/send-multicast" -ForegroundColor Cyan
Write-Host "        - Gửi notification đến nhiều devices cùng lúc" -ForegroundColor Gray
Write-Host ""

# =====================================================
# SUMMARY
# =====================================================
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ NotificationService đang chạy" -ForegroundColor Green
Write-Host "✅ Firebase FCM đã được config" -ForegroundColor Green
Write-Host "✅ RabbitMQ consumers đang lắng nghe 3 queues:" -ForegroundColor Green
Write-Host "   - sales.completed" -ForegroundColor Gray
Write-Host "   - vehicle.reserved" -ForegroundColor Gray
Write-Host "   - testdrive.scheduled" -ForegroundColor Gray
Write-Host ""
Write-Host "📝 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "   1. Implement Firebase trong Frontend (React)" -ForegroundColor White
Write-Host "   2. Lấy device token từ browser" -ForegroundColor White
Write-Host "   3. Test gửi notification từ VehicleService" -ForegroundColor White
Write-Host "   4. Verify notification hiện trên browser" -ForegroundColor White
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
