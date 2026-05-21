# 🔔 Hướng Dẫn Test Push Notifications

## ✅ Prerequisites (Đã setup)

- [x] Firebase Project created (ev-dealer-management-6c620)
- [x] Firebase config files in `ev-dealer-frontend/src/firebase/`
- [x] Service Worker at `ev-dealer-frontend/public/firebase-messaging-sw.js`
- [x] App.jsx đã integrate Firebase notifications
- [x] NotificationService backend với FCM support
- [x] VehicleService có endpoint `/reserve` với deviceToken

## 📋 Services cần chạy

### 1. RabbitMQ
```powershell
docker start rabbitmq
# Hoặc: docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```

### 2. Backend Services
```powershell
# Terminal 1 - UserService (port 7001)
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\UserService
dotnet run

# Terminal 2 - VehicleService (port 5068)
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\VehicleService
dotnet run

# Terminal 3 - NotificationService (port 5051)
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\NotificationService
dotnet run
```

### 3. Frontend
```powershell
# Terminal 4
cd D:\Nam_3\ev-dealer-management\ev-dealer-frontend
npm run dev
```

## 🧪 TEST 1: Kiểm tra Firebase Initialization

### Bước 1: Mở Browser Console
1. Truy cập http://localhost:5173
2. Mở DevTools (F12)
3. Vào tab **Console**

### Bước 2: Kiểm tra logs
Tìm các dòng log sau:
```
✅ Firebase Messaging initialized successfully
✅ Notifications initialized successfully
```

Hoặc lỗi:
```
⚠️ Notifications not supported in this browser
❌ Permission denied
```

### Bước 3: Request Permission (Nếu chưa có)
Chạy trong Console:
```javascript
import { initializeNotifications } from './src/firebase/notificationService';
const token = await initializeNotifications();
console.log('Device Token:', token);
```

Hoặc đơn giản hơn:
```javascript
Notification.requestPermission().then(permission => {
  console.log('Permission:', permission);
});
```

### Bước 4: Lấy Device Token
```javascript
// Mở Console và chạy:
const token = localStorage.getItem('fcm_device_token');
console.log('Current Token:', token);
```

**Lưu token này để test!**

---

## 🧪 TEST 2: Test FCM trực tiếp (Backend)

### Sử dụng Postman/curl

**Endpoint:** `POST http://localhost:5051/api/notification/test-fcm`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "deviceToken": "YOUR_DEVICE_TOKEN_FROM_STEP_1",
  "title": "🚗 Test Notification",
  "body": "Đây là test notification từ NotificationService!",
  "data": {
    "type": "test",
    "timestamp": "2025-11-26T00:00:00Z"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Notification sent successfully"
}
```

**Kiểm tra:**
- ✅ Notification popup xuất hiện trên browser
- ✅ NotificationService logs show "✅ FCM notification sent successfully"

---

## 🧪 TEST 3: Test End-to-End Flow (Reserve Vehicle)

### Scenario: User đặt xe → Nhận push notification

### Bước 1: Đảm bảo có Device Token
```javascript
// Browser Console
const token = localStorage.getItem('fcm_device_token');
if (!token) {
  console.error('No device token! Request permission first.');
} else {
  console.log('✅ Token ready:', token);
}
```

### Bước 2: Reserve xe qua API (Tạm thời dùng Postman)

**Endpoint:** `POST http://localhost:5068/api/vehicles/1/reserve`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "customerName": "Nguyễn Văn A",
  "customerEmail": "test@example.com",
  "customerPhone": "0123456789",
  "colorVariantId": null,
  "notes": "Test reservation",
  "quantity": 1,
  "deviceToken": "YOUR_DEVICE_TOKEN_HERE"
}
```

### Bước 3: Verify Flow

**1. VehicleService Logs (Terminal 2):**
```
[INFO] Publishing VehicleReservedEvent to RabbitMQ
[INFO] Queue: vehicle.reserved
```

**2. RabbitMQ Management UI:**
- Mở http://localhost:15672 (guest/guest)
- Vào tab **Queues**
- Kiểm tra queue `vehicle.reserved`
- Xem message đã được consumed (message count = 0)

**3. NotificationService Logs (Terminal 3):**
```
[INFO] Received event from queue: vehicle.reserved
[INFO] Processing VehicleReservedEvent for customer: Nguyễn Văn A
[INFO] Device token: eyJhbG...
[INFO] ✅ FCM notification sent successfully
```

**4. Browser:**
- 🔔 **Push notification popup xuất hiện!**
- Title: "🚗 Đặt xe thành công!"
- Body: "Bạn đã đặt xe Tesla Model 3 thành công!"

---

## 🧪 TEST 4: Test với Frontend UI (Khi có reservation form)

### Khi UI reservation form đã sẵn sàng:

1. **Login vào hệ thống**
   - http://localhost:5173/login
   - Đăng nhập với tài khoản hợp lệ

2. **Cho phép notifications**
   - Browser sẽ prompt: "Allow notifications?"
   - Click **Allow**

3. **Đặt xe từ UI**
   - Vào trang chi tiết xe
   - Click nút "Đặt xe" hoặc "Reserve"
   - Điền form và submit

4. **Kiểm tra notification**
   - Notification sẽ tự động xuất hiện
   - Click vào notification → Browser focus vào tab

---

## 🧪 TEST 5: Test Background Notifications

### Test khi tab bị minimize/background

1. **Reserve xe (hoặc dùng Postman)**
2. **Minimize browser hoặc chuyển sang tab khác**
3. **Notification vẫn xuất hiện** (thanks to service worker)
4. **Click notification** → Browser focus về tab EV Dealer

---

## 🐛 Troubleshooting

### ❌ "Notifications not supported"
- **Nguyên nhân:** Browser không hỗ trợ
- **Giải pháp:** Dùng Chrome/Edge/Firefox mới nhất
- **Check:** `'Notification' in window && 'serviceWorker' in navigator`

### ❌ "Permission denied"
- **Nguyên nhân:** User từ chối quyền notification
- **Giải pháp:** 
  1. Mở Chrome Settings
  2. Privacy & Security → Site Settings → Notifications
  3. Tìm localhost:5173
  4. Set to "Allow"
  5. Reload trang

### ❌ "Device token null"
- **Nguyên nhân:** Firebase chưa init hoặc permission denied
- **Giải pháp:**
  1. Check Console logs
  2. Re-request permission
  3. Check `.env.local` có đầy đủ Firebase config

### ❌ "Service worker not registered"
- **Nguyên nhân:** File `firebase-messaging-sw.js` không đúng path
- **Giải pháp:**
  1. Verify file tại `public/firebase-messaging-sw.js`
  2. Reload trang (Ctrl+Shift+R)
  3. Check DevTools > Application > Service Workers

### ❌ "FCM error: invalid registration"
- **Nguyên nhân:** Device token không hợp lệ hoặc expired
- **Giải pháp:**
  1. Clear localStorage
  2. Reload trang để lấy token mới
  3. Copy token mới và test lại

### ❌ "RabbitMQ connection failed"
- **Nguyên nhân:** RabbitMQ không chạy
- **Giải pháp:**
  ```powershell
  docker start rabbitmq
  # Wait 10 seconds
  # Restart NotificationService
  ```

### ❌ "Notification không xuất hiện"
**Checklist:**
- [ ] Device token đã được lưu vào localStorage?
- [ ] NotificationService đang chạy?
- [ ] RabbitMQ đang chạy?
- [ ] VehicleService publish event thành công?
- [ ] NotificationService logs có "FCM notification sent"?
- [ ] Browser notification permission = "granted"?
- [ ] Service worker đã registered?

---

## 📊 Verification Checklist

### ✅ Firebase Setup
- [ ] `.env.local` có đầy đủ Firebase config
- [ ] `firebase-messaging-sw.js` tại public folder
- [ ] Service Worker registered (DevTools > Application)
- [ ] Device token được lưu vào localStorage

### ✅ Backend Services
- [ ] RabbitMQ running (port 5672, management: 15672)
- [ ] UserService running (port 7001)
- [ ] VehicleService running (port 5068)
- [ ] NotificationService running (port 5051)

### ✅ End-to-End Flow
- [ ] User login thành công
- [ ] Notification permission granted
- [ ] Device token captured
- [ ] Reserve vehicle gửi deviceToken
- [ ] Event published to RabbitMQ
- [ ] NotificationService consume event
- [ ] FCM notification sent
- [ ] Browser hiển thị notification popup

---

## 🎯 Quick Test Commands

### Test FCM với curl:
```bash
curl -X POST http://localhost:5051/api/notification/test-fcm \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "YOUR_TOKEN",
    "title": "Test",
    "body": "Hello from curl!"
  }'
```

### Test reserve với curl:
```bash
curl -X POST http://localhost:5068/api/vehicles/1/reserve \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "test@test.com",
    "customerPhone": "123456789",
    "quantity": 1,
    "deviceToken": "YOUR_TOKEN"
  }'
```

### Publish test event to RabbitMQ:
```powershell
.\publish-test-event.ps1 -DeviceToken "YOUR_TOKEN" -CustomerName "Test User"
```

---

## 📝 Test Scenarios Summary

| # | Test | Method | Expected Result |
|---|------|--------|-----------------|
| 1 | Firebase Init | Browser Console | "✅ Notifications initialized" |
| 2 | Get Device Token | localStorage | Token string (100+ chars) |
| 3 | FCM Direct Test | POST /test-fcm | Notification popup |
| 4 | RabbitMQ Manual | publish-test-event.ps1 | Notification popup |
| 5 | Reserve API | POST /vehicles/1/reserve | Notification popup |
| 6 | UI Flow | Frontend Form | Notification popup |
| 7 | Background | Minimize tab | Notification popup |
| 8 | Click Action | Click notification | Focus to app |

---

## 🎓 Next Steps

1. **Document API endpoints** (Swagger/Postman)
2. **Create automated tests** (Playwright/Cypress)
3. **Add notification history** (Store in database)
4. **Support multiple device tokens** per user
5. **Add notification preferences** (Email, SMS, Push)
6. **Implement notification templates**
7. **Add analytics tracking**

---

**✅ Khi tất cả tests pass → NotificationService HOÀN THÀNH!**
