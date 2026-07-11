# Báo Cáo Kết Quả Kiểm Thử Chi Tiết — Module C: Sales Management

> **Dự án**: EV Dealer Management System  
> **Ngày tạo**: 2026-07-05 | **Phiên bản**: 1.1  
> **Trạng thái**: 🟢 ALL PASSED  
> **Nguồn dữ liệu**: `reports/module-c-newman-report_20260705_161956.json`

---

## 1. Tổng Quan Kết Quả

| Metric | Giá trị | Nguồn |
|---|---|---|
| Tổng Requests | **124** | Newman report `_161956.json` |
| Requests Failed | **0** | Newman report `_161956.json` |
| Tổng Assertions (pm.test) | **170** | Newman report `_161956.json` |
| Assertions Failed | **0** | Newman report `_161956.json` |
| Test Scripts | 113 total, 0 failed | Newman report `_161956.json` |
| Prerequest Scripts | 121 total, 0 failed | Newman report `_161956.json` |
| Thời gian chạy | 34.6 giây | Newman report `_161956.json` |
| **Tỷ lệ Pass** | **100%** | Tính từ 170/170 assertions |

> **Lưu ý**: Lỗi ECONNREFUSED tại NotificationService trước đó đã được khắc phục hoàn toàn nhờ việc khởi chạy service ở port 5051.

---

## 2. Kết Quả Theo Từng Folder

### 2.1 Module C - Quotes (12 requests)

| Request | Technique | Status |
|---|---|---|
| Q1 - Create Quote (Happy Path) | EP-Valid | ✅ Pass |
| Q2 - Create Quote (Empty Body - Negative) | EP-Invalid | ✅ Pass |
| Q3 - Create Quote (Quantity=0 - BVA Boundary) | BVA-Min | ✅ Pass |
| Q4 - Get All Quotes (Happy Path) | EP-Valid | ✅ Pass |
| Q5 - Get Quote By ID (Happy Path) | EP-Valid | ✅ Pass |
| Q6 - Get Quote By ID (Not Found - Negative) | EP-Invalid | ✅ Pass |
| Q7 - Get Quote By ID=0 (BVA Boundary) | BVA-Boundary | ✅ Pass |
| Q8 - Update Quote Status (Happy Path) | EP-Valid | ✅ Pass |
| Q9 - Update Quote Status (Not Found - Negative) | EP-Invalid | ✅ Pass |
| Q10 - Update Quote Status (Empty Status - BVA Boundary) | BVA-Empty | ✅ Pass |
| Q11 - Update Quote Status (Valid Status=Expired DT) | DT | ✅ Pass |
| Q12 - Update Quote Status (Invalid Status=INVALID_XYZ DT) | DT | ✅ Pass |

### 2.2 Module C - Orders (16 requests)

| Request | Technique | Status |
|---|---|---|
| O1 - Complete Order (Happy Path) | EP-Valid | ✅ Pass |
| O2 - Complete Order (Missing Email - Negative) | EP-Invalid | ✅ Pass |
| O3 - Complete Order (Missing Name - Negative) | EP-Invalid | ✅ Pass |
| O4 - Complete Order (UnitPrice=0 BVA - Negative) | BVA | ✅ Pass |
| O5 - Get Quote Verify Status=ConvertedToOrder | DT | ✅ Pass |
| O6 - Get All Orders (Happy Path) | EP-Valid | ✅ Pass |
| O7 - Get Order By ID (Happy Path) | EP-Valid | ✅ Pass |
| O8 - Get Order By ID (Not Found - Negative) | EP-Invalid | ✅ Pass |
| O9 - Update Order Status (Happy Path) | EP-Valid | ✅ Pass |
| O10 - Update Order Status (Not Found - Negative) | EP-Invalid | ✅ Pass |
| O11 - Health Check (Happy Path) | EP-Valid | ✅ Pass |
| O12 - Get Order By ID=0 (BVA) | BVA | ✅ Pass |
| O13 - Update Order Status (Empty Body BVA) | BVA | ✅ Pass |
| O14 - Update Order Status (Status=Delivered DT) | DT | ✅ Pass |
| O15 - Update Order Status (Status=Cancelled DT) | DT | ✅ Pass |
| O16 - Update Order Status (Invalid Status=UNKNOWN DT) | DT | ✅ Pass |

### 2.3 Module C - Contracts (13 requests)

| Request | Technique | Status |
|---|---|---|
| C1 - Create Contract (Happy Path) | EP-Valid | ✅ Pass |
| C2 - Create Contract (Order Not Found - Negative) | EP-Invalid | ✅ Pass |
| C3 - Create Contract (Duplicate - Negative) | EP-Invalid | ✅ Pass |
| C4 - Create Contract (Invalid SalespersonId - Negative) | EP-Invalid | ✅ Pass |
| C5 - Get All Contracts (Happy Path) | EP-Valid | ✅ Pass |
| C6 - Get Contract By ID (Happy Path) | EP-Valid | ✅ Pass |
| C7 - Get Contract By ID (Not Found - Negative) | EP-Invalid | ✅ Pass |
| C8 - Approve Contract (Happy Path) | EP-Valid | ✅ Pass |
| C9 - Verify Order Status=ReadyForDelivery After Approve | DT | ✅ Pass |
| C10 - Reject Contract (Full Reject Flow) | DT | ✅ Pass |
| C11 - Create Contract (Empty Body BVA) | BVA | ✅ Pass |
| C12 - Get Contract By ID=0 (BVA) | BVA | ✅ Pass |
| C13 - Update Contract Status (Invalid Status DT) | DT | ✅ Pass |

### 2.4 Module C - Payments (9 requests)

| Request | Technique | Status |
|---|---|---|
| P1 - Create Payment (Happy Path) | EP-Valid | ✅ Pass |
| P2 - Create Payment (Empty Body - Negative) | EP-Invalid | ✅ Pass |
| P3 - Create Payment (Amount=0 BVA - Negative) | BVA-Min | ✅ Pass |
| P4 - Get All Payments (Happy Path) | EP-Valid | ✅ Pass |
| P5 - Create Payment (Amount=-1 BVA) | BVA | ✅ Pass |
| P6 - Create Payment (Amount=9999999999999 BVA) | BVA | ✅ Pass |
| P7 - Create Payment (PaymentMethod=Cash DT) | DT | ✅ Pass |
| P8 - Create Payment (PaymentMethod=BankTransfer DT) | DT | ✅ Pass |
| P9 - Create Payment (Missing PaymentMethod - Negative DT) | DT | ✅ Pass |

### 2.5 Module C - Deliveries & Promotions (12 requests)

| Request | Technique | Status |
|---|---|---|
| D1 - Create Delivery (Happy Path) | EP-Valid | ✅ Pass |
| D2 - Create Delivery (Empty Body - Negative) | EP-Invalid | ✅ Pass |
| D3 - Get All Deliveries (Happy Path) | EP-Valid | ✅ Pass |
| D4 - Create Delivery (Missing TrackingNumber - BVA) | BVA | ✅ Pass |
| D5 - Create Delivery (Missing Status - Negative DT) | DT | ✅ Pass |
| D6 - Create Delivery (Missing Status - BVA) | BVA | ✅ Pass |
| PR1 - Create Promotion (Happy Path) | EP-Valid | ✅ Pass |
| PR2 - Create Promotion (Empty Body - Negative) | EP-Invalid | ✅ Pass |
| PR3 - Get All Promotions (Happy Path) | EP-Valid | ✅ Pass |
| PR4 - Create Promotion (DiscountValue=-1 BVA) | BVA | ✅ Pass |
| PR5 - Create Promotion (DiscountValue=0 BVA Boundary) | BVA | ✅ Pass |
| PR6 - Create Promotion (Missing Name - Negative DT) | DT | ✅ Pass |

### 2.6 Module C - Sales Composite API (13 requests)

| Request | Technique | Status |
|---|---|---|
| S1 - GET Sales Quote by ID (Happy Path) | EP-Valid | ✅ Pass |
| S2 - GET Sales Quote by ID (Not Found - Negative) | EP-Invalid | ✅ Pass |
| S3 - POST Sales Order (Happy Path) | EP-Valid | ✅ Pass |
| S4 - POST Sales Order (Quote Not Active - Negative) | EP-Invalid | ✅ Pass |
| S5 - GET Sales Order by ID (Happy Path) | EP-Valid | ✅ Pass |
| S6 - POST Sales Contract (Happy Path) | EP-Valid | ✅ Pass |
| S7 - POST Sales Contract (Order Not Found - Negative) | EP-Invalid | ✅ Pass |
| S8 - GET Sales Contract by ID (Happy Path) | EP-Valid | ✅ Pass |
| S9 - POST Sales Order (Empty Body BVA) | BVA | ✅ Pass |
| S10 - GET Sales Quote by ID=0 (BVA Boundary) | BVA | ✅ Pass |
| S11 - GET Sales Order by ID=0 (BVA Boundary) | BVA | ✅ Pass |
| S12 - GET Sales Contract by ID=0 (BVA Boundary) | BVA | ✅ Pass |
| S13 - GET Sales Contract Not Found (Negative EP) | EP-Invalid | ✅ Pass |

### 2.7 Module C - Reporting API (20 requests)

| Request | Technique | Status |
|---|---|---|
| R1 - GET reports/summary (Happy Path) | EP-Valid | ✅ Pass |
| R2 - GET reports/summary with filters | EP-Valid | ✅ Pass |
| R3 - GET reports/summary invalid date (BVA) | BVA | ✅ Pass |
| R4 - GET reports/sales-by-region | EP-Valid | ✅ Pass |
| R5 - GET reports/sales-proportion | EP-Valid | ✅ Pass |
| R6 - GET reports/top-vehicles | EP-Valid | ✅ Pass |
| R7 - GET reports/top-vehicles?limit=5 (BVA) | BVA | ✅ Pass |
| R8 - GET reports/demand-forecast | EP-Valid | ✅ Pass |
| R9 - GET reports/sales-by-dealer | EP-Valid | ✅ Pass |
| R10 - GET reports/sales-by-staff | EP-Valid | ✅ Pass |
| R11 - GET reports/debt-summary | EP-Valid | ✅ Pass |
| R12 - GET reports/debt-report | EP-Valid | ✅ Pass |
| R13 - GET reports/inventory-trends | EP-Valid | ✅ Pass |
| R14 - GET reports/sales-summary | EP-Valid | ✅ Pass |
| R15 - GET reports/inventory-summary | EP-Valid | ✅ Pass |
| R16 - POST reports/synchronize-data | EP-Valid | ✅ Pass |
| R17 - POST reports/export (type=sales) | EP-Valid | ✅ Pass |
| R18 - POST reports/export (type=invalid - BVA) | BVA | ✅ Pass |
| R19 - GET top-vehicles limit=-1 (BVA) | BVA | ✅ Pass |
| R20 - GET top-vehicles limit=0 (BVA) | BVA | ✅ Pass |

### 2.8 Module C - Notification & E2E Flow (18 requests)

**Notification (6 requests):**

| Request | Technique | Status |
|---|---|---|
| N1 - POST test-fcm (Happy-or-400) | EP-Valid | ✅ Pass |
| N2 - POST test-fcm (Empty Body - BVA) | BVA | ✅ Pass |
| N3 - POST subscribe-topic | EP-Valid | ✅ Pass |
| N4 - POST unsubscribe-topic | EP-Valid | ✅ Pass |
| N5 - POST send-to-topic | EP-Valid | ✅ Pass |
| N6 - POST send-multicast | EP-Valid | ✅ Pass |

**E2E Sales Flow (12 requests):**

| Request | Technique | Status |
|---|---|---|
| E2E-1 - POST Quote (Create Quote) | E2E | ✅ Pass |
| E2E-2 - GET Quote (Verify Active status) | E2E | ✅ Pass |
| E2E-3 - POST Order (Convert Quote to Order) | E2E | ✅ Pass |
| E2E-4 - GET Order (Verify Pending status) | E2E | ✅ Pass |
| E2E-5 - POST Contract (Create for Order) | E2E | ✅ Pass |
| E2E-6 - GET Contract (Verify created) | E2E | ✅ Pass |
| E2E-7 - POST Payment (Create for Order) | E2E | ✅ Pass |
| E2E-8 - POST Delivery (Create for Order) | E2E | ✅ Pass |
| E2E-9 - GET Orders (Verify full list) | E2E | ✅ Pass |
| E2E-10 - GET Payments (Verify list) | E2E | ✅ Pass |
| E2E-11 - GET Deliveries (Verify list) | E2E | ✅ Pass |
| E2E-12 - GET Contracts (Verify list - E2E complete) | E2E | ✅ Pass |

---

## 3. Tổng Hợp Theo Kỹ Thuật Kiểm Thử

| Kỹ thuật | Requests | Assertions | Status |
|---|---|---|---|
| Equivalence Partitioning (EP) | 62 | ~90 | ✅ All Pass |
| Boundary Value Analysis (BVA) | 30 | ~40 | ✅ All Pass |
| Decision Table (DT) | 20 | ~28 | ✅ All Pass |
| End-to-End (E2E) | 12 | ~12 | ✅ All Pass |
| **Tổng** | **124** | **170** | **✅ 100% Pass** |

---

## 4. Lịch Sử Các Lần Chạy

| Thời gian | Report file | Requests | Assertions | Kết quả | Ghi chú |
|---|---|---|---|---|---|
| 2026-07-03 16:17 | `module-c-newman-report_20260703_161732.json` | 124 | 170 | ✅ Pass | Lần chạy đầu tiên thành công |
| 2026-07-04 16:27 | `module-c-newman-report_20260704_162703.json` | 124 | 170 | ✅ Pass | Chạy kiểm tra lại (services đã chạy sẵn) |
| 2026-07-04 16:30 | `module-c-newman-report_20260704_163047.json` | 120 | 170 (165 fail) | ❌ Fail | Services chưa khởi động (ECONNREFUSED) |
| 2026-07-04 16:31 | `module-c-newman-report_20260704_163137.json` | 124 | 170 | ✅ Pass | Đã pass trước đó |
| 2026-07-05 16:12 | `module-c-newman-report_20260705_161258.json` | 124 | 170 | ✅ Pass | Chạy kiểm tra sau khi bật NotificationService |
| 2026-07-05 16:19 | `module-c-newman-report_20260705_161956.json` | 124 | 170 | ✅ Pass | **Lần chạy cuối — BÁO CÁO CHÍNH THỨC (Verified E2E + Notification)** |

---

## 5. Defect Đã Phát Hiện & Đã Fix

| Defect ID | Mô tả | Severity | Root Cause | Fix | Status |
|---|---|---|---|---|---|
| DEF-000 | 500 Internal Server Error trên toàn bộ SalesService | Blocker | SQLite DB corruption / Migration conflict | Xóa `sales.db` cũ, chạy lại EF migration | ✅ Closed |
| DEF-007 | BVA Quantity=0 không bị chặn (trả 201 thay vì 400) | High | `[FromQuery]` không kích hoạt Data Annotations `[Range]` | Đổi sang `[FromBody]` tại `QuotesController.cs` | ✅ Fixed / Retest Passed |
| DEF-008 | 500 khi restart SalesService | High | `EnsureCreated()` xung đột với `Migrate()` trong `Program.cs` | Xóa dòng `EnsureCreated()` | ✅ Fixed / Retest Passed |

---

## 6. File Report Đã Xuất

| Loại | Đường dẫn |
|---|---|
| Newman JSON (chính thức) | `reports/module-c-newman-report_20260705_161956.json` |
| Newman JUnit XML | `reports/module-c-newman-report_20260705_161956.xml` |
| White-box Coverage (Coverlet) | `reports/whitebox/module-c-whitebox-coverage.cobertura.xml` |
| White-box Test Results (TRX) | `reports/whitebox/module-c-whitebox-test-results.trx` |

---

## 7. Kết Luận

Module C đã được kiểm thử toàn diện với **124 API requests** và **170 assertions**, đạt tỷ lệ **100% Pass**. Toàn bộ 3 kỹ thuật kiểm thử (EP, BVA, DT) và luồng E2E đều hoạt động chính xác. Các Defect phát hiện (DEF-000, DEF-007, DEF-008) đã được fix và retest passed thành công.
