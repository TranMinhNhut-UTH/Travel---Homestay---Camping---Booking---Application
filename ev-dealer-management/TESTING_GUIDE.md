# 📋 EV DEALER MANAGEMENT - TESTING & OPERATIONS GUIDE

## 🎯 Quick Reference

### Start All Services
```powershell
.\start-all-services.ps1
```

### Run All Tests
```powershell
.\test-all-flows.ps1
```

### Check Service Health
```powershell
.\check-health.ps1
```

---

## 🧪 Testing Workflows

### ✅ Current Implemented Flows:

#### 1️⃣ Vehicle Reservation → SMS Notification
```
User Action: Reserve vehicle on website
    ↓
Frontend → VehicleService API
    ↓
VehicleService → RabbitMQ (queue: vehicle.reserved)
    ↓
NotificationService → Twilio SMS
    ↓
Result: Customer receives SMS (mock mode in dev)
```

**Test Manually:**
```powershell
# Start services
.\start-all-services.ps1

# Navigate to frontend
http://localhost:5173/vehicles/1

# Click "Đặt xe" button
# Fill form and submit
# Check NotificationService terminal for:
[INF] SMS Mock Mode: Would send to +84912345678
```

**Test via API:**
```powershell
$body = @{
    customerName = "Test User"
    customerEmail = "test@example.com"
    customerPhone = "+84912345678"
    vehicleId = 1
    notes = "Test reservation"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5002/api/vehicles/reserve" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

---

#### 2️⃣ Order Completion → Email Notification
```
User Action: Complete order on website
    ↓
Frontend → SalesService API
    ↓
SalesService → RabbitMQ (queue: sales.completed)
    ↓
NotificationService → SendGrid Email
    ↓
Result: Customer receives order confirmation email
```

**Test Manually:**
```powershell
# Start services
.\start-all-services.ps1

# Navigate to frontend
http://localhost:5173/sales/ORD-2025-001

# Scroll to "Thao tác nhanh" section
# Click green "Hoàn tất đơn hàng" button
# Toast notification will appear
# Check NotificationService terminal for:
[INF] Email sent successfully to customer@example.com
```

**Test via API:**
```powershell
$body = @{
    customerName = "Test Customer"
    customerEmail = "test@example.com"
    vehicleModel = "VinFast VF8"
    totalAmount = 1500000000
    paymentMethod = "Full Payment"
    quantity = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5003/api/orders/complete" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

---

## 🔍 Verification Checklist

### After Running Tests:

#### RabbitMQ Verification:
1. Open http://localhost:15672 (guest/guest)
2. Click "Queues" tab
3. Check these queues exist and messages consumed:
   - ✅ `sales.completed` - Ready: 0, Total: N+
   - ✅ `vehicle.reserved` - Ready: 0, Total: N+
   - ✅ `testdrive.scheduled` - Ready: 0 (not used yet)

#### Service Logs:
**NotificationService Terminal:**
```
[INF] Started consuming from queue: sales.completed
[INF] Started consuming from queue: vehicle.reserved
[INF] Processing SaleCompletedEvent for Order: ORD-...
[INF] Email sent successfully to test@example.com
[INF] SMS Mock Mode: Would send to +84912345678
```

**SalesService Terminal:**
```
[INF] Published message to queue sales.completed
[INF] Order ORD-20251122-XXXXXXXX completed
```

**VehicleService Terminal:**
```
[INF] Vehicle reserved: ReservationId=...
[INF] Published VehicleReservedEvent to queue
```

---

## 📊 Expected Results Matrix

| Test | Frontend | API Response | Queue | NotificationService | Actual Delivery |
|------|----------|--------------|-------|---------------------|-----------------|
| Vehicle Reserve | ✅ Toast | 200 + ReservationId | vehicle.reserved | SMS Mock Log | Mock only |
| Order Complete | ✅ Toast | 200 + OrderId | sales.completed | Email sent log | Real email ✉️ |

---

## 🚨 Common Issues & Solutions

### Issue 1: Service Not Responding
```powershell
# Symptoms
curl: (7) Failed to connect to localhost port 5003

# Solution
netstat -ano | findstr :5003  # Find PID
taskkill /F /PID <PID>         # Kill it
cd SalesService; dotnet run    # Restart
```

### Issue 2: RabbitMQ Connection Error
```
[ERR] RabbitMQ.Client.Exceptions.BrokerUnreachableException

# Solution
docker ps | grep rabbitmq      # Check running
docker start rabbitmq          # Start if stopped
docker logs rabbitmq           # Check logs
```

### Issue 3: CORS Error in Browser
```
Access-Control-Allow-Origin header is not present

# Solution - Already fixed in SalesService Program.cs
# If still occurs, check service has:
app.UseCors("AllowFrontend");
```

### Issue 4: Email Not Delivered
**Check:**
1. SendGrid API key valid in `appsettings.json`
2. "From" email verified in SendGrid dashboard
3. Recipient email not in spam folder
4. NotificationService logs show "Email sent successfully"

**Test SendGrid directly:**
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_SENDGRID_API_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    personalizations = @(@{
        to = @(@{ email = "test@example.com" })
    })
    from = @{
        email = "noreply@evdealer.com"
    }
    subject = "Test Email"
    content = @(@{
        type = "text/plain"
        value = "Test content"
    })
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "https://api.sendgrid.com/v3/mail/send" `
    -Method Post `
    -Headers $headers `
    -Body $body
```

### Issue 5: Port Already in Use
```powershell
# Quick fix for all ports
$ports = @(5002, 5003, 5051)
foreach ($port in $ports) {
    $proc = netstat -ano | Select-String ":$port " | Select-Object -First 1
    if ($proc) {
        $pid = ($proc -split '\s+')[-1]
        taskkill /F /PID $pid
        Write-Host "Killed process on port $port"
    }
}
```

---

## 🎓 Testing Best Practices

### 1. Clean State Testing
```powershell
# Before each test session:
# 1. Restart RabbitMQ to clear queues
docker restart rabbitmq

# 2. Stop all services
Get-Process | Where-Object {$_.ProcessName -eq "dotnet"} | Stop-Process -Force

# 3. Start fresh
.\start-all-services.ps1
```

### 2. Incremental Testing
```
✅ Step 1: Check services are running
✅ Step 2: Test individual service health endpoints
✅ Step 3: Test RabbitMQ connectivity
✅ Step 4: Test one flow at a time
✅ Step 5: Verify logs after each test
✅ Step 6: Run comprehensive test script
```

### 3. Log Analysis
**What to look for:**
```
✅ GOOD:
[INF] Published message to queue
[INF] Email sent successfully
[INF] Started consuming from queue

❌ BAD:
[ERR] Failed to connect to RabbitMQ
[ERR] SendGrid API error
[WRN] Queue not found
```

---

## 📈 Performance Monitoring

### Message Processing Time
```
Typical flow timeline:
User click → API call: ~100-500ms
API → Queue publish: ~10-50ms
Queue → Consumer: ~1-10ms
Email/SMS send: ~500-2000ms
Total: ~1-3 seconds
```

### Queue Metrics (RabbitMQ UI)
- **Message rate**: Should be ~0-5/sec in dev
- **Ready messages**: Should quickly go to 0 (consumed)
- **Unacked messages**: Check if consumer is stuck
- **Consumer count**: Should match service count (3 consumers per NotificationService)

---

## 🔄 Development Workflow

### Daily Development:
```powershell
# 1. Start services (once per day)
.\start-all-services.ps1

# 2. Make code changes
# Edit files in VS Code...

# 3. Restart affected service only
# In the service's terminal: Ctrl+C, then dotnet run

# 4. Test your changes
.\test-all-flows.ps1

# 5. Check logs for errors

# 6. Commit when all tests pass
git add .
git commit -m "feat: your changes"
```

### Before Pushing to Git:
```powershell
# 1. Run full test suite
.\test-all-flows.ps1

# 2. Check all services healthy
.\check-health.ps1

# 3. Verify no errors in logs

# 4. Update documentation if needed

# 5. Push
git push origin main
```

---

## 📦 Quick Commands Reference

```powershell
# START SERVICES
.\start-all-services.ps1

# TEST ALL FLOWS
.\test-all-flows.ps1

# CHECK HEALTH
netstat -ano | findstr "5002 5003 5051 5672"

# RABBITMQ UI
start http://localhost:15672

# KILL ALL DOTNET PROCESSES
Get-Process dotnet | Stop-Process -Force

# RESTART RABBITMQ
docker restart rabbitmq

# VIEW SERVICE LOGS (in separate terminals)
cd NotificationService; dotnet run
cd SalesService; dotnet run
cd VehicleService; dotnet run

# FRONTEND
cd ev-dealer-frontend; npm run dev

# BUILD FRONTEND FOR PRODUCTION
cd ev-dealer-frontend; npm run build
```

---

## 📝 Test Results Template

Use this template to document your test results:

```
Date: YYYY-MM-DD
Tester: Your Name

Pre-conditions:
[✅] RabbitMQ running
[✅] All services started
[✅] Frontend accessible

Test 1: Vehicle Reservation SMS
- Frontend test: [PASS/FAIL]
- API test: [PASS/FAIL]
- Queue message: [PASS/FAIL]
- SMS mock log: [PASS/FAIL]
Notes: ...

Test 2: Order Completion Email
- Frontend test: [PASS/FAIL]
- API test: [PASS/FAIL]
- Queue message: [PASS/FAIL]
- Email sent: [PASS/FAIL]
Notes: ...

Issues Found:
1. ...
2. ...

Overall Result: [PASS/FAIL]
```

---

## 🎯 Next Testing Phases

### Phase 1 (Current): ✅ COMPLETE
- Vehicle Reservation → SMS
- Order Completion → Email

### Phase 2 (Future):
- Test Drive Scheduling → Email/SMS
- CustomerService integration
- Frontend integration for Test Drive

### Phase 3 (Future):
- API Gateway routing through Ocelot
- End-to-end tests via Gateway
- Load testing

---

## 🆘 Getting Help

1. **Check logs first** - Most issues show in terminal logs
2. **Verify prerequisites** - RabbitMQ, all services running
3. **Run health checks** - Use automated script
4. **Check this guide** - Common issues section
5. **Review service README** - Each service has specific docs

---

**Created**: November 22, 2025  
**Last Updated**: November 22, 2025  
**Version**: 1.0.0
