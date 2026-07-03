# Quy Trình Kiểm Thử — Module C: Sales Management

> **Dự án**: EV Dealer Management System  
> **Ngày tạo**: 2026-07-03 | **Phiên bản**: 1.0

---

## 1. Điều Kiện Tiên Quyết

### 1.1 Phần Mềm

| Tool | Version | Mục đích |
|---|---|---|
| Node.js | 18+ | Chạy Newman CLI |
| Newman | 6+ | Chạy Postman collection từ CLI |
| newman-reporter-htmlextra | latest | HTML report |
| PowerShell | 7+ | Runner script |

### 1.2 Cài Đặt Newman

```powershell
npm install -g newman
npm install -g newman-reporter-htmlextra
```

### 1.3 Services Cần Chạy

| Service | Port | Lệnh khởi động |
|---|---|---|
| SalesService | 5003 | `dotnet run --project SalesService` |
| ReportingService | 5208 | `dotnet run --project ReportingService` |
| NotificationService | 5051 | `dotnet run --project NotificationService` |

Hoặc chạy tất cả:
```powershell
.\start-all-services.ps1
```

### 1.4 Kiểm Tra Health

```powershell
# SalesService
Invoke-RestMethod -Uri "http://localhost:5003/api/Quotes" -Method GET

# ReportingService
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/summary" -Method GET

# NotificationService (có thể trả 400 nếu chưa config FCM)
Invoke-RestMethod -Uri "http://localhost:5051/api/Notification/test-fcm" -Method POST -Body '{}' -ContentType "application/json"
```

---

## 2. Quy Trình Chạy Test

### 2.1 Sử Dụng Script Tự Động (Khuyến nghị)

```powershell
cd ev-dealer-management
.\scripts\run-module-c-blackbox-tests.ps1
```

Script sẽ:
1. Kiểm tra Newman đã cài đặt
2. Kiểm tra services đang chạy (health check)
3. Chạy Newman với collection và environment
4. Xuất report vào `reports/`

### 2.2 Chạy Thủ Công Bằng Newman

```powershell
newman run "EV Dealer Management API.postman_collection.json" `
  --environment "postman/Module_C_Local.postman_environment.json" `
  --folder "Module C - Quotes" `
  --folder "Module C - Orders" `
  --folder "Module C - Contracts" `
  --folder "Module C - Payments" `
  --folder "Module C - Deliveries & Promotions" `
  --folder "Module C - Sales Composite API" `
  --folder "Module C - Reporting API" `
  --folder "Module C - Notification & E2E Flow" `
  --reporters cli,json,junit `
  --reporter-json-export reports/module-c-newman-report.json `
  --reporter-junit-export reports/module-c-newman-report.xml
```

### 2.3 Chạy Từng Folder Riêng

```powershell
# Chỉ chạy Quotes
newman run "EV Dealer Management API.postman_collection.json" `
  --environment "postman/Module_C_Local.postman_environment.json" `
  --folder "Module C - Quotes"

# Chỉ chạy Orders
newman run "EV Dealer Management API.postman_collection.json" `
  --environment "postman/Module_C_Local.postman_environment.json" `
  --folder "Module C - Orders"
```

---

## 3. Đọc Kết Quả

### 3.1 CLI Output
Newman hiển thị trực tiếp:
- ✓ = PASS
- ✗ = FAIL
- Summary: total/passed/failed

### 3.2 JSON Report
File: `reports/module-c-newman-report.json`
- Chứa chi tiết từng request, response, assertion
- Dùng để phân tích lỗi chi tiết

### 3.3 JUnit XML Report
File: `reports/module-c-newman-report.xml`
- Format chuẩn CI/CD
- Dùng cho GitHub Actions integration

---

## 4. Xử Lý Khi Test Fail

### 4.1 Kiểm tra service có chạy không
```powershell
Test-NetConnection -ComputerName localhost -Port 5003
Test-NetConnection -ComputerName localhost -Port 5208
Test-NetConnection -ComputerName localhost -Port 5051
```

### 4.2 Kiểm tra database
- SalesService dùng SQLite: `sales.db` trong thư mục bin
- ReportingService dùng SQLite fallback: `reporting_dev.db`

### 4.3 Xem logs
```powershell
# Nếu services chạy trong terminal, logs hiển thị trực tiếp
# Nếu chạy background, kiểm tra thư mục logs/
```

### 4.4 Ghi nhận defect
- Ghi vào `docs/testing/DEFECT_REPORT_MODULE_C.md`
- Không fake PASS
- Không sửa business logic để pass test

---

## 5. Tiêu Chí Hoàn Thành

- [ ] Tất cả 8 Module C folders đã chạy
- [ ] 170 pm.test assertions đều PASS
- [ ] JSON report đã xuất
- [ ] JUnit XML report đã xuất
- [ ] Defect report đã cập nhật (nếu có fail)
- [ ] TEST_RESULT_REPORT.md đã cập nhật với kết quả thực tế
