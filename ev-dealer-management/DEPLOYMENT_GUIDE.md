# 🚀 EV DEALER MANAGEMENT - DEPLOYMENT GUIDE

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Services Overview](#services-overview)
3. [Quick Start (Development)](#quick-start-development)
4. [Production Deployment](#production-deployment)
5. [Service Configuration](#service-configuration)
6. [Troubleshooting](#troubleshooting)
7. [Health Checks](#health-checks)

---

## 🖥️ System Requirements

### Development Environment:
- **OS**: Windows 10/11, Linux, macOS
- **.NET SDK**: 8.0 or later
- **Node.js**: 18.x or later
- **Docker**: Latest stable version
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: 10GB free space

### Production Environment:
- **Container Runtime**: Docker with Docker Compose
- **RAM**: 16GB minimum
- **CPU**: 4 cores minimum
- **Storage**: 50GB+ SSD

---

## 🏗️ Services Overview

### Backend Services:

| Service | Port | Description | Dependencies |
|---------|------|-------------|--------------|
| **APIGatewayService** | 5036 | Ocelot API Gateway | All services |
| **UserService** | 7001 | Authentication & Users | SQL Server |
| **CustomerService** | 5039 | Customer Management | SQL Server, RabbitMQ |
| **VehicleService** | 5002 | Vehicle Management | SQL Server, RabbitMQ |
| **SalesService** | 5003 | Sales & Orders | RabbitMQ |
| **NotificationService** | 5051 | Email & SMS Notifications | RabbitMQ, SendGrid, Twilio |
| **DealerManagementService** | TBD | Dealer Management | SQL Server |

### Infrastructure:

| Component | Port | Credentials |
|-----------|------|-------------|
| **RabbitMQ** | 5672 (AMQP), 15672 (UI) | guest/guest |
| **SQL Server** | 1433 | sa/YourPassword |
| **Frontend** | 5173 (dev), 3000 (prod) | - |

---

## ⚡ Quick Start (Development)

### Option 1: Automated Script (Recommended)

```powershell
# Navigate to project directory
cd D:\Nam_3\ev-dealer-management\ev-dealer-management

# Start all services
.\start-all-services.ps1

# Wait for services to start (15-20 seconds)

# Run comprehensive tests
.\test-all-flows.ps1
```

### Option 2: Manual Start

#### 1. Start RabbitMQ
```bash
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management
```

#### 2. Start Backend Services (Open 3 separate terminals)

**Terminal 1 - NotificationService:**
```powershell
cd ev-dealer-management\NotificationService
dotnet run
```

**Terminal 2 - SalesService:**
```powershell
cd ev-dealer-management\SalesService
dotnet run
```

**Terminal 3 - VehicleService:**
```powershell
cd ev-dealer-management\VehicleService
dotnet run
```

#### 3. Start Frontend
```powershell
cd ev-dealer-frontend
npm install
npm run dev
```

#### 4. Verify Services
- RabbitMQ UI: http://localhost:15672 (guest/guest)
- NotificationService: http://localhost:5051/notifications/health
- SalesService: http://localhost:5003/api/orders/health
- VehicleService: http://localhost:5002/health
- Frontend: http://localhost:5173

---

## 🐳 Production Deployment

### Using Docker Compose

#### 1. Create Production docker-compose.yml

```yaml
version: '3.8'

services:
  rabbitmq:
    image: rabbitmq:3-management
    container_name: ev-dealer-rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - ev-dealer-network
    restart: unless-stopped

  notification-service:
    build:
      context: ./NotificationService
      dockerfile: Dockerfile
    container_name: ev-dealer-notification
    ports:
      - "5051:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - RabbitMQ__Host=rabbitmq
      - RabbitMQ__Port=5672
      - SendGrid__ApiKey=${SENDGRID_API_KEY}
      - Twilio__AccountSid=${TWILIO_ACCOUNT_SID}
      - Twilio__AuthToken=${TWILIO_AUTH_TOKEN}
      - Twilio__PhoneNumber=${TWILIO_PHONE_NUMBER}
    depends_on:
      - rabbitmq
    networks:
      - ev-dealer-network
    restart: unless-stopped

  sales-service:
    build:
      context: ./SalesService
      dockerfile: Dockerfile
    container_name: ev-dealer-sales
    ports:
      - "5003:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - RabbitMQ__Host=rabbitmq
      - RabbitMQ__Port=5672
    depends_on:
      - rabbitmq
    networks:
      - ev-dealer-network
    restart: unless-stopped

  vehicle-service:
    build:
      context: ./VehicleService
      dockerfile: Dockerfile
    container_name: ev-dealer-vehicle
    ports:
      - "5002:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=${VEHICLE_DB_CONNECTION}
      - RabbitMQ__Host=rabbitmq
      - RabbitMQ__Port=5672
    depends_on:
      - rabbitmq
    networks:
      - ev-dealer-network
    restart: unless-stopped

  api-gateway:
    build:
      context: ./APIGatewayService
      dockerfile: Dockerfile
    container_name: ev-dealer-gateway
    ports:
      - "5036:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    depends_on:
      - notification-service
      - sales-service
      - vehicle-service
    networks:
      - ev-dealer-network
    restart: unless-stopped

  frontend:
    build:
      context: ./ev-dealer-frontend
      dockerfile: Dockerfile
    container_name: ev-dealer-frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://api-gateway
    depends_on:
      - api-gateway
    networks:
      - ev-dealer-network
    restart: unless-stopped

volumes:
  rabbitmq_data:

networks:
  ev-dealer-network:
    driver: bridge
```

#### 2. Create .env file

```env
# RabbitMQ
RABBITMQ_PASSWORD=your_secure_password_here

# SendGrid (Email)
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Database
VEHICLE_DB_CONNECTION=Server=sqlserver;Database=VehicleDB;User=sa;Password=YourPassword;
```

#### 3. Deploy

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## ⚙️ Service Configuration

### NotificationService

**appsettings.json:**
```json
{
  "RabbitMQ": {
    "Host": "localhost",
    "Port": 5672
  },
  "SendGrid": {
    "ApiKey": "YOUR_SENDGRID_API_KEY",
    "FromEmail": "noreply@evdealer.com",
    "FromName": "EV Dealer Management"
  },
  "Twilio": {
    "AccountSid": "YOUR_TWILIO_ACCOUNT_SID",
    "AuthToken": "YOUR_TWILIO_AUTH_TOKEN",
    "PhoneNumber": "+1234567890"
  },
  "SMS": {
    "MockMode": true
  }
}
```

**Environment Variables:**
- `SENDGRID_API_KEY`: SendGrid API key for email
- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio auth token
- `SMS_MOCK_MODE`: Set to `false` in production

### SalesService

**appsettings.json:**
```json
{
  "RabbitMQ": {
    "Host": "localhost",
    "Port": 5672
  }
}
```

### VehicleService

**appsettings.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VehicleDB;..."
  },
  "RabbitMQ": {
    "Host": "localhost",
    "Port": 5672
  }
}
```

---

## 🔧 Troubleshooting

### Issue: RabbitMQ Connection Failed

**Symptoms:**
```
Failed to connect to RabbitMQ at localhost:5672
```

**Solutions:**
1. Check RabbitMQ is running:
   ```bash
   docker ps | grep rabbitmq
   ```

2. Restart RabbitMQ:
   ```bash
   docker restart rabbitmq
   ```

3. Check port not blocked:
   ```powershell
   netstat -ano | findstr :5672
   ```

### Issue: Service Port Already in Use

**Symptoms:**
```
Failed to bind to address http://127.0.0.1:5003: address already in use
```

**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :5003

# Kill process (replace PID)
taskkill /F /PID <PID>
```

### Issue: CORS Error in Frontend

**Symptoms:**
```
Access to fetch at 'http://localhost:5003/api/orders/complete' has been blocked by CORS policy
```

**Solution:**
Ensure service has CORS configured:
```csharp
// In Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

app.UseCors("AllowFrontend");
```

### Issue: Email Not Sending

**Check:**
1. SendGrid API key is valid
2. "From" email is verified in SendGrid
3. Check NotificationService logs:
   ```
   [ERR] SendGrid API error: ...
   ```

**Test SendGrid:**
```bash
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer YOUR_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"noreply@evdealer.com"},"subject":"Test","content":[{"type":"text/plain","value":"Test email"}]}'
```

### Issue: SMS Not Sending (Mock Mode)

**Expected Behavior in Development:**
```
[INF] SMS Mock Mode: Would send to +84912345678: "Your vehicle reservation..."
```

**To enable real SMS in Production:**
1. Set `SMS__MockMode` to `false` in appsettings.json
2. Ensure Twilio credentials are valid
3. Verify phone number format: `+[country_code][number]`

---

## ✅ Health Checks

### Manual Health Checks

```powershell
# NotificationService
curl http://localhost:5051/notifications/health

# SalesService
curl http://localhost:5003/api/orders/health

# VehicleService
curl http://localhost:5002/health

# RabbitMQ
curl http://localhost:15672 -u guest:guest

# API Gateway
curl http://localhost:5036
```

### Automated Health Check Script

```powershell
# Save as check-health.ps1
$services = @(
    @{ Name="RabbitMQ UI"; Url="http://localhost:15672" },
    @{ Name="NotificationService"; Url="http://localhost:5051/notifications/health" },
    @{ Name="SalesService"; Url="http://localhost:5003/api/orders/health" },
    @{ Name="VehicleService"; Url="http://localhost:5002/health" }
)

foreach ($service in $services) {
    Write-Host "$($service.Name): " -NoNewline
    try {
        $response = Invoke-RestMethod -Uri $service.Url -TimeoutSec 3
        Write-Host "✅ OK" -ForegroundColor Green
    } catch {
        Write-Host "❌ DOWN" -ForegroundColor Red
    }
}
```

---

## 📊 Monitoring

### RabbitMQ Queue Monitoring

1. Open RabbitMQ Management UI: http://localhost:15672
2. Login: `guest` / `guest`
3. Check queues:
   - `sales.completed` - Order completion emails
   - `vehicle.reserved` - Vehicle reservation SMS
   - `testdrive.scheduled` - Test drive confirmations

### Service Logs

**View logs in terminal:**
- Each service outputs logs to console in development
- Look for:
  - `[INF]` - Information
  - `[WRN]` - Warnings
  - `[ERR]` - Errors

**Production logging:**
- Configure Serilog to write to files
- Use log aggregation (e.g., ELK Stack, Seq)

---

## 🔐 Security Considerations

### Production Checklist:

- [ ] Change RabbitMQ default credentials
- [ ] Use HTTPS for all services
- [ ] Store secrets in environment variables or Azure Key Vault
- [ ] Enable authentication on API Gateway
- [ ] Configure firewall rules
- [ ] Set up SSL certificates
- [ ] Disable Swagger UI in production
- [ ] Enable rate limiting
- [ ] Configure CORS for production domains only
- [ ] Regular security updates

---

## 📚 Additional Resources

- **RabbitMQ Documentation**: https://www.rabbitmq.com/documentation.html
- **SendGrid API Docs**: https://docs.sendgrid.com/
- **Twilio SMS Docs**: https://www.twilio.com/docs/sms
- **Ocelot Gateway**: https://ocelot.readthedocs.io/
- **.NET 8 Docs**: https://learn.microsoft.com/en-us/dotnet/

---

## 🆘 Support

For issues or questions:
1. Check logs in service terminals
2. Verify all services are running
3. Check RabbitMQ queue status
4. Review this troubleshooting guide
5. Check service-specific README files

---

**Last Updated**: November 22, 2025  
**Version**: 1.0.0
