# Hướng Dẫn Sử Dụng Postman — Module C: Sales Management

> **Dự án**: EV Dealer Management System  
> **Ngày tạo**: 2026-07-05 | **Phiên bản**: 1.0

---

## 1. Tổng Quan

Module C bao gồm kiểm thử API cho luồng bán hàng hoàn chỉnh:

```
Quote → Order → Contract → Payment → Delivery
```

**Các file cần sử dụng:**

| File | Đường dẫn | Mô tả |
|---|---|---|
| Postman Collection | `EV Dealer Management API.postman_collection.json` | Chứa toàn bộ requests Module C |
| Postman Environment | `postman/Module_C_Local.postman_environment.json` | Biến môi trường cho local |

---

## 2. Import vào Postman

### 2.1 Import Collection

1. Mở Postman Desktop
2. Click **Import** (góc trái trên)
3. Chọn tab **File** → Browse tới:
   ```
   ev-dealer-management/EV Dealer Management API.postman_collection.json
   ```
4. Click **Import**

### 2.2 Import Environment

1. Click biểu tượng ⚙️ **Environments** (góc phải trên)
2. Click **Import**
3. Browse tới:
   ```
   ev-dealer-management/postman/Module_C_Local.postman_environment.json
   ```
4. Click **Import**
5. Chọn environment **"Module C - Local"** từ dropdown

---

## 3. Biến Môi Trường (Environment Variables)

| Biến | Giá trị mặc định | Mô tả |
|---|---|---|
| `baseUrl` | `http://localhost:5036` | API Gateway (Ocelot) |
| `salesServiceUrl` | `http://localhost:5003` | SalesService trực tiếp |
| `reportingServiceUrl` | `http://localhost:5208` | ReportingService trực tiếp |
| `notificationServiceUrl` | `http://localhost:5051` | NotificationService trực tiếp |
| `authToken` | (trống) | JWT token nếu cần auth |

**Biến tự động (do Pre-request/Test scripts tạo):**

| Biến | Mô tả | Tạo bởi |
|---|---|---|
| `quoteId` | ID quote vừa tạo | Q1 - Create Quote |
| `orderId` | ID order vừa tạo | O1 - Complete Order |
| `contractId` | ID contract vừa tạo | C1 - Create Contract |
| `paymentId` | ID payment vừa tạo | P1 - Create Payment |
| `deliveryId` | ID delivery vừa tạo | D1 - Create Delivery |
| `promotionId` | ID promotion vừa tạo | PR1 - Create Promotion |

> **Lưu ý**: Các biến `quoteId`, `orderId`, v.v. được tự động lưu bởi Test scripts sau mỗi request tạo mới. Không cần set thủ công.

---

## 4. Cấu Trúc Folder trong Collection

| Folder | Số requests | Mô tả |
|---|---|---|
| Module C - Quotes | 12 | CRUD + EP/BVA/DT cho Quotes |
| Module C - Orders | 16 | CRUD + Status transitions + EP/BVA/DT |
| Module C - Contracts | 13 | CRUD + Approve/Reject + EP/BVA/DT |
| Module C - Payments | 9 | CRUD + Amount validation + EP/BVA/DT |
| Module C - Deliveries & Promotions | 12 | CRUD + EP/BVA cho cả Deliveries và Promotions |
| Module C - Sales Composite API | 13 | Sales workflow qua SalesController |
| Module C - Reporting API | 20 | Report endpoints + filter/date/BVA |
| Module C - Notification & E2E Flow | 18 | Notification API (6) + E2E Sales Flow (12) |
| **Tổng** | **124** | |

---

## 5. Cách Chạy Tuần Tự trong Postman GUI

### 5.1 Chạy từng folder

1. Click phải vào folder (ví dụ: "Module C - Quotes")
2. Chọn **Run folder**
3. Đảm bảo environment **"Module C - Local"** được chọn
4. Click **Run**

### 5.2 Chạy E2E Sales Flow

Luồng E2E nằm trong folder **"Module C - Notification & E2E Flow"**, bao gồm 12 bước:

1. **E2E-1**: POST Quote → Lưu `quoteId`
2. **E2E-2**: GET Quote → Verify status = "Active"
3. **E2E-3**: POST Order → Lưu `orderId`
4. **E2E-4**: GET Order → Verify status = "Pending"
5. **E2E-5**: POST Contract → Lưu `contractId`
6. **E2E-6**: GET Contract → Verify contract created
7. **E2E-7**: POST Payment → Lưu `paymentId`
8. **E2E-8**: POST Delivery → Lưu `deliveryId`
9. **E2E-9**: GET Orders → Verify list contains E2E order
10. **E2E-10**: GET Payments → Verify payment list
11. **E2E-11**: GET Deliveries → Verify delivery list
12. **E2E-12**: GET Contracts → Verify contract list (E2E complete)

> **Quan trọng**: Chạy tuần tự từ E2E-1 đến E2E-12. Không chạy song song vì các request phụ thuộc dữ liệu từ request trước.

---

## 6. Chạy Bằng Newman CLI (PowerShell)

### 6.1 Điều kiện tiên quyết

| Tool | Version | Cài đặt |
|---|---|---|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Newman | 6+ | `npm install -g newman` |
| PowerShell | 7+ | Có sẵn trên Windows |

### 6.2 Khởi động services trước khi chạy test

```powershell
cd ev-dealer-management

# Chạy từng service
Start-Process dotnet -ArgumentList "run --project SalesService/SalesService.csproj"
Start-Process dotnet -ArgumentList "run --project ReportingService/ReportingService.csproj"
Start-Process dotnet -ArgumentList "run --project NotificationService/NotificationService.csproj"

# Chờ services khởi động (10-15 giây)
Start-Sleep -Seconds 15
```

### 6.3 Chạy toàn bộ Module C

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
  --reporter-json-export "reports/module-c-newman-report.json" `
  --reporter-junit-export "reports/module-c-newman-report.xml"
```

### 6.4 Chạy bằng script có sẵn

```powershell
# Black-box tests (Newman)
.\scripts\run-module-c-blackbox-tests.ps1

# Toàn bộ (Black-box + White-box)
.\scripts\run-module-c-all-tests.ps1
```

### 6.5 Chạy từng folder riêng

```powershell
# Chỉ chạy Quotes
newman run "EV Dealer Management API.postman_collection.json" `
  --environment "postman/Module_C_Local.postman_environment.json" `
  --folder "Module C - Quotes"

# Chỉ chạy E2E Flow
newman run "EV Dealer Management API.postman_collection.json" `
  --environment "postman/Module_C_Local.postman_environment.json" `
  --folder "Module C - Notification & E2E Flow"
```

---

## 7. Đọc Kết Quả Report

### 7.1 CLI Output

Newman hiển thị trực tiếp trên terminal:
- `✓` = Assertion PASS
- `✗` = Assertion FAIL
- Cuối cùng hiện summary: `total | passed | failed`

### 7.2 JSON Report

File: `reports/module-c-newman-report.json`

Cấu trúc chính:
```json
{
  "run": {
    "stats": {
      "requests": { "total": 124, "failed": 0 },
      "assertions": { "total": 170, "failed": 0 }
    },
    "executions": [...]
  }
}
```

### 7.3 JUnit XML Report

File: `reports/module-c-newman-report.xml`
- Format chuẩn JUnit cho CI/CD integration
- Có thể import vào GitHub Actions, Jenkins, hoặc Jira

---

## 8. Troubleshooting

### 8.1 Lỗi `ECONNREFUSED 127.0.0.1:5003`

**Nguyên nhân**: SalesService chưa khởi động.

**Cách fix**:
```powershell
# Kiểm tra port
Test-NetConnection -ComputerName localhost -Port 5003

# Khởi động lại
dotnet run --project SalesService/SalesService.csproj
```

### 8.2 Lỗi 500 Internal Server Error

**Nguyên nhân có thể**:
1. Database SQLite bị corrupt
2. Migration chưa được apply
3. Xung đột giữa `EnsureCreated()` và `Migrate()`

**Cách fix**:
```powershell
# Xóa database cũ và chạy lại
Remove-Item SalesService/sales.db -ErrorAction SilentlyContinue
dotnet run --project SalesService/SalesService.csproj
# Service sẽ tự tạo lại DB khi khởi động
```

### 8.3 Lỗi BVA Quantity=0 trả về 201 thay vì 400

**Nguyên nhân**: Controller dùng `[FromQuery]` thay vì `[FromBody]` cho POST request, khiến Data Annotations (`[Range]`) không được kích hoạt.

**Đã fix**: Đổi sang `[FromBody]` tại `QuotesController.cs`.

### 8.4 Newman báo `0 assertions` hoặc `all failed`

**Kiểm tra**:
1. Đã chọn đúng environment chưa?
2. Services có đang chạy không?
3. Collection file có đúng phiên bản không?

---

## 9. Quy Ước Test Script trong Collection

Mỗi request trong collection đều có Test scripts kiểm tra:

1. **Status code** — Kiểm tra HTTP status (200, 201, 400, 404)
2. **Response body** — Kiểm tra có dữ liệu trả về
3. **Business logic** — Kiểm tra trạng thái đúng (Active, Pending, Completed)
4. **Variable saving** — Lưu ID vào environment cho request tiếp theo

Ví dụ Test script chuẩn:
```javascript
// Kiểm tra status code
pm.test("[EP][Happy] Status code is 201", function () {
    pm.response.to.have.status(201);
});

// Lưu ID vào environment
const json = pm.response.json();
if (json && json.id) {
    pm.environment.set("quoteId", json.id);
}

// Kiểm tra response schema
pm.test("[EP][Happy] Response has id field", function () {
    pm.expect(json).to.have.property("id");
});
```

---

## 10. Liên Kết Tài Liệu

| Tài liệu | Đường dẫn |
|---|---|
| Test Cases | `docs/testing/TEST_CASES_MODULE_C.md` |
| Test Procedures | `docs/testing/TEST_PROCEDURES_MODULE_C.md` |
| Test Result Report | `docs/testing/TEST_RESULT_REPORT_MODULE_C.md` |
| Defect Report | `docs/testing/DEFECT_REPORT_MODULE_C.md` |
| Traceability Matrix | `docs/testing/TRACEABILITY_MATRIX_MODULE_C.md` |
