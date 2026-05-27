# ⚡ QUICK REMOVAL CHECKLIST - BƯỚC THỰC HIỆN

**Thời gian ước tính:** 30 phút  
**Độ khó:** ⭐⭐ (Trung bình)  
**Công cụ:** Visual Studio Code + Terminal  

---

## 🎯 PHẦN 1: Xóa NotificationService (5 phút)

### Step 1.1: Xóa folder

```bash
# PowerShell
cd "ev-dealer-management/ev-dealer-management"
Remove-Item -Recurse -Force "NotificationService"

# Verify
ls # NotificationService should be gone
```

### Step 1.2: Cập nhật Solution File

**File:** `DealerSystem.sln`

Mở bằng **Notepad/VSCode**, tìm và **XÓA** dòng:
```
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "NotificationService", "NotificationService\NotificationService.csproj", "{...}"
	ProjectSection(ProjectDependencies) = postProject
	EndProjectSection
EndProject
```

**Verify:** Mở `DealerSystem.sln` trong Visual Studio - không báo lỗi missing project

✅ **Hoàn thành:** NotificationService xóa thành công

---

## 🎯 PHẦN 2: Sửa VehicleService (7 phút)

### Step 2.1: Xóa RabbitMQ files

```bash
cd VehicleService

# Xóa RabbitMQ producer files
Remove-Item -Force "Services/RabbitMQProducerService.cs"
Remove-Item -Recurse -Force "Messaging"  # Toàn bộ folder

# Verify
ls Services   # Không còn RabbitMQProducerService.cs
ls Messaging  # Folder không tồn tại hoặc trống
```

### Step 2.2: Update VehicleService.csproj

**File:** `VehicleService/VehicleService.csproj`

Tìm và **XÓA** dòng:
```xml
<PackageReference Include="RabbitMQ.Client" Version="6.6.0" />
```

### Step 2.3: Update Program.cs

**File:** `VehicleService/Program.cs`

**TÌM** và **XÓA** lines (~20-23):
```csharp
// ❌ XÓA ĐOẠN NÀY:
// Existing vehicle event producer (used inside VehicleService)
builder.Services.AddSingleton<VehicleService.Services.IMessageProducer, VehicleService.Services.RabbitMQProducerService>();

// Reservation event producer (used by ReservationsController)
builder.Services.AddSingleton<VehicleService.Messaging.IMessageProducer, VehicleService.Messaging.RabbitMQProducer>();
```

### Step 2.4: Update Controllers (Xóa injection)

**File:** `VehicleService/Controllers/VehiclesController.cs`

TÌM injections như:
```csharp
// ❌ XÓA:
private readonly IMessageProducer _messageProducer;

public VehiclesController(
    IVehicleService vehicleService,
    IMessageProducer messageProducer  // ❌ XÓA parameter
)
{
    _vehicleService = vehicleService;
    _messageProducer = messageProducer;  // ❌ XÓA line
}
```

TÌM và XÓA publish calls:
```csharp
// ❌ XÓA lines like:
await _messageProducer.PublishAsync("vehicle.created", vehicle);
await _messageProducer.PublishAsync("vehicle.updated", vehicle);
```

**Tương tự:** `VehicleService/Controllers/ReservationsController.cs`

### Step 2.5: Clean rebuild

```bash
cd VehicleService

# Clean
dotnet clean

# Restore (xóa old NuGet cache)
dotnet restore

# Build
dotnet build

# ✅ Expected: Build succeeded
```

### Step 2.6: Test

```bash
dotnet run

# ✅ Expected output:
# VehicleService listening on http://localhost:5224
# No RabbitMQ errors
```

✅ **Hoàn thành:** VehicleService cleaned

---

## 🎯 PHẦN 3: Sửa SalesService (7 phút)

### Step 3.1: Xóa RabbitMQ file

```bash
cd ../SalesService

# Xóa RabbitMQ publisher
Remove-Item -Force "Services/RabbitMQMessagePublisher.cs"

# Verify
ls Services  # Không còn RabbitMQMessagePublisher.cs
```

### Step 3.2: Update SalesService.csproj

**File:** `SalesService/SalesService.csproj`

**XÓA** dòng:
```xml
<PackageReference Include="RabbitMQ.Client" Version="6.6.0" />
```

### Step 3.3: Update Program.cs

**File:** `SalesService/Program.cs`

**TÌM** (~52):
```csharp
// ❌ XÓA:
// Register RabbitMQ Message Publisher
builder.Services.AddSingleton<IMessagePublisher, RabbitMQMessagePublisher>();
```

### Step 3.4: Update Controllers

**File:** `SalesService/Controllers/OrdersController.cs`

**XÓA** injection:
```csharp
// ❌ XÓA:
private readonly IMessagePublisher _messagePublisher;

public OrdersController(
    ...
    IMessagePublisher messagePublisher  // ❌ XÓA
)
{
    ...
    _messagePublisher = messagePublisher;  // ❌ XÓA
}
```

**XÓA** publish calls:
```csharp
// ❌ XÓA lines:
await _messagePublisher.PublishAsync("order.created", order);
await _messagePublisher.PublishAsync("order.completed", order);
```

### Step 3.5: Clean rebuild

```bash
dotnet clean
dotnet restore
dotnet build

# ✅ Build succeeded
```

### Step 3.6: Test

```bash
dotnet run

# ✅ Expected:
# SalesService listening on http://localhost:5003
```

✅ **Hoàn thành:** SalesService cleaned

---

## 🎯 PHẦN 4: Sửa CustomerService (7 phút)

### Step 4.1: Xóa RabbitMQ files

```bash
cd ../CustomerService

# Xóa consumer files
Remove-Item -Force "Services/RabbitMQConsumerService.cs"
Remove-Item -Force "Services/MessageConsumerHostedService.cs"
Remove-Item -Recurse -Force "Consumers"  # Xóa toàn bộ consumers folder

# Verify
ls Services    # Không còn RabbitMQ files
ls Consumers   # Folder không tồn tại hoặc trống
```

### Step 4.2: Update CustomerService.csproj

**File:** `CustomerService/CustomerService.csproj`

**XÓA** dòng:
```xml
<PackageReference Include="RabbitMQ.Client" Version="6.8.1" />
```

### Step 4.3: Update Program.cs

**File:** `CustomerService/Program.cs`

**TÌM** và **XÓA** lines:
```csharp
// ❌ XÓA:
builder.Services.AddSingleton<IMessageConsumer, RabbitMQConsumerService>();
builder.Services.AddHostedService<MessageConsumerHostedService>();
```

### Step 4.4: Clean rebuild

```bash
dotnet clean
dotnet restore
dotnet build

# ✅ Build succeeded
```

✅ **Hoàn thành:** CustomerService cleaned

---

## 🎯 PHẦN 5: Update docker-compose.yml (3 phút)

**File:** `docker-compose.yml`

### Step 5.1: Update VehicleService

**TÌM:**
```yaml
vehicleservice:
  ...
  environment:
    - ASPNETCORE_ENVIRONMENT=Development
    - ConnectionStrings__DefaultConnection=Data Source=/app/data/vehicles.db
    - RabbitMQ__HostName=rabbitmq       # ❌ XÓA
    - RabbitMQ__Port=5672               # ❌ XÓA
    - RabbitMQ__UserName=guest          # ❌ XÓA
    - RabbitMQ__Password=guest          # ❌ XÓA
  depends_on:
    rabbitmq:                            # ❌ XÓA BLOCK
      condition: service_healthy        # ❌ XÓA BLOCK
  networks:
    - ev-dealer-network
```

**THAY BẰNG:**
```yaml
vehicleservice:
  build: ./VehicleService
  image: evdealer/vehicleservice:local
  container_name: evm_vehicleservice
  ports:
    - "5224:8080"
  volumes:
    - ./VehicleService/data:/app/data
  environment:
    - ASPNETCORE_ENVIRONMENT=Development
    - ConnectionStrings__DefaultConnection=Data Source=/app/data/vehicles.db
  restart: unless-stopped
  networks:
    - ev-dealer-network
```

### Step 5.2: Update SalesService

**TÌM:**
```yaml
salesservice:
  ...
  environment:
    - ASPNETCORE_ENVIRONMENT=Development
    - ASPNETCORE_URLS=http://+:80
    - ConnectionStrings__DefaultConnection=Data Source=/app/data/sales.db
    - RabbitMQ__Host=rabbitmq                    # ❌ XÓA
    - RabbitMQ__Port=5672                        # ❌ XÓA
    - RabbitMQ__UserName=guest                   # ❌ XÓA
    - RabbitMQ__Password=guest                   # ❌ XÓA
    - RabbitMQ__Queues__SaleCompleted=...        # ❌ XÓA
    - RabbitMQ__Queues__OrderCreated=...         # ❌ XÓA
    - RabbitMQ__Queues__PaymentReceived=...      # ❌ XÓA
    - RabbitMQ__Queues__OrderStatusChanged=...   # ❌ XÓA
    - Services__VehicleService=http://vehicleservice:8080
  depends_on:
    rabbitmq:                                     # ❌ XÓA BLOCK
      condition: service_healthy                 # ❌ XÓA BLOCK
    vehicleservice:
      condition: service_started
```

**THAY BẰNG:**
```yaml
salesservice:
  build: ./SalesService
  image: evdealer/salesservice:local
  container_name: evm_salesservice
  ports:
    - "5003:80"
  volumes:
    - ./SalesService/data:/app/data
  environment:
    - ASPNETCORE_ENVIRONMENT=Development
    - ASPNETCORE_URLS=http://+:80
    - ConnectionStrings__DefaultConnection=Data Source=/app/data/sales.db
    - Services__VehicleService=http://vehicleservice:8080
  depends_on:
    vehicleservice:
      condition: service_started
  restart: unless-stopped
  networks:
    - ev-dealer-network
```

### Step 5.3: Xóa RabbitMQ service

**TÌM:**
```yaml
# ❌ XÓA TOÀN BỘ BLOCK NÀY:
rabbitmq:
  image: "rabbitmq:3-management"
  hostname: "rabbitmq"
  container_name: evm_rabbitmq
  ports:
    - "5672:5672"    # AMQP port
    - "15672:15672"  # Management UI port
  environment:
    RABBITMQ_DEFAULT_USER: guest
    RABBITMQ_DEFAULT_PASS: guest
    RABBITMQ_DEFAULT_VHOST: /
  volumes:
    - rabbitmq_data:/var/lib/rabbitmq
    - rabbitmq_logs:/var/log/rabbitmq
  healthcheck:
    test: ["CMD", "rabbitmq-diagnostics", "ping"]
    interval: 30s
    timeout: 10s
    retries: 5
    start_period: 40s
  restart: unless-stopped
  networks:
    - ev-dealer-network
```

### Step 5.4: Xóa RabbitMQ volumes

**TÌM:**
```yaml
volumes:
  rabbitmq_data:    # ❌ XÓA
    driver: local
  rabbitmq_logs:    # ❌ XÓA
    driver: local
```

**HOẶC** nếu có service khác dùng volumes (keep phần còn lại):
```yaml
volumes:
  # (nếu có service khác, keep chúng)
```

### Step 5.5: Verify file hợp lệ

```bash
# Kiểm tra YAML syntax
docker-compose config

# ✅ Expected: Output file content (no errors)
```

✅ **Hoàn thành:** docker-compose.yml cleaned

---

## 🎯 PHẦN 6: Xóa RabbitMQ từ appsettings (2 phút)

### Step 6.1: Tất cả appsettings.json files

**Files cần update:**
- `VehicleService/appsettings.json`
- `VehicleService/appsettings.Development.json`
- `SalesService/appsettings.json`
- `SalesService/appsettings.Development.json`
- `CustomerService/appsettings.json`
- `CustomerService/appsettings.Development.json`

**Trong mỗi file, TÌM:**
```json
{
  "RabbitMQ": {
    "HostName": "localhost",
    "Port": 5672,
    "UserName": "guest",
    "Password": "guest"
  }
}
```

**XÓA** toàn bộ block `"RabbitMQ": { ... }`

**VERIFY:** File vẫn valid JSON
```bash
# Trong PowerShell
$content = Get-Content "appsettings.json"
$json = $content | ConvertFrom-Json  # Không lỗi = OK
```

✅ **Hoàn thành:** appsettings cleaned

---

## ✅ FINAL VERIFICATION (3 phút)

### Check 1: Compile toàn bộ solution

```bash
cd ev-dealer-management/ev-dealer-management

# Build solution
dotnet build DealerSystem.sln

# ✅ Expected: Build succeeded with 0 errors
```

### Check 2: Không còn RabbitMQ references

```bash
# Tìm RabbitMQ strings
grep -r "RabbitMQ" . --include="*.cs" --include="*.csproj"

# ✅ Expected: Không có kết quả (hoặc chỉ comments)
```

### Check 3: Test từng service

```bash
# Terminal 1
cd VehicleService && dotnet run
# ✅ Expected: Listening on http://localhost:5224

# Terminal 2
cd ../SalesService && dotnet run
# ✅ Expected: Listening on http://localhost:5003

# Terminal 3
cd ../CustomerService && dotnet run
# ✅ Expected: Listening on http://localhost:5039
```

### Check 4: Docker Compose syntax

```bash
cd ..
docker-compose config

# ✅ Expected: Valid output
```

---

## 🎉 HOÀN THÀNH!

**Checklist:**
- [x] NotificationService xóa
- [x] VehicleService - RabbitMQ cleaned
- [x] SalesService - RabbitMQ cleaned
- [x] CustomerService - RabbitMQ cleaned
- [x] docker-compose.yml updated
- [x] appsettings.json cleaned
- [x] Build solution: OK
- [x] Compile toàn bộ services: OK

**Status:** ✅ **READY FOR LOCAL RUN**

---

## 🚀 CHẠY PROJECT LẦN ĐẦU TIÊN

```bash
# Cách 1: Terminal
cd ev-dealer-management/ev-dealer-management

# Terminal 1
cd UserService && dotnet run

# Terminal 2 (new)
cd ../VehicleService && dotnet run

# Terminal 3 (new)
cd ../SalesService && dotnet run

# Terminal 4 (new)
cd ../APIGatewayService && dotnet run
```

**Hoặc:**

```bash
# Cách 2: Docker
docker-compose build
docker-compose up -d
docker-compose logs -f
```

---

## 📚 File thay đổi tóm tắt

| Service | File Changes | Status |
|---------|-----------|--------|
| NotificationService | Toàn bộ folder XÓA | ✅ |
| VehicleService | Program.cs, .csproj, Controllers, RabbitMQ*.cs XÓA | ✅ |
| SalesService | Program.cs, .csproj, Controllers, RabbitMQ*.cs XÓA | ✅ |
| CustomerService | Program.cs, .csproj, RabbitMQ*.cs, Consumers/ XÓA | ✅ |
| DealerSystem.sln | NotificationService project XÓA | ✅ |
| docker-compose.yml | RabbitMQ service + env vars XÓA | ✅ |
| appsettings*.json | RabbitMQ section XÓA (tất cả services) | ✅ |

---

**Status:** READY FOR STUDENT USE ✅  
**Estimated time:** 30 minutes  
**Difficulty:** Medium ⭐⭐
