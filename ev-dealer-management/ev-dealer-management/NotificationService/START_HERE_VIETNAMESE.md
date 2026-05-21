# 🎯 BẮT ĐẦU TEST - Đọc File Này Trước!

## ✅ Đã Làm Xong Gì?

Tôi đã tích hợp **NotificationToast** vào trang đặt xe.

**Bây giờ khi bạn đặt xe:**
1. Notification sẽ hiện lên góc phải trên màn hình ✨
2. SMS tự động gửi đến khách hàng 📱
3. Thông báo tự động ẩn sau 6 giây ⏱️

---

## 🚀 Test Ngay Trong 3 Bước

### Bước 1: Start Services
Mở PowerShell và chạy:
```powershell
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\NotificationService
.\start-all.ps1
```

Script sẽ tự động mở 4 cửa sổ:
- RabbitMQ (Docker)
- NotificationService
- VehicleService  
- Frontend (React)

**Chờ 30 giây** để services khởi động.

---

### Bước 2: Mở Browser
Truy cập: **http://localhost:5173/vehicles**

---

### Bước 3: Đặt Xe
1. Click vào 1 chiếc xe bất kỳ
2. Kéo xuống phần **"Đặt Xe"**
3. Điền thông tin:
   - Tên: `Nguyen Van A`
   - Email: `test@example.com`  
   - Phone: `+84987654321` ⚠️ (Dùng số Việt Nam thật để nhận SMS)
   - Chọn màu xe
   - Số lượng: `1`
4. Click **"Xác Nhận Đặt Xe"**

---

## 🎉 Kết Quả Mong Đợi

### Trên Frontend
Notification màu xanh hiện lên:
```
✅ Đặt xe thành công! 
   Mã đặt chỗ: 123
   SMS xác nhận đã được gửi đến +84987654321
```

### Trên Backend (Terminal NotificationService)
```
[INFO] Received VehicleReservedEvent: reservationId=123
[INFO] Sending reservation SMS to +84987654321
[INFO] SMS sent successfully. SID: SM...
```

### Trên RabbitMQ
- Mở: http://localhost:15672 (guest/guest)
- Tab **Queues** → `vehicle.reserved`
- Thấy message đã được consumed

---

## 🐛 Nếu Có Lỗi

### ❌ Notification không hiện
```powershell
# Refresh trình duyệt
Ctrl + Shift + R
```

### ❌ Services không start
```powershell
# Check từng service
docker ps  # Xem RabbitMQ có chạy không
curl http://localhost:5002/health  # VehicleService
curl http://localhost:5005/notifications/health  # NotificationService
```

---

## 📚 Đọc Thêm

| File | Khi Nào Đọc |
|------|-------------|
| **DEMO_2_PHUT.md** | Test nhanh không cần đọc nhiều |
| **TEST_FRONTEND.md** | Hướng dẫn chi tiết + troubleshooting |
| **README_COMPLETE.md** | Tóm tắt toàn bộ + checklist |
| **start-all.ps1** | Script tự động (đã chạy rồi) |

---

## ✨ Demo

**Trước khi đặt xe:**
- Trang đặt xe bình thường

**Sau khi click "Xác Nhận":**
- ⏳ Loading 1-2 giây
- ✅ Notification xanh hiện lên
- 📱 SMS gửi đến phone number
- 🎊 Dialog đóng lại
- ✅ Hoàn tất!

---

## 🎯 Checklist Nhanh

- [ ] Chạy `start-all.ps1` → 4 cửa sổ mở ra
- [ ] Chờ 30 giây
- [ ] Mở http://localhost:5173/vehicles
- [ ] Click xe → Đặt xe
- [ ] Điền form → Submit
- [ ] ✅ Notification hiện lên
- [ ] ✅ THÀNH CÔNG!

---

**Good luck! 🚀 Nếu có lỗi, đọc TEST_FRONTEND.md phần Troubleshooting**
