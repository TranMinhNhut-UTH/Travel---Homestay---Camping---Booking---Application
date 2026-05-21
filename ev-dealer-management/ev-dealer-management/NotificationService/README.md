# NotificationService

Microservice xử lý gửi thông báo Email và SMS cho khách hàng trong hệ thống EV Dealer Management.

## Tính năng

- **Email Notifications** (sử dụng SendGrid):
  - Order confirmation emails
  - Test drive appointment confirmations
  - Custom email sending

- **SMS Notifications** (sử dụng Twilio):
  - Vehicle reservation confirmations
  - Test drive reminders
  - Custom SMS sending

- **RabbitMQ Consumers**:
  - `SaleCompletedConsumer` - Lắng nghe event "sales.completed" và gửi email xác nhận đơn hàng
  - `VehicleReservedConsumer` - Lắng nghe event "vehicle.reserved" và gửi SMS xác nhận đặt xe
  - `TestDriveScheduledConsumer` - Lắng nghe event "testdrive.scheduled" và gửi email xác nhận lịch test drive

## Cấu hình

### 1. RabbitMQ Configuration

Cập nhật `appsettings.json`:

```json
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
}
```

### 2. SendGrid Configuration (Email)

Đăng ký tài khoản SendGrid tại: https://sendgrid.com/

Lấy API Key và cập nhật `appsettings.json`:

```json
"SendGrid": {
  "ApiKey": "SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "FromEmail": "noreply@evdealer.com",
  "FromName": "EV Dealer Management"
}
```

### 3. Twilio Configuration (SMS)

Đăng ký tài khoản Twilio tại: https://www.twilio.com/

Lấy AccountSid, AuthToken và số điện thoại, cập nhật `appsettings.json`:

```json
"Twilio": {
  "AccountSid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "AuthToken": "your_auth_token",
  "PhoneNumber": "+1234567890"
}
```

## Chạy Service

### Prerequisites

- RabbitMQ phải đang chạy (localhost:5672)
- .NET 8.0 SDK
- SendGrid API Key (để test email)
- Twilio credentials (để test SMS)

### Commands

```bash
cd ev-dealer-management/NotificationService
dotnet restore
dotnet build
dotnet run
```

Service sẽ chạy tại: `http://localhost:5005` (hoặc port được cấu hình)

## API Endpoints

### Health Check

```http
GET /health
```

### Test Email

```http
POST /api/notification/test-email
Content-Type: application/json

{
  "to": "customer@example.com",
  "subject": "Test Email",
  "htmlContent": "<h1>Hello World</h1>"
}
```

### Test SMS

```http
POST /api/notification/test-sms
Content-Type: application/json

{
  "phoneNumber": "+84901234567",
  "message": "Test SMS from NotificationService"
}
```

### Send Order Confirmation

```http
POST /api/notification/order-confirmation
Content-Type: application/json

{
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "vehicleModel": "Tesla Model 3",
  "totalPrice": 45000.00,
  "orderId": "ORD-12345"
}
```

### Send Reservation Confirmation

```http
POST /api/notification/reservation-confirmation
Content-Type: application/json

{
  "customerPhone": "+84901234567",
  "customerName": "John Doe",
  "vehicleModel": "Tesla Model Y",
  "colorName": "Pearl White"
}
```

### Send Test Drive Confirmation

```http
POST /api/notification/test-drive-confirmation
Content-Type: application/json

{
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "vehicleModel": "Tesla Model S",
  "scheduledDate": "2025-02-15T10:00:00"
}
```

## Event-Driven Architecture

### Message Flow

1. **SalesService** → Publish `SaleCompletedEvent` → Queue: `sales.completed`
2. **VehicleService** → Publish `VehicleReservedEvent` → Queue: `vehicle.reserved`
3. **CustomerService** → Publish `TestDriveScheduledEvent` → Queue: `testdrive.scheduled`
4. **NotificationService** → Consume events → Send Email/SMS

### Event Schemas

#### SaleCompletedEvent

```json
{
  "orderId": "ORD-12345",
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "vehicleModel": "Tesla Model 3",
  "totalPrice": 45000.00,
  "completedAt": "2025-01-15T14:30:00Z"
}
```

#### VehicleReservedEvent

```json
{
  "reservationId": "RES-12345",
  "customerPhone": "+84901234567",
  "customerName": "John Doe",
  "vehicleModel": "Tesla Model Y",
  "colorName": "Pearl White",
  "reservedAt": "2025-01-15T14:30:00Z"
}
```

#### TestDriveScheduledEvent

```json
{
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "vehicleModel": "Tesla Model S",
  "scheduledDate": "2025-02-15T10:00:00Z"
}
```

## Logging

Service sử dụng Serilog để ghi logs:

- **Console**: Output logs màu sắc trong terminal
- **File**: Ghi logs vào `Logs/notification-service-YYYYMMDD.log`

Log level có thể cấu hình trong `appsettings.json`:

```json
"Serilog": {
  "MinimumLevel": {
    "Default": "Information",
    "Override": {
      "Microsoft": "Warning",
      "System": "Warning"
    }
  }
}
```

## Testing

### Test với Postman

1. Import collection từ `NotificationService.http`
2. Cập nhật environment variables (email, phone, API keys)
3. Gửi test requests

### Test RabbitMQ Integration

```bash
# Publish test message to queue
# (Cần RabbitMQ Management plugin hoặc code publisher)
```

## Troubleshooting

### SendGrid Email không gửi

- Kiểm tra API Key hợp lệ
- Verify sender email trong SendGrid dashboard
- Kiểm tra logs trong `Logs/` folder

### Twilio SMS không gửi

- Kiểm tra AccountSid và AuthToken
- Verify phone number format (+84901234567)
- Kiểm tra Twilio account balance

### RabbitMQ connection failed

- Kiểm tra RabbitMQ đang chạy: `docker ps` hoặc `rabbitmqctl status`
- Kiểm tra credentials trong appsettings.json
- Kiểm tra port 5672 không bị block

## Architecture Notes

- Service sử dụng **Scoped** lifetime cho EmailService và SmsService để đảm bảo thread-safety
- RabbitMQ consumers chạy trong **Background Service** (Hosted Service)
- Mỗi queue có một channel riêng để tránh conflict
- Message acknowledgment được xử lý manually (BasicAck/BasicNack)

## Dependencies

- `SendGrid` (9.29.3) - Email service provider
- `Twilio` (7.13.7) - SMS service provider
- `RabbitMQ.Client` (6.8.1) - RabbitMQ client library
- `Serilog.AspNetCore` (9.0.0) - Structured logging
- `MassTransit` (8.2.3) - Message bus abstraction (optional)

## Next Steps

- [ ] Add notification templates (HTML/SMS templates)
- [ ] Implement retry logic with exponential backoff
- [ ] Add notification history/persistence
- [ ] Add health checks for SendGrid/Twilio
- [ ] Add metrics and monitoring
- [ ] Add unit tests and integration tests
