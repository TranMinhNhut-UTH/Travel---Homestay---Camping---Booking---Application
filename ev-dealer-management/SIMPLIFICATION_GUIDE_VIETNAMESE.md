# 🎓 HƯỚNG DẪN ĐƠNGIẢN HÓA PROJECT CHO SINH VIÊN

**Mục tiêu:** Loại bỏ RabbitMQ và Notification Service để chạy project cục bộ (Local) dễ dàng hơn.

---

## 📊 HIỆN TRẠNG PROJECT

### Kiến trúc hiện tại (Complex):
```
[Frontend] → [API Gateway] → [Services] ↔ [RabbitMQ] ↔ [NotificationService]
                                ↓
                           [SQL Server / SQLite]
```

### Các Services hiện có:
| Service | Port | Chức năng | RabbitMQ? | Notification? |
|---------|------|----------|-----------|---------------|
| **UserService** | 5223 | Quản lý người dùng | ❌ | ❌ |
| **VehicleService** | 5224 | Quản lý xe hơi | ✅ Producer | ❌ |
| **SalesService** | 5003 | Quản lý bán hàng | ✅ Producer | ❌ |
| **CustomerService** | 5039 | Quản lý khách hàng | ✅ Consumer | ❌ |
| **NotificationService** | 5051 | Gửi FCM/Email | ✅ Consumer | ✅ Firebase FCM |
| **ReportingService** | - | Báo cáo | ❌ | ❌ |
| **DealerManagementService** | - | Quản lý đại lý | ❌ | ❌ |
| **APIGatewayService** | 5000 | Gateway | ❌ | ❌ |

---

## 🔍 PHÁT HIỆN CÁC FILE CẦN SỬA

### 1️⃣ RabbitMQ References

**Services sử dụng RabbitMQ:**
- ✅ **VehicleService**
  - `VehicleService/Services/RabbitMQProducerService.cs` 
  - `VehicleService/Messaging/RabbitMQProducer.cs`
  - `VehicleService/Program.cs` (line ~20-23)

- ✅ **SalesService**
  - `SalesService/Services/RabbitMQMessagePublisher.cs`
  - `SalesService/Program.cs` (line ~52)

- ✅ **CustomerService**
  - `CustomerService/Services/RabbitMQConsumerService.cs`
  - `CustomerService/Services/MessageConsumerHostedService.cs`
  - `CustomerService/Program.cs`

- ✅ **NotificationService** (PRODUCER + CONSUMER)
  - `NotificationService/Consumers/` (SaleCompletedConsumer, VehicleReservedConsumer, TestDriveScheduledConsumer)
  - `NotificationService/Services/RabbitMQConsumerService.cs`
  - `NotificationService/Services/RabbitMQConsumerHostedService.cs`
  - `NotificationService/Program.cs`

**NuGet Packages cần xóa:**
- `RabbitMQ.Client` (tất cả services)
- `MassTransit.RabbitMQ` (NotificationService)

### 2️⃣ Notification References

**Services sử dụng Notification:**
- ✅ **NotificationService**
  - `NotificationService/Services/FirebaseFcmService.cs`
  - `NotificationService/Consumers/` (Firebase FCM calls)
  - `NotificationService/Program.cs` (Firebase registration)
  - NuGet: `FirebaseAdmin` (v3.0.1)

**Các files config:**
- `ev-dealer-management/firebase-debug.html`
- `NotificationService/FIREBASE_SETUP.md`
- `appsettings.json` (Firebase credentials)

### 3️⃣ Docker-Compose Changes

**Hiện tại:**
```yaml
services:
  - userservice
  - vehicleservice  (depends_on: rabbitmq)
  - salesservice    (depends_on: rabbitmq, vehicleservice)
  - rabbitmq        (❌ XÓA)
```

**Sau khi đơn giản hóa:**
```yaml
services:
  - userservice
  - vehicleservice  (❌ xóa RabbitMQ dependency)
  - salesservice    (❌ xóa RabbitMQ dependency)
  - (❌ XÓA rabbitmq)
```

### 4️⃣ appsettings.json Changes

**Xóa các key:**
```json
{
  "RabbitMQ": {
    "HostName": "rabbitmq",
    "Port": 5672,
    "UserName": "guest",
    "Password": "guest"
  },
  "Firebase": {
    "CredentialsPath": "path/to/credentials.json"
  }
}
```

---

## ✂️ PLAN XÓA - STEP BY STEP

### BƯỚC 1: Xóa NotificationService (Toàn bộ folder)

**Lý do:** Service này chỉ phục vụ Firebase notifications, không cần thiết cho MVP.

```bash
# Xóa folder
rm -r ev-dealer-management/NotificationService

# Xóa project khỏi Solution
# File: DealerSystem.sln
# Tìm và xóa dòng:
# Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "NotificationService"...
```

**Kết quả:** ✅ Không còn Firebase, RabbitMQ Consumer

---

### BƯỚC 2: Xóa RabbitMQ từ VehicleService

**File 1:** `VehicleService/Program.cs`
```csharp
// ❌ XÓA lines:
builder.Services.AddSingleton<VehicleService.Services.IMessageProducer, 
    VehicleService.Services.RabbitMQProducerService>();
builder.Services.AddSingleton<VehicleService.Messaging.IMessageProducer, 
    VehicleService.Messaging.RabbitMQProducer>();

// ✅ Giữ lại:
builder.Services.AddScoped<IVehicleService, VehicleService.Services.VehicleService>();
```

**File 2:** `VehicleService/VehicleService.csproj`
```xml
<!-- ❌ XÓA line: -->
<PackageReference Include="RabbitMQ.Client" Version="6.6.0" />
```

**Files cần XÓA:**
- `VehicleService/Services/RabbitMQProducerService.cs`
- `VehicleService/Messaging/RabbitMQProducer.cs`
- `VehicleService/Messaging/` (folder nếu chỉ có RabbitMQ files)

**Controllers cần sửa:**
- `VehicleService/Controllers/VehiclesController.cs` - xóa IMessageProducer injection
- `VehicleService/Controllers/ReservationsController.cs` - xóa IMessageProducer injection

---

### BƯỚC 3: Xóa RabbitMQ từ SalesService

**File 1:** `SalesService/Program.cs`
```csharp
// ❌ XÓA line:
builder.Services.AddSingleton<IMessagePublisher, RabbitMQMessagePublisher>();
```

**File 2:** `SalesService/SalesService.csproj`
```xml
<!-- ❌ XÓA line: -->
<PackageReference Include="RabbitMQ.Client" Version="6.6.0" />
```

**Files cần XÓA:**
- `SalesService/Services/RabbitMQMessagePublisher.cs`
- `SalesService/Interfaces/IMessagePublisher.cs` (nếu không dùng ở đây khác)

**Controllers cần sửa:**
- `SalesService/Controllers/OrdersController.cs` - xóa IMessagePublisher injection
- Xóa code publish messages như:
  ```csharp
  // ❌ XÓA:
  await _messagePublisher.PublishAsync("order.created", order);
  ```

---

### BƯỚC 4: Xóa RabbitMQ từ CustomerService

**File 1:** `CustomerService/Program.cs`
```csharp
// ❌ XÓA lines:
builder.Services.AddSingleton<IMessageConsumer, RabbitMQConsumerService>();
builder.Services.AddHostedService<MessageConsumerHostedService>();
```

**File 2:** `CustomerService/CustomerService.csproj`
```xml
<!-- ❌ XÓA line: -->
<PackageReference Include="RabbitMQ.Client" Version="6.8.1" />
```

**Files cần XÓA:**
- `CustomerService/Services/RabbitMQConsumerService.cs`
- `CustomerService/Services/MessageConsumerHostedService.cs`
- `CustomerService/Consumers/` (nếu có - xóa toàn bộ)

---

### BƯỚC 5: Xóa RabbitMQ từ docker-compose.yml

**Trước:**
```yaml
services:
  vehicleservice:
    depends_on:
      rabbitmq:
        condition: service_healthy

  salesservice:
    depends_on:
      rabbitmq:
        condition: service_healthy
      vehicleservice:
        condition: service_started

  rabbitmq:
    image: "rabbitmq:3-management"
    ports:
      - "5672:5672"
      - "15672:15672"
    ...

volumes:
  rabbitmq_data:
  rabbitmq_logs:
```

**Sau:**
```yaml
services:
  vehicleservice:
    environment:
      # ❌ XÓA RabbitMQ settings
      # ✅ Giữ lại rest
    # ❌ XÓA depends_on: rabbitmq
    networks:
      - ev-dealer-network

  salesservice:
    environment:
      # ❌ XÓA RabbitMQ settings
      # ✅ Giữ lại rest
    depends_on:
      vehicleservice:
        condition: service_started
    # ❌ THAY ĐỔI: Xóa rabbitmq dependency

  # ❌ XÓA toàn bộ rabbitmq service:
  # rabbitmq:
  #   image: "rabbitmq:3-management"
  #   ...

# ❌ XÓA volumes:
# volumes:
#   rabbitmq_data:
#   rabbitmq_logs:
```

---

### BƯỚC 6: Sửa appsettings.json (Tất cả services)

**Xóa từ tất cả `appsettings.json` files:**
```json
// ❌ XÓA:
"RabbitMQ": {
  "HostName": "localhost",
  "Port": 5672,
  "UserName": "guest",
  "Password": "guest"
}
```

---

## 🔗 DEPENDENCIES - PHÂN TÍCH

### Services không phụ thuộc vào RabbitMQ:
- ✅ **UserService** - Độc lập (chỉ xác thực)
- ✅ **ReportingService** - Có thể độc lập
- ✅ **DealerManagementService** - Có thể độc lập
- ✅ **APIGatewayService** - Không phụ thuộc (chỉ route requests)

### Thay đổi logic cần thiết:

**VehicleService (không còn publish events):**
- Xóa: Publish "vehicle.created", "reservation.made"
- ✅ Vẫn lưu vào DB bình thường
- ❌ Khách hàng sẽ KHÔNG nhận notification qua FCM (không quan trọng cho MVP)

**SalesService (không còn publish events):**
- Xóa: Publish "order.created", "order.completed"
- ✅ Vẫn lưu vào DB bình thường
- ❌ Khách hàng sẽ KHÔNG nhận notification qua FCM

**CustomerService (không còn listen events):**
- ✅ Vẫn hoạt động bình thường (chỉ quản lý khách hàng)
- ❌ Không update trạng thái từ các events khác

---

## 📋 FINAL SIMPLIFIED ARCHITECTURE

```
┌─────────────┐
│   Frontend  │
│  (React)    │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  API Gateway     │
│  (Port 5000)     │
└──────┬───────────┘
       │
       ├──► UserService (5223) ──┐
       │                          ├─► SQLite
       ├──► VehicleService (5224)┤
       │                          ├─► SQLite
       ├──► SalesService (5003) ──┤
       │                          ├─► SQLite
       └──► CustomerService ──────┘
            (OPTIONAL)
```

**Remaining Services:**
- ✅ UserService (Auth)
- ✅ VehicleService (Vehicle Management)
- ✅ SalesService (Orders & Sales)
- ✅ CustomerService (Customer Data)
- ✅ ReportingService (Reports)
- ✅ DealerManagementService (Dealer Mgmt)
- ✅ APIGatewayService (Routing)

**Xóa:**
- ❌ NotificationService (Firebase, FCM)
- ❌ RabbitMQ (Message Queue)

---

## 🚀 HƯỚNG DẪN CHẠY PROJECT (ĐƠN GIẢN HÓA)

### 📋 Yêu cầu:
- ✅ Visual Studio 2022+ hoặc VSCode + .NET 8 SDK
- ✅ Docker Desktop (nếu dùng Docker Compose)
- ✅ Git
- ❌ KHÔNG cần RabbitMQ
- ❌ KHÔNG cần Firebase credentials

---

## CÁCH 1: CHẠY TỪNG SERVICE RIÊNG (Dễ nhất cho Debug)

### Step 1: Mở Terminal tại `ev-dealer-management` folder

```bash
cd ev-dealer-management/ev-dealer-management
```

### Step 2: Chạy Services theo thứ tự

**Terminal 1 - UserService:**
```bash
cd UserService
dotnet restore
dotnet run
# ✅ Output: http://localhost:5223
# ✅ Swagger: http://localhost:5223/swagger
```

**Terminal 2 - VehicleService:**
```bash
cd VehicleService
dotnet restore
dotnet run
# ✅ Output: http://localhost:5224
# ✅ Swagger: http://localhost:5224/swagger
```

**Terminal 3 - SalesService:**
```bash
cd SalesService
dotnet restore
dotnet run
# ✅ Output: http://localhost:5003
# ✅ Swagger: http://localhost:5003/swagger
```

**Terminal 4 - APIGatewayService:**
```bash
cd APIGatewayService
dotnet restore
dotnet run
# ✅ Output: http://localhost:5000
```

### Step 3: Test APIs

**API Gateway:**
- http://localhost:5000 (tất cả requests được route)

**Swagger Docs:**
- UserService: http://localhost:5223/swagger
- VehicleService: http://localhost:5224/swagger
- SalesService: http://localhost:5003/swagger

---

## CÁCH 2: CHẠY BẰNG DOCKER COMPOSE (Sau khi đơn giản hóa)

### Step 1: Xóa RabbitMQ service từ docker-compose.yml

Xem hướng dẫn ở phần "BƯỚC 5" ở trên

### Step 2: Build & Run

```bash
cd ev-dealer-management/ev-dealer-management

# Build images
docker-compose build

# Run services
docker-compose up -d

# Check status
docker-compose ps

# Output:
# NAME              STATUS        PORTS
# evm_userservice   Up 5s        5223:80
# evm_vehicleservice Up 5s       5224:8080
# evm_salesservice  Up 5s        5003:80
```

### Step 3: Test

```bash
# Check UserService health
curl http://localhost:5223/swagger

# Check VehicleService health
curl http://localhost:5224/swagger

# Check SalesService health
curl http://localhost:5003/swagger
```

### Step 4: Stop

```bash
docker-compose down
```

---

## 🧪 KIỂM TRA HOẠT ĐỘNG

### Test 1: Register User

```powershell
$url = "http://localhost:5223/api/auth/register"
$body = @{
    email = "user@example.com"
    password = "Pass123!"
    fullName = "John Doe"
    role = "Customer"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
Write-Output $response

# ✅ Expected: {"token": "...", "userId": "..."}
```

### Test 2: List Vehicles

```powershell
$url = "http://localhost:5224/api/vehicles"
$response = Invoke-RestMethod -Uri $url -Method Get
Write-Output $response

# ✅ Expected: Array of vehicles
```

### Test 3: Create Order

```powershell
$token = "YOUR_JWT_TOKEN"  # Từ Register API
$url = "http://localhost:5003/api/orders"
$body = @{
    vehicleId = 1
    customerId = 1
    quantity = 1
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri $url `
  -Method Post `
  -Body $body `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $token" }

Write-Output $response

# ✅ Expected: {"orderId": "...", "status": "Pending"}
```

---

## 📊 REQUIRED PORTS (Verify No Conflicts)

| Service | Port | Protocol | Status |
|---------|------|----------|--------|
| UserService | 5223 | HTTP | ✅ |
| VehicleService | 5224 | HTTP | ✅ |
| SalesService | 5003 | HTTP | ✅ |
| APIGateway | 5000 | HTTP | ✅ |
| Frontend | 5173 | HTTP | ✅ (React Dev Server) |
| **RabbitMQ** | **5672** | **AMQP** | ❌ **REMOVED** |
| **RabbitMQ UI** | **15672** | **HTTP** | ❌ **REMOVED** |

**Kiểm tra port conflicts:**
```powershell
# Windows
netstat -ano | findstr "5223 5224 5003 5000 5173"

# Linux/Mac
lsof -i :5223
lsof -i :5224
lsof -i :5003
```

---

## ⚠️ LỖI PHỔ BIẾN & CÁC CÁCH FIX

### ❌ Lỗi 1: "RabbitMQ.Client not found"

**Nguyên nhân:** Package chưa được xóa khỏi .csproj

**Cách fix:**
```bash
cd VehicleService
dotnet restore  # Clear cache
rm -r bin obj   # Xóa build files
dotnet build
dotnet run
```

### ❌ Lỗi 2: "Connection refused on port 5672"

**Nguyên nhân:** Code vẫn cố kết nối RabbitMQ

**Cách fix:**
1. Kiểm tra Program.cs - xóa RabbitMQ registration
2. Kiểm tra Controllers - xóa IMessageProducer injection
3. Clean rebuild:
```bash
dotnet clean
dotnet build
dotnet run
```

### ❌ Lỗi 3: "Port already in use"

**Nguyên nhân:** Service khác đang chạy trên port

**Cách fix:**
```powershell
# Tìm process đang dùng port
Get-NetTCPConnection -LocalPort 5223 | Select-Object OwningProcess

# Kill process
Stop-Process -Id <PID> -Force
```

### ❌ Lỗi 4: "Database locked" (SQLite)

**Nguyên nhân:** Multiple processes truy cập SQLite cùng lúc

**Cách fix:**
```bash
# Xóa SQLite files
rm -r VehicleService/data/vehicles.db*
rm -r SalesService/data/sales.db*
rm -r UserService/data/users.db*

# Chạy lại (sẽ recreate DB)
dotnet run
```

### ❌ Lỗi 5: "CORS error - frontend cannot call backend"

**Nguyên nhân:** CORS policy chưa setup

**Cách fix - thêm vào Program.cs:**
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// ...trong app setup:
app.UseCors("AllowFrontend");
```

---

## 🎯 QUICK START CHECKLIST

### ☑️ Pre-flight:
- [ ] .NET 8 SDK installed: `dotnet --version`
- [ ] Visual Studio 2022 hoặc VSCode
- [ ] Git clone project
- [ ] Ports 5000, 5003, 5223, 5224, 5173 không bị occupied

### ☑️ Simplification (One-time):
- [ ] Xóa NotificationService folder
- [ ] Update VehicleService (Program.cs + .csproj + remove RabbitMQ files)
- [ ] Update SalesService (Program.cs + .csproj + remove RabbitMQ files)
- [ ] Update CustomerService (Program.cs + .csproj + remove RabbitMQ files)
- [ ] Update docker-compose.yml (xóa RabbitMQ service)
- [ ] Remove RabbitMQ settings từ appsettings.json

### ☑️ Build (Per session):

**Cách 1 - Terminal:**
```bash
# Terminal 1
cd ev-dealer-management/ev-dealer-management/UserService && dotnet run

# Terminal 2
cd ev-dealer-management/ev-dealer-management/VehicleService && dotnet run

# Terminal 3
cd ev-dealer-management/ev-dealer-management/SalesService && dotnet run

# Terminal 4
cd ev-dealer-management/ev-dealer-management/APIGatewayService && dotnet run
```

**Cách 2 - Docker:**
```bash
cd ev-dealer-management/ev-dealer-management
docker-compose build
docker-compose up -d
docker-compose logs -f
```

### ☑️ Verify:
- [ ] UserService: `curl http://localhost:5223/swagger`
- [ ] VehicleService: `curl http://localhost:5224/swagger`
- [ ] SalesService: `curl http://localhost:5003/swagger`
- [ ] APIGateway: `curl http://localhost:5000`

### ☑️ Test APIs:
- [ ] Register user (UserService)
- [ ] List vehicles (VehicleService)
- [ ] Create order (SalesService)

---

## 💡 CÁCH CHẠY FRONTEND

```bash
# Nếu chưa có node_modules
cd ev-dealer-frontend
npm install

# Start dev server
npm run dev

# ✅ Output: http://localhost:5173
```

**Frontend sẽ gọi API Gateway:**
```
http://localhost:5000/api/...
```

---

## 📚 TỔNG KẾT THAY ĐỔI

| Item | Trước | Sau | Ghi chú |
|------|-------|-----|---------|
| Services | 8 (+ RabbitMQ) | 7 | Xóa NotificationService |
| RabbitMQ | ✅ Bắt buộc | ❌ Xóa | Simplify infrastructure |
| Firebase | ✅ FCM Active | ❌ Xóa | Push notifications removed |
| Docker Compose | 4 services + RabbitMQ | 3 services | Lightweight |
| Database | SQLite (các service) | SQLite (giữ) | Simpler than SQL Server |
| Setup Time | 15+ min (RabbitMQ wait) | <5 min | Faster startup |
| Local Dev | Khó debug (async) | Dễ debug (sync) | Better for learning |
| Message Flow | Async (Event-driven) | Direct HTTP calls | Simpler architecture |

---

## 🎓 LỢI ÍCH CHO SINH VIÊN

✅ **Dễ setup:** Không cần RabbitMQ, Firebase config  
✅ **Dễ debug:** Xóa async complexity  
✅ **Dễ hiểu:** Direct HTTP calls, không event-driven  
✅ **Nhanh:** Startup trong 30 giây (không chờ RabbitMQ)  
✅ **Lightweight:** Chạy trên máy yếu (no Docker needed)  
✅ **Focused:** Tập trung vào business logic  

---

## 📞 SUPPORT

**Nếu gặp lỗi:**
1. Kiểm tra "LỖI PHỔ BIẾN & CÁC CÁCH FIX"
2. Kiểm tra ports: `netstat -ano | findstr "5223 5224 5003"`
3. Clean rebuild: `dotnet clean && dotnet build`
4. Check logs: `dotnet run` (xem console output)

**Files quan trọng:**
- `.github/workflows/create-jira-issues.yml` (CI/CD)
- `docker-compose.yml` (orchestration)
- `appsettings.json` (configuration)
- `Program.cs` (dependency injection)

---

**Tài liệu cập nhật:** 27/05/2026  
**Cho:** University Team Project  
**Mục tiêu:** ✅ 100% Local Runnable
