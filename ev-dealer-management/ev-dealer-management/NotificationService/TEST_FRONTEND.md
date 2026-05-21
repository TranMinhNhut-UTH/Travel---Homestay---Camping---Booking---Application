# 🎯 TEST FRONTEND - Đặt Xe Có Thông Báo

## 📋 Chuẩn Bị

### 1️⃣ Start Backend Services (3 Terminal)

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

**Terminal 3 - VehicleService:**
```powershell
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\VehicleService
dotnet run
```

### 2️⃣ Start Frontend (Terminal 4)

**Terminal 4 - React Frontend:**
```powershell
cd D:\Nam_3\ev-dealer-management\ev-dealer-frontend
npm run dev
```

Mở browser: **http://localhost:5173**

---

## 🧪 TEST TRÊN FRONTEND

### Bước 1: Vào Trang Chi Tiết Xe
1. Vào trang **Danh Sách Xe**: http://localhost:5173/vehicles
2. Click vào 1 xe bất kỳ để vào trang chi tiết
3. URL sẽ là: http://localhost:5173/vehicles/1 (hoặc ID khác)

### Bước 2: Đặt Xe (Reservation)
1. Kéo xuống phần **"Đặt Xe"** hoặc click nút **"Đặt Xe Ngay"**
2. Điền form đặt xe:
   - **Tên khách hàng:** `Nguyen Van A`
   - **Email:** `test@example.com`
   - **Số điện thoại:** `+84987654321` (⚠️ QUAN TRỌNG: Dùng số VN thật để nhận SMS)
   - **Chọn màu xe:** Chọn 1 màu bất kỳ
   - **Số lượng:** `1`
   - **Ghi chú:** (tùy chọn) `Test reservation`

3. Click **"Xác Nhận Đặt Xe"**

### Bước 3: Kiểm Tra Kết Quả ✅

#### ✨ Trên Frontend
- **Thông báo xuất hiện** ở góc phải trên màn hình:
  ```
  ✅ Đặt xe thành công! Mã đặt chỗ: 123. SMS xác nhận đã được gửi đến +84987654321
  ```
- Thông báo tự động ẩn sau 6 giây
- Click ❌ để đóng sớm hơn

#### 📱 SMS (Nếu Dùng Số Thật)
Nhận SMS từ Twilio:
```
🚗 Xác nhận đặt xe
Xe: Tesla Model S (màu Đỏ)
Khách hàng: Nguyen Van A
Mã đặt chỗ: 123
Cảm ơn bạn đã tin tưởng!
```

#### 🖥️ Backend Logs (NotificationService Terminal)
```
[INFO] Received VehicleReservedEvent: reservationId=123
[INFO] Sending reservation SMS to +84987654321
[INFO] SMS sent successfully. SID: SM...
```

#### 🐰 RabbitMQ UI
1. Mở: http://localhost:15672
2. Login: guest / guest
3. Tab **Queues** → Chọn `vehicle.reserved`
4. Xem **Message Stats**: 1 message delivered and acknowledged

---

## 🎨 Giao Diện Notification

### Thành Công (Success) ✅
- **Màu xanh lá**
- Icon: ✅ CheckCircle
- Hiện: "Đặt xe thành công! Mã đặt chỗ: XXX"

### Lỗi (Error) ❌
- **Màu đỏ**
- Icon: ❌ Error
- Hiện: "Đặt xe thất bại: [lý do]"

### Vị Trí
- **Top-Right** (góc phải trên)
- Không che mất nội dung quan trọng

---

## 🐛 TroubleShooting

### ❌ Không Hiện Notification
**Nguyên nhân:**
- Frontend chưa được refresh sau khi cập nhật code

**Giải pháp:**
```powershell
# Hard refresh trong browser
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)

# Hoặc restart Vite dev server
npm run dev
```

### ❌ Lỗi "Failed to create reservation"
**Nguyên nhân:**
- VehicleService chưa chạy
- Database chưa có dữ liệu

**Giải pháp:**
```powershell
# Check VehicleService running
curl http://localhost:5002/health

# Check có xe trong DB không
curl http://localhost:5002/api/vehicles
```

### ❌ SMS Không Gửi
**Nguyên nhân:**
- NotificationService chưa chạy
- RabbitMQ chưa chạy
- Twilio credentials sai

**Giải pháp:**
```powershell
# Check NotificationService
curl http://localhost:5005/notifications/health

# Check RabbitMQ
docker ps | findstr rabbitmq

# Check Twilio config trong appsettings.json
```

---

## 🎯 Test Cases Khác

### Test 1: Đặt Xe Hết Hàng (Out of Stock)
1. Đặt xe với quantity > stock
2. **Kỳ vọng:** Notification lỗi màu đỏ: "Không đủ hàng trong kho"

### Test 2: Điền Sai Form
1. Bỏ trống tên/email/phone
2. **Kỳ vọng:** Form validation error (không call API)

### Test 3: Network Error
1. Tắt VehicleService
2. Đặt xe
3. **Kỳ vọng:** Notification lỗi: "Network error" hoặc timeout

---

## ✅ Checklist Hoàn Thành

- [ ] RabbitMQ đang chạy (port 5672)
- [ ] NotificationService đang chạy (port 5005)
- [ ] VehicleService đang chạy (port 5002)
- [ ] Frontend đang chạy (port 5173)
- [ ] Vào trang chi tiết xe thành công
- [ ] Điền form đặt xe đầy đủ
- [ ] Thông báo xuất hiện khi đặt xe
- [ ] SMS nhận được (nếu dùng số thật)
- [ ] Backend log hiện message sent

---

## 🎉 Thành Công Khi

✅ **Frontend:** Notification hiện ra "Đặt xe thành công! Mã đặt chỗ: XXX"  
✅ **Backend:** NotificationService log "SMS sent successfully"  
✅ **RabbitMQ:** Message delivered and acknowledged  
✅ **SMS:** Nhận được tin nhắn xác nhận (nếu dùng số VN thật)

---

## 📝 Notes Quan Trọng

1. **SMS chỉ gửi nếu:** Số điện thoại là **số Việt Nam thật** (+84...)
2. **Twilio Mock:** Nếu số không hợp lệ, vẫn log "SMS sent" nhưng không gửi thật
3. **Notification:** Sẽ tự động ẩn sau **6 giây**, hoặc click ❌ để đóng
4. **RabbitMQ:** Cần chạy trước khi start NotificationService

---

## 🚀 Next Steps (Sau Khi Test Xong)

1. ✅ Test frontend đặt xe → Notification
2. 🔜 Tích hợp SalesService (order confirmation email)
3. 🔜 Test drive scheduling (CustomerService)
4. 🔜 API Gateway routing
5. 🔜 Docker Compose full stack

---

**Good luck! 🎯**
