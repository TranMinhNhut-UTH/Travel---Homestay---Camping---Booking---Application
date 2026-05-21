# NotificationService - Hướng Dẫn Test Chi Tiết

## 📋 Mục Lục

1. [Chuẩn Bị](#chuẩn-bị)
2. [Test Email Service (SendGrid)](#test-email-service-sendgrid)
3. [Test SMS Service (Twilio)](#test-sms-service-twilio)
4. [Test RabbitMQ Integration](#test-rabbitmq-integration)
5. [Test API Endpoints](#test-api-endpoints)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Chuẩn Bị

### Bước 1: Cài Đặt RabbitMQ

**Option A: Sử dụng Docker (Khuyến nghị)**

```powershell
# Pull RabbitMQ image với management plugin
docker pull rabbitmq:3-management

# Chạy RabbitMQ container
docker run -d --name rabbitmq `
  -p 5672:5672 `
  -p 15672:15672 `
  rabbitmq:3-management

# Kiểm tra container đang chạy
docker ps
```

**Option B: Cài Đặt Trực Tiếp**

Tải từ: https://www.rabbitmq.com/download.html

Sau khi cài, RabbitMQ Management UI có tại: http://localhost:15672
- Username: `guest`
- Password: `guest`

### Bước 2: Đăng Ký SendGrid (Email Service)

1. Truy cập: https://signup.sendgrid.com/
2. Đăng ký tài khoản miễn phí (100 emails/ngày)
3. Xác thực email
4. Tạo API Key:
   - Settings → API Keys → Create API Key
   - Chọn "Full Access"
   - Copy API Key (chỉ hiển thị 1 lần)

5. Verify Sender Email:
   - Settings → Sender Authentication → Verify a Single Sender
   - Nhập email của bạn
   - Xác thực qua email

### Bước 3: Đăng Ký Twilio (SMS Service)

1. Truy cập: https://www.twilio.com/try-twilio
2. Đăng ký tài khoản miễn phí (Trial)
3. Lấy credentials:
   - Account SID: Trang Console
   - Auth Token: Trang Console
   - Phone Number: Get a Trial Number

**Lưu ý**: Tài khoản trial chỉ gửi SMS đến số điện thoại đã verify

### Bước 4: Cấu Hình appsettings.json

Mở file: `NotificationService/appsettings.json`

```json
{
  "RabbitMQ": {
    "HostName": "localhost",
    "Port": 5672,
    "UserName": "guest",
    "Password": "guest",
    "Queues": {
      "SaleCompleted": "sales.completed",
      "VehicleReserved": "vehicle.reserved",
      "TestDriveScheduled": "testdrive.scheduled"
    }
  },
  "SendGrid": {
    "ApiKey": "SG.xxxxxxxxxxxxxxxxxxxxxxxxx",  // ← Paste API Key ở đây
    "FromEmail": "your-verified-email@gmail.com",  // ← Email đã verify
    "FromName": "EV Dealer Management"
  },
  "Twilio": {
    "AccountSid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",  // ← Paste Account SID
    "AuthToken": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",    // ← Paste Auth Token
    "PhoneNumber": "+1234567890"  // ← Twilio phone number
  }
}
```

### Bước 5: Khởi Chạy Service

```powershell
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\NotificationService
dotnet build
dotnet run
```

Service sẽ chạy tại: **http://localhost:5005**

Swagger UI: **http://localhost:5005/swagger**

---

## 📧 Test Email Service (SendGrid)

### Test 1: Gửi Email Đơn Giản

**Sử dụng PowerShell:**

```powershell
$body = @{
    to = "recipient@gmail.com"  # ← Thay email người nhận
    subject = "Test Email from NotificationService"
    htmlContent = "<h1>Hello!</h1><p>This is a test email from EV Dealer Management System.</p>"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5005/api/notification/test-email" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

**Sử dụng curl:**

```bash
curl -X POST http://localhost:5005/api/notification/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@gmail.com",
    "subject": "Test Email",
    "htmlContent": "<h1>Hello World!</h1>"
  }'
```

**Kết quả mong đợi:**
```json
{
  "message": "Email sent successfully"
}
```

**Kiểm tra:**
- Check email inbox (có thể trong Spam folder)
- Check SendGrid Dashboard → Activity để xem email stats

### Test 2: Gửi Order Confirmation Email

```powershell
$orderBody = @{
    customerEmail = "customer@gmail.com"
    customerName = "Nguyen Van A"
    vehicleModel = "Tesla Model 3 Long Range"
    totalPrice = 45000.00
    orderId = "ORD-TEST-001"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5005/api/notification/order-confirmation" `
  -Method Post `
  -Body $orderBody `
  -ContentType "application/json"
```

**Kiểm tra email nhận được có:**
- Subject: "Order Confirmation - EV Dealer Management"
- Nội dung: Order ID, Vehicle Model, Total Price
- HTML formatting đẹp

### Test 3: Gửi Test Drive Confirmation Email

```powershell
$testDriveBody = @{
    customerEmail = "customer@gmail.com"
    customerName = "Tran Thi B"
    vehicleModel = "Tesla Model Y Performance"
    scheduledDate = "2025-01-25T10:00:00"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5005/api/notification/test-drive-confirmation" `
  -Method Post `
  -Body $testDriveBody `
  -ContentType "application/json"
```

---

## 📱 Test SMS Service (Twilio)

### Lưu Ý Quan Trọng

**Tài khoản Twilio Trial:**
- Chỉ gửi SMS đến số đã verify
- Mỗi SMS có prefix: "Sent from your Twilio trial account - "
- Upgrade tài khoản để bỏ giới hạn

**Verify số điện thoại:**
1. Twilio Console → Phone Numbers → Manage → Verified Caller IDs
2. Add số điện thoại của bạn
3. Nhập mã OTP nhận được

### Test 1: Gửi SMS Đơn Giản

```powershell
$smsBody = @{
    phoneNumber = "+84901234567"  # ← Thay số đã verify
    message = "Test SMS from EV Dealer Management System"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5005/api/notification/test-sms" `
  -Method Post `
  -Body $smsBody `
  -ContentType "application/json"
```

**Kết quả mong đợi:**
```json
{
  "message": "SMS sent successfully"
}
```

**Kiểm tra:**
- Nhận SMS trong vòng 1-2 phút
- Check Twilio Console → Monitor → Logs → Messaging

### Test 2: Gửi Reservation Confirmation SMS

```powershell
$reservationBody = @{
    customerPhone = "+84901234567"  # ← Số đã verify
    customerName = "Le Van C"
    vehicleModel = "Tesla Model S Plaid"
    colorName = "Pearl White Multi-Coat"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5005/api/notification/reservation-confirmation" `
  -Method Post `
  -Body $reservationBody `
  -ContentType "application/json"
```

**Kiểm tra SMS nhận được:**
- Nội dung: "Hi Le Van C, your reservation for Tesla Model S Plaid (Pearl White Multi-Coat) has been confirmed!"

---

## 🐰 Test RabbitMQ Integration

### Bước 1: Tạo Queues Thủ Công

Truy cập RabbitMQ Management: http://localhost:15672

**Login:** guest / guest

1. Tab **Queues** → Add a new queue
2. Tạo 3 queues:
   - Name: `sales.completed`, Durability: Durable → Add queue
   - Name: `vehicle.reserved`, Durability: Durable → Add queue
   - Name: `testdrive.scheduled`, Durability: Durable → Add queue

### Bước 2: Publish Test Messages

**Test Message 1: Sale Completed**

1. Tab Queues → Click `sales.completed`
2. Expand "Publish message"
3. Payload:

```json
{
  "orderId": "ORD-RMQ-001",
  "customerEmail": "test@gmail.com",
  "customerName": "Nguyen Test",
  "vehicleModel": "Tesla Model 3",
  "totalPrice": 42000.00,
  "completedAt": "2025-01-22T14:30:00Z"
}
```

4. Click **Publish message**

**Kiểm tra:**
- Logs trong terminal NotificationService sẽ hiện:
  ```
  [INF] Processing SaleCompletedEvent for Order: ORD-RMQ-001
  [INF] Order confirmation email sent for Order: ORD-RMQ-001
  ```
- Email confirmation sẽ được gửi đến test@gmail.com

**Test Message 2: Vehicle Reserved**

1. Tab Queues → Click `vehicle.reserved`
2. Payload:

```json
{
  "reservationId": "RES-RMQ-001",
  "customerPhone": "+84901234567",
  "customerName": "Tran Test",
  "vehicleModel": "Tesla Model Y",
  "colorName": "Midnight Silver Metallic",
  "reservedAt": "2025-01-22T15:00:00Z"
}
```

3. Publish message

**Kiểm tra:**
- SMS confirmation sẽ được gửi đến số điện thoại

**Test Message 3: Test Drive Scheduled**

1. Tab Queues → Click `testdrive.scheduled`
2. Payload:

```json
{
  "testDriveId": 123,
  "customerEmail": "test@gmail.com",
  "customerName": "Le Test",
  "vehicleModel": "Tesla Model S",
  "appointmentDate": "2025-02-10T10:00:00",
  "vehicleId": 5
}
```

3. Publish message

**Kiểm tra:**
- Email confirmation sẽ được gửi

### Bước 3: Test với Producer Service

**Tạo simple producer để test:**

Tạo file: `NotificationService/TestProducer.ps1`

```powershell
# Install RabbitMQ .NET Client nếu chưa có
# dotnet add package RabbitMQ.Client

# Script publish message to RabbitMQ
$queueName = "sales.completed"
$message = @{
    orderId = "ORD-SCRIPT-001"
    customerEmail = "yourmail@gmail.com"
    customerName = "Test User"
    vehicleModel = "Tesla Model 3"
    totalPrice = 45000
    completedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
} | ConvertTo-Json

Write-Host "Publishing message to $queueName..."
Write-Host $message

# Sử dụng RabbitMQ HTTP API
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("guest:guest"))
$headers = @{
    Authorization = "Basic $auth"
    "Content-Type" = "application/json"
}

$body = @{
    properties = @{}
    routing_key = $queueName
    payload = $message
    payload_encoding = "string"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:15672/api/exchanges/%2F/amq.default/publish" `
    -Method Post `
    -Headers $headers `
    -Body $body
```

Chạy:
```powershell
.\TestProducer.ps1
```

---

## 🔌 Test API Endpoints

### Sử dụng Swagger UI

1. Mở browser: **http://localhost:5005/swagger**
2. Các endpoints có sẵn:
   - `POST /api/notification/test-email`
   - `POST /api/notification/test-sms`
   - `POST /api/notification/order-confirmation`
   - `POST /api/notification/reservation-confirmation`
   - `POST /api/notification/test-drive-confirmation`
   - `GET /health`

3. Click endpoint → Try it out → Điền parameters → Execute

### Test Health Check

```powershell
Invoke-RestMethod -Uri "http://localhost:5005/health"
```

**Kết quả:**
```json
{
  "status": "healthy",
  "service": "NotificationService",
  "timestamp": "2025-01-22T10:30:45.1234567Z"
}
```

### Test với Postman

**Import Collection:**

Tạo file: `NotificationService.postman_collection.json`

```json
{
  "info": {
    "name": "NotificationService",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:5005/health"
      }
    },
    {
      "name": "Test Email",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"to\": \"test@gmail.com\",\n  \"subject\": \"Test Email\",\n  \"htmlContent\": \"<h1>Hello</h1>\"\n}"
        },
        "url": "http://localhost:5005/api/notification/test-email"
      }
    },
    {
      "name": "Test SMS",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phoneNumber\": \"+84901234567\",\n  \"message\": \"Test SMS\"\n}"
        },
        "url": "http://localhost:5005/api/notification/test-sms"
      }
    },
    {
      "name": "Order Confirmation",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"customerEmail\": \"customer@gmail.com\",\n  \"customerName\": \"John Doe\",\n  \"vehicleModel\": \"Tesla Model 3\",\n  \"totalPrice\": 45000,\n  \"orderId\": \"ORD-123\"\n}"
        },
        "url": "http://localhost:5005/api/notification/order-confirmation"
      }
    }
  ]
}
```

Import vào Postman và test!

---

## 🐛 Troubleshooting

### Lỗi 1: SendGrid Email Không Gửi

**Triệu chứng:**
```json
{
  "message": "Failed to send email"
}
```

**Kiểm tra:**

1. **API Key đúng không?**
   ```powershell
   # Test SendGrid API Key
   $headers = @{
       Authorization = "Bearer SG.your_api_key_here"
   }
   Invoke-RestMethod -Uri "https://api.sendgrid.com/v3/scopes" -Headers $headers
   ```

2. **Sender email đã verify chưa?**
   - Login SendGrid → Settings → Sender Authentication
   - Verify a Single Sender hoặc Domain Authentication

3. **Check logs:**
   ```powershell
   # Xem file log
   Get-Content .\Logs\notification-service-*.log -Tail 50
   ```

### Lỗi 2: Twilio SMS Không Gửi

**Triệu chứng:**
```
Failed to send reservation confirmation SMS
```

**Kiểm tra:**

1. **Số điện thoại đã verify chưa?** (Với trial account)
   - Twilio Console → Phone Numbers → Verified Caller IDs

2. **Format số điện thoại đúng chưa?**
   - Phải có country code: `+84901234567` (không phải `0901234567`)

3. **Test credentials:**
   ```powershell
   $accountSid = "ACxxxxx"
   $authToken = "xxxxx"
   $auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${accountSid}:${authToken}"))
   $headers = @{ Authorization = "Basic $auth" }
   
   Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json" -Headers $headers
   ```

### Lỗi 3: RabbitMQ Connection Failed

**Triệu chứng:**
```
Could not connect to RabbitMQ for consuming. Check connection settings.
```

**Giải quyết:**

1. **Kiểm tra RabbitMQ đang chạy:**
   ```powershell
   # Với Docker
   docker ps | Select-String rabbitmq
   
   # Hoặc kiểm tra port
   Test-NetConnection -ComputerName localhost -Port 5672
   ```

2. **Restart RabbitMQ:**
   ```powershell
   # Docker
   docker restart rabbitmq
   
   # Windows Service
   Restart-Service RabbitMQ
   ```

3. **Kiểm tra credentials:**
   - Default: guest/guest
   - Chỉ hoạt động với localhost

### Lỗi 4: Service Không Start

**Triệu chứng:**
```
Exception occurred while sending email
ArgumentNullException: SendGrid:ApiKey not configured
```

**Giải quyết:**

1. **Check appsettings.json có đúng format không**
2. **Đảm bảo không có trailing spaces hoặc invalid JSON**
3. **Rebuild project:**
   ```powershell
   dotnet clean
   dotnet build
   dotnet run
   ```

### Lỗi 5: Messages Không Được Consume

**Kiểm tra:**

1. **Queue có messages không?**
   - RabbitMQ Management → Queues
   - Check "Messages" column

2. **Consumer đã start chưa?**
   - Check logs: `Started consuming from queue: sales.completed`

3. **Message format đúng không?**
   - JSON phải match với DTO schema
   - Required fields phải có đầy đủ

---

## ✅ Checklist Test Hoàn Chỉnh

### Pre-Test Setup
- [ ] RabbitMQ đang chạy (port 5672)
- [ ] SendGrid API Key đã config
- [ ] Twilio credentials đã config
- [ ] Sender email đã verify (SendGrid)
- [ ] Phone number đã verify (Twilio - trial account)
- [ ] NotificationService đang chạy (port 5005)

### Email Tests
- [ ] Test simple email gửi thành công
- [ ] Email nhận được trong inbox
- [ ] Order confirmation email có đúng format
- [ ] Test drive confirmation email có đúng format
- [ ] HTML rendering đúng

### SMS Tests
- [ ] Test simple SMS gửi thành công
- [ ] SMS nhận được trong điện thoại
- [ ] Reservation confirmation SMS có đúng nội dung
- [ ] Test drive reminder SMS có đúng format

### RabbitMQ Tests
- [ ] Queues đã được tạo (3 queues)
- [ ] Publish message đến sales.completed queue
- [ ] Email confirmation được gửi tự động
- [ ] Publish message đến vehicle.reserved queue
- [ ] SMS confirmation được gửi tự động
- [ ] Publish message đến testdrive.scheduled queue
- [ ] Email confirmation được gửi tự động
- [ ] Messages được acknowledge (không còn trong queue)

### API Tests
- [ ] Health check endpoint hoạt động
- [ ] Swagger UI accessible
- [ ] Tất cả endpoints trả về đúng response
- [ ] Error handling hoạt động (invalid data)

### Integration Tests
- [ ] Chạy VehicleService và publish reservation event
- [ ] NotificationService nhận và xử lý event
- [ ] Chạy SalesService và publish sale event
- [ ] NotificationService nhận và xử lý event

### Logging Tests
- [ ] Console logs hiển thị đầy đủ
- [ ] File logs được tạo trong folder Logs/
- [ ] Error logs có stack trace
- [ ] Success logs có đầy đủ thông tin

---

## 📊 Expected Results Summary

| Test Case | Expected Result | Verification |
|-----------|----------------|--------------|
| Simple Email | 200 OK, "Email sent successfully" | Check inbox |
| Order Confirmation | 200 OK, HTML email with order details | Check inbox |
| Test Drive Email | 200 OK, formatted appointment details | Check inbox |
| Simple SMS | 200 OK, "SMS sent successfully" | Check phone |
| Reservation SMS | 200 OK, confirmation message | Check phone |
| RabbitMQ Sale Event | Auto email sent | Check inbox + logs |
| RabbitMQ Reservation Event | Auto SMS sent | Check phone + logs |
| Health Check | 200 OK, JSON with status | Check response |

---

## 🎯 Quick Test Script

Chạy script này để test tất cả endpoints:

```powershell
# Quick Test Script
$baseUrl = "http://localhost:5005"

Write-Host "=== Testing NotificationService ===" -ForegroundColor Cyan

# 1. Health Check
Write-Host "`n1. Health Check..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$baseUrl/health"

# 2. Test Email (Thay email của bạn)
Write-Host "`n2. Test Email..." -ForegroundColor Yellow
$emailBody = @{
    to = "your-email@gmail.com"
    subject = "Quick Test"
    htmlContent = "<h1>Test OK!</h1>"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/api/notification/test-email" `
    -Method Post -Body $emailBody -ContentType "application/json"

# 3. Test SMS (Thay số điện thoại đã verify)
Write-Host "`n3. Test SMS..." -ForegroundColor Yellow
$smsBody = @{
    phoneNumber = "+84901234567"
    message = "Quick Test OK"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/api/notification/test-sms" `
    -Method Post -Body $smsBody -ContentType "application/json"

Write-Host "`n=== All Tests Completed ===" -ForegroundColor Green
```

---

## 📞 Support

Nếu gặp vấn đề, check:
1. Logs trong `Logs/notification-service-*.log`
2. Console output của service
3. RabbitMQ Management UI logs
4. SendGrid Activity dashboard
5. Twilio Messaging logs

**Happy Testing! 🚀**
