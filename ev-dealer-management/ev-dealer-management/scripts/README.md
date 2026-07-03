# Hướng Dẫn Chạy Test - Module C (EV Dealer Management)

Thư mục `scripts` chứa các công cụ tự động hóa quá trình kiểm thử cho Module C. 
Dưới đây là các **câu lệnh chuẩn xác để Giảng viên có thể COPY và PASTE thẳng vào PowerShell** là chạy được ngay.

---

## 🚀 BƯỚC 1: KHỞI ĐỘNG CÁC DỊCH VỤ (BẮT BUỘC)
Để chạy Black-box test (gọi API thực tế) thành công mà không bị lỗi `ECONNREFUSED`, bạn **bắt buộc phải bật 3 service: Sales, Reporting, Notification**.

Vui lòng copy lần lượt từng khối lệnh dưới đây dán vào PowerShell (mỗi lệnh mở ở một tab terminal riêng, hoặc dùng Visual Studio chọn Start Multiple Projects):

**1. Bật SalesService (Port 5003):**
```powershell
cd E:\KCPM\Travel---Homestay---Camping---Booking---Application\ev-dealer-management\ev-dealer-management
dotnet run --project SalesService/SalesService.csproj
```

**2. Bật NotificationService (Port 5051):**
```powershell
cd E:\KCPM\Travel---Homestay---Camping---Booking---Application\ev-dealer-management\ev-dealer-management
dotnet run --project NotificationService/NotificationService.csproj
```

**3. Bật ReportingService (Port 5208):**
```powershell
cd E:\KCPM\Travel---Homestay---Camping---Booking---Application\ev-dealer-management\ev-dealer-management
dotnet run --project ReportingService/ReportingService.csproj
```

---

## 🎯 BƯỚC 2: CHẠY KIỂM THỬ (Dành cho Giảng Viên)

Sau khi 3 service trên đã chạy báo Listening thành công, hãy mở một tab PowerShell mới, **copy và paste khối lệnh sau để chạy TẤT CẢ các test (Cả API và Unit test)**:

```powershell
cd E:\KCPM\Travel---Homestay---Camping---Booking---Application\ev-dealer-management\ev-dealer-management
.\scripts\run-module-c-tests.ps1 -Mode all
```

*(Lệnh này sẽ tự động chạy Newman API Test trước, sau đó chạy xUnit Test, xuất Coverage Report và báo tổng kết PASS/FAIL trên màn hình).*

---

## 🛠️ CÁC LỆNH TÙY CHỌN KHÁC (Chạy lẻ từng phần)

Nếu chỉ muốn chạy riêng một phần nào đó để debug, hãy copy paste các lệnh sau (Đảm bảo đang đứng ở thư mục gốc `ev-dealer-management\ev-dealer-management`):

**Chỉ chạy API Test (Black-box):**
```powershell
.\scripts\run-module-c-tests.ps1 -Mode blackbox
```

**Chỉ chạy Unit Test & Coverage (White-box):**
```powershell
.\scripts\run-module-c-tests.ps1 -Mode whitebox
```

---

## 📂 GIẢI THÍCH CHỨC NĂNG CÁC FILE SCRIPT

| Tên File | Mục đích / Chức năng |
| :--- | :--- |
| 🌟 **`run-module-c-tests.ps1`** | **ĐÂY LÀ FILE CHÍNH.** File điều phối trung tâm. Tùy vào biến `-Mode` (all, blackbox, whitebox, count) mà nó sẽ tự động phân luồng gọi các file bên dưới. |
| `run-module-c-blackbox-tests.ps1` | Chạy lệnh `newman run` để test API tự động. (Bị gọi ngầm bởi file chính). |
| `run-module-c-whitebox-tests.ps1` | Chạy lệnh `dotnet test` để test Unit và tính Code Coverage. (Bị gọi ngầm bởi file chính). |
| `run-module-c-all-tests.ps1` | (Legacy) Kịch bản cũ gom cả Blackbox và Whitebox. Đã được gộp vào file chính thông qua `-Mode all`. |
| `count-postman-tests.js` | Script Node.js đọc file JSON của Postman và đếm tự động tổng số request/assertions. |
| `inspect_sales_db.py` | Script Python giúp soi nhanh dữ liệu thô trong SQLite database của SalesService lúc debug. |
