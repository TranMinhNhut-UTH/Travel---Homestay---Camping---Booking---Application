# ✅ NotificationService - COMPLETE SETUP SUMMARY

## 🎉 Tình Trạng Hiện Tại

### ✅ Đã Hoàn Thành

1. **NotificationService Backend** ✅
   - Email Service (SendGrid) - Working
   - SMS Service (Twilio) - Mock for Vietnam
   - RabbitMQ Consumers (3 queues)
   - API Controllers with 6 endpoints
   - Serilog logging
   - Health check endpoint

2. **VehicleService Integration** ✅
   - RabbitMQ Producer updated
   - Publish to queue `vehicle.reserved`
   - Event format matches NotificationService DTO

3. **Frontend Components** ✅
   - NotificationToast component
   - notificationService.js with API methods
   - Ready for UI integration

---

## 🚀 Quick Start - Test End-to-End

### Bước 1: Start All Services

**Terminal 1 - RabbitMQ:**
```powershell
docker start rabbitmq
# Hoặc nếu chưa có container:
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
```

**Terminal 2 - NotificationService:**
```powershell
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\NotificationService
dotnet run
```
→ Service chạy tại: http://localhost:5005

**Terminal 3 - VehicleService:**
```powershell
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\VehicleService
dotnet run
```
→ Service chạy tại: http://localhost:5002

**Terminal 4 - Frontend (Optional):**
```powershell
cd D:\Nam_3\ev-dealer-management\ev-dealer-frontend
npm run dev
```
→ Frontend tại: http://localhost:5174

---

## 🧪 Test Case 1: Vehicle Reservation (Recommended - Dễ nhất)

### Via PowerShell (Không cần Frontend)

```powershell
# Step 1: Create a reservation
$reservationBody = @{
    vehicleId = 1
    colorVariantId = 1
    customerName = "Nguyen Van Test"
    customerEmail = "your-email@gmail.com"  # ← Thay email của bạn
    customerPhone = "+84901234567"          # ← Thay số điện thoại
    notes = "Test reservation from PowerShell"
    quantity = 1
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:5002/api/vehicles/1/reservations" `
    -Method Post `
    -Body $reservationBody `
    -ContentType "application/json"

Write-Host "✅ Reservation Created: $($response.id)" -ForegroundColor Green
```

### Expected Flow:

1. **VehicleService** nhận request → Tạo reservation → ✅
2. **VehicleService** publish event → Queue `vehicle.reserved` → ✅
3. **RabbitMQ** queue nhận message → ✅
4. **NotificationService** consume message → ✅
5. **SMS** gửi đến phone number (Mock for VN) → ✅

### Check Results:

**A. RabbitMQ Management UI:**
```powershell
Start-Process http://localhost:15672
# Login: guest/guest
# Tab Queues → Click "vehicle.reserved"
# Should see: 
# - Message was published
# - Message was consumed (Ready = 0)
```

**B. NotificationService Logs:**
```powershell
# Check terminal output, should see:
[INF] Processing VehicleReservedEvent for Reservation: RES-xxx
[INF] Reservation confirmation SMS sent for Reservation: RES-xxx
```

**C. Twilio Dashboard (Mock):**
```powershell
# Nếu có real Twilio account:
Start-Process https://console.twilio.com/us1/monitor/logs/sms
# Should see SMS delivery status
```

---

## 🧪 Test Case 2: Direct API Test (Nhanh nhất)

### Test Email Directly:

```powershell
$emailBody = @{
    customerEmail = "your-email@gmail.com"
    customerName = "Test User"
    vehicleModel = "Tesla Model 3 Long Range"
    totalPrice = 45000.00
    orderId = "TEST-001"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:5005/api/notification/order-confirmation" `
    -Method Post `
    -Body $emailBody `
    -ContentType "application/json"
```

**Expected:**
- ✅ Email gửi đến inbox
- ✅ Check SendGrid Activity dashboard

### Test SMS Directly:

```powershell
$smsBody = @{
    customerPhone = "+84901234567"
    customerName = "Test User"
    vehicleModel = "Tesla Model Y"
    colorName = "Pearl White"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:5005/api/notification/reservation-confirmation" `
    -Method Post `
    -Body $smsBody `
    -ContentType "application/json"
```

---

## 🧪 Test Case 3: RabbitMQ Test (Dùng TestProducer.ps1)

```powershell
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\NotificationService

# Test all events
.\TestProducer.ps1 -Email "your-email@gmail.com" -Phone "+84901234567"

# Or test specific event
.\TestProducer.ps1 -EventType reservation -Phone "+84901234567"
```

---

## 📊 Verification Checklist

### ✅ NotificationService Health
```powershell
Invoke-RestMethod http://localhost:5005/health
# Should return: { status: "healthy", service: "NotificationService" }
```

### ✅ RabbitMQ Connection
```powershell
Test-NetConnection localhost -Port 5672
# TcpTestSucceeded should be True
```

### ✅ Queues Exist
```powershell
# In RabbitMQ Management UI (http://localhost:15672)
# Should see 3 queues:
# - sales.completed
# - vehicle.reserved
# - testdrive.scheduled
```

### ✅ VehicleService Connected
```powershell
Invoke-RestMethod http://localhost:5002/api/vehicles
# Should return list of vehicles
```

---

## 🎯 Next Steps - Frontend Integration

### Option A: Quick Test trong VehicleDetail Page

**Bước 1:** Import NotificationToast
```jsx
// File: ev-dealer-frontend/src/pages/Vehicles/VehicleDetail.jsx
import NotificationToast from '../../components/Notification/NotificationToast'
```

**Bước 2:** Add notification state
```jsx
const [notification, setNotification] = useState({
  open: false,
  message: '',
  severity: 'success'
})
```

**Bước 3:** Update reservation handler
```jsx
const handleReservation = async (data) => {
  try {
    const response = await vehicleService.createReservation(vehicle.id, data)
    
    setNotification({
      open: true,
      message: `🎉 Reservation successful! SMS sent to ${data.customerPhone}`,
      severity: 'success'
    })
  } catch (error) {
    setNotification({
      open: true,
      message: `❌ Reservation failed: ${error.message}`,
      severity: 'error'
    })
  }
}
```

**Bước 4:** Add toast to render
```jsx
return (
  <>
    {/* ... existing UI ... */}
    
    <NotificationToast
      open={notification.open}
      message={notification.message}
      severity={notification.severity}
      onClose={() => setNotification({ ...notification, open: false })}
    />
  </>
)
```

### Option B: Test với QuickTest Script

```powershell
cd NotificationService
.\QuickTest.ps1 -Email "your@email.com" -Phone "+84901234567"
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Could not connect to RabbitMQ"

**Solution:**
```powershell
# Check RabbitMQ is running
docker ps | Select-String rabbitmq

# If not running, start it
docker start rabbitmq

# Or create new
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
```

### Issue 2: "SendGrid API Key not configured"

**Solution:**
```json
// Update appsettings.json
{
  "SendGrid": {
    "ApiKey": "SG.your_real_api_key_here",
    "FromEmail": "your-verified-email@gmail.com"
  }
}
```

### Issue 3: "Message not consumed"

**Check:**
1. NotificationService đang chạy? → `dotnet run`
2. Queue có message? → RabbitMQ Management UI
3. Check logs → `.\Logs\notification-service-*.log`

### Issue 4: "VehicleService publish failed"

**Check:**
```powershell
# VehicleService logs should show:
[INF] Published message of type VehicleReservedEvent to queue 'vehicle.reserved'

# If not, check appsettings.json has RabbitMQ config:
{
  "RabbitMQ": {
    "HostName": "localhost",
    "Port": 5672,
    "UserName": "guest",
    "Password": "guest"
  }
}
```

---

## 📞 Testing Commands Reference

### Health Checks
```powershell
# NotificationService
Invoke-RestMethod http://localhost:5005/health

# RabbitMQ
Test-NetConnection localhost -Port 5672
Start-Process http://localhost:15672  # Management UI
```

### View Logs
```powershell
# NotificationService logs
Get-Content .\NotificationService\Logs\notification-service-*.log -Tail 50 -Wait

# VehicleService logs (terminal output)
```

### RabbitMQ Quick Check
```powershell
# List queues
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("guest:guest"))
Invoke-RestMethod -Uri "http://localhost:15672/api/queues" `
    -Headers @{Authorization="Basic $auth"} |
    Select-Object name, messages, consumers
```

---

## 🎊 Success Criteria

Bạn đã thành công khi:

✅ NotificationService health check returns "healthy"
✅ RabbitMQ có 3 queues (sales.completed, vehicle.reserved, testdrive.scheduled)
✅ Create reservation → SMS log hiện trong NotificationService terminal
✅ Direct API test → Email nhận được trong inbox
✅ RabbitMQ Management UI shows messages consumed (Ready = 0)
✅ Frontend toast notification hiện sau khi reserve

---

## 🚀 Recommended Test Order

1. ✅ **Start all services** (RabbitMQ, NotificationService, VehicleService)
2. ✅ **Test health checks** (Verify services running)
3. ✅ **Direct API test** (Test email via `/order-confirmation`)
4. ✅ **RabbitMQ test** (Use TestProducer.ps1)
5. ✅ **VehicleService integration** (Create reservation via API)
6. ✅ **Frontend integration** (Test via UI - Optional)

---

**Bắt đầu từ Test Case 1 - Vehicle Reservation! 🎉**

Questions? Check:
- TESTING_GUIDE.md - Chi tiết đầy đủ
- INTEGRATION_PLAN.md - Roadmap hoàn chỉnh
- README.md - NotificationService overview
