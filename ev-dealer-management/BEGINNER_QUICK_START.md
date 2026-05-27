# 🚀 BEGINNER QUICK START - ĐƠN GIẢN NHẤT

> **Mục tiêu:** Chạy project được trong 5 phút với 3 lệnh  
> **Cho:** Những bạn chỉ muốn chạy, không cần biết chi tiết

---

## ⚡ NHANH NHẤT: Copy-Paste 3 Commands

### Step 1: Chuẩn bị (1 lần duy nhất)

Mở **PowerShell** tại thư mục project:

```powershell
cd "C:\Path\To\ev-dealer-management\ev-dealer-management"
```

### Step 2: Clean build

```powershell
dotnet build DealerSystem.sln
```

✅ **Expected:** Build succeeded

### Step 3: Chạy từng service (4 terminal)

**Terminal 1 - UserService:**
```powershell
cd UserService
dotnet run
```
✅ **Thấy:** `Now listening on: http://localhost:5223`

**Terminal 2 - VehicleService:**
```powershell
cd ..\VehicleService
dotnet run
```
✅ **Thấy:** `Now listening on: http://localhost:5224`

**Terminal 3 - SalesService:**
```powershell
cd ..\SalesService
dotnet run
```
✅ **Thấy:** `Now listening on: http://localhost:5003`

**Terminal 4 - APIGateway:**
```powershell
cd ..\APIGatewayService
dotnet run
```
✅ **Thấy:** `Now listening on: http://localhost:5000`

---

## ✅ VERIFY - Chắc chắn chạy ok

Mở **browser**:

1. http://localhost:5223/swagger → ✅ UserService
2. http://localhost:5224/swagger → ✅ VehicleService  
3. http://localhost:5003/swagger → ✅ SalesService
4. http://localhost:5000 → ✅ Gateway

---

## 🎯 TEST QUICK API

### Register User (Ctrl+C để test này)

```powershell
# Paste vào PowerShell:
$body = @{
    email = "test@example.com"
    password = "Test123!"
    fullName = "John Doe"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5223/api/auth/register" `
  -Method Post -Body $body -ContentType "application/json"
```

✅ **Expected output:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "userId": "..."
}
```

### Get Vehicles

```powershell
Invoke-RestMethod -Uri "http://localhost:5224/api/vehicles" -Method Get
```

✅ **Expected:** List of vehicles

---

## 🔴 CÓ LỖI?

### Lỗi 1: "Port already in use"

**Fix:**
```powershell
# Tìm process đang dùng port
Get-NetTCPConnection -LocalPort 5223 | Select-Object OwningProcess

# Kill nó
Stop-Process -Id <PID> -Force
```

### Lỗi 2: "Cannot find ... RabbitMQ"

**Fix:**
```powershell
cd <service>
dotnet clean
rm -r bin obj
dotnet build
dotnet run
```

### Lỗi 3: "Database error"

**Fix:**
```powershell
# Xóa SQLite files
rm -r VehicleService/data
rm -r SalesService/data
rm -r UserService/data

# Chạy lại sẽ auto recreate
dotnet run
```

---

## 💾 CÁCH 2: Dùng Docker (Nếu có Docker Desktop)

```bash
docker-compose build
docker-compose up -d

# Check
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 📱 Chạy Frontend

**Terminal mới:**
```bash
cd ev-dealer-frontend
npm install  # Lần đầu
npm run dev
```

✅ **Thấy:** http://localhost:5173

---

## ❓ Có câu hỏi gì?

**Đọc file chi tiết:**
- 📖 `SIMPLIFICATION_GUIDE_VIETNAMESE.md` - Lý thuyết chi tiết
- 📋 `QUICK_REMOVAL_CHECKLIST.md` - Hướng dẫn xóa RabbitMQ

---

**Done!** 🎉 Project chạy được rồi!
