# 🎬 DEMO NHANH - Test Trong 2 Phút

## Cách Test Nhanh Nhất

### ⚡ Bước 1: Start Services (1 Command)

Mở PowerShell **MỘT LẦN** và chạy:

```powershell
# Start RabbitMQ
docker start rabbitmq

# Terminal 1: NotificationService
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Nam_3\ev-dealer-management\ev-dealer-management\NotificationService; dotnet run"

# Terminal 2: VehicleService  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Nam_3\ev-dealer-management\ev-dealer-management\VehicleService; dotnet run"

# Terminal 3: Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Nam_3\ev-dealer-management\ev-dealer-frontend; npm run dev"
```

Chờ **30 giây** để tất cả services khởi động.

---

### 🌐 Bước 2: Mở Browser

Truy cập: **http://localhost:5173/vehicles**

---

### 🚗 Bước 3: Test Đặt Xe

1. **Click vào xe đầu tiên** trong danh sách
2. **Scroll xuống** hoặc click nút **"Đặt Xe Ngay"**
3. **Điền form:**
   ```
   Tên: Test User
   Email: test@example.com
   Phone: +84987654321
   Chọn màu: (chọn bất kỳ)
   Số lượng: 1
   ```
4. **Click "Xác Nhận"**

---

### ✅ Bước 4: Xem Kết Quả

#### 🎉 Thành Công Khi:

**1. Notification hiện lên góc phải trên:**
```
✅ Đặt xe thành công! Mã đặt chỗ: 123. 
SMS xác nhận đã được gửi đến +84987654321
```

**2. Check Backend Log (Terminal NotificationService):**
```
[INFO] Received VehicleReservedEvent
[INFO] Sending reservation SMS to +84987654321
[INFO] SMS sent successfully
```

**3. Check RabbitMQ:**
- Mở: http://localhost:15672 (guest/guest)
- Tab **Queues** → `vehicle.reserved`
- **Message rates** sẽ hiện 1 message delivered

---

## 🎯 Kết Quả Mong Đợi

| ✅ Component | ✅ Kết Quả |
|-------------|----------|
| Frontend | Notification màu xanh hiện 6 giây |
| Backend | Log "SMS sent successfully" |
| RabbitMQ | 1 message consumed |
| SMS | Nhận tin (nếu số thật) |

---

## 🐛 Nếu Lỗi

### ❌ Notification không hiện
```powershell
# Refresh browser
Ctrl + Shift + R
```

### ❌ "Network Error"
```powershell
# Check services running
curl http://localhost:5002/health  # VehicleService
curl http://localhost:5005/notifications/health  # NotificationService
```

### ❌ "Đặt xe thất bại"
- Check xe còn hàng không (stockQuantity > 0)
- Check colorVariant có sẵn không

---

## 🎊 Xong!

Nếu notification hiện lên → **THÀNH CÔNG!** 🎉

Giờ bạn đã có:
- ✅ Frontend đẹp với notification
- ✅ Backend gửi SMS tự động
- ✅ RabbitMQ event-driven architecture

---

## 📸 Screenshot

Notification sẽ trông như thế này:

```
┌─────────────────────────────────────┐
│  ✅  ✓ Đặt xe thành công!          │
│      Mã đặt chỗ: 123               │
│      SMS xác nhận đã được gửi      │
│      đến +84987654321          [×] │
└─────────────────────────────────────┘
```

- Màu: **Xanh lá cây**
- Vị trí: **Góc phải trên**
- Tự động ẩn: **6 giây**
- Click **[×]** để đóng ngay

---

**Chúc test thành công! 🚀**
