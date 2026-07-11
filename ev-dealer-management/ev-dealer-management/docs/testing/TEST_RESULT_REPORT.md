# Báo Cáo Kết Quả Kiểm Thử — Module C: Sales Management

> **Dự án**: EV Dealer Management System  
> **Ngày tạo**: 2026-07-03 | **Cập nhật**: 2026-07-05 | **Phiên bản**: 2.1  
> **Trạng thái**: 🟢 PASSED (100%)

> 📌 **Báo cáo chi tiết**: Xem `docs/testing/TEST_RESULT_REPORT_MODULE_C.md` để biết kết quả từng request, kỹ thuật kiểm thử áp dụng, và lịch sử các lần chạy.

---

## 1. Tổng Quan

| Metric | Giá trị |
|---|---|
| Tổng test cases planned (ED-23 + ED-30) | 95 |
| Tổng Postman requests (executed) | 124 |
| Tổng pm.test assertions | 170 |
| Số pm.test Pass | 170 |
| Số pm.test Fail | 0 |
| Số Failures | 0 |
| **Trạng thái chạy** | **EXECUTED (PASSED)** |

---

## 2. Kết Quả Chạy Thực Tế (Live Run)

Trong phiên chạy live bằng Newman (2026-07-03 16:17:32) với cờ `-SkipHealthCheck` sau khi đã fix lỗi 500 ở SalesService:
- **ReportingService (5208)**: Các test cases chạy thành công 100% (HTTP 200).
- **SalesService (5003)**: Lỗi 500 Internal Server Error (DEF-000) đã được khắc phục hoàn toàn bằng cách xóa database cũ và chạy lại `dotnet ef database update`. Các endpoint liên quan đến Quotes, Orders, Contracts, Payments, Deliveries đều trả về đúng status code (201, 200, 400, 404).
- Luồng E2E chạy thành công 100%.

---

## 3. ED-30 Test Cases Status

| TC ID | Test Case | Expected | Actual | Status |
|---|---|---|---|---|
| P-BVA-05 | Payment Amount = -1 → 400 | 400 | 400 | PASS |
| P-BVA-06 | Payment Amount = 9999999999999 → 400 | 400 | 400 | PASS |
| O-BVA-12 | Get Order ID = 0 → 404 | 404 | 404 | PASS |
| O-BVA-13 | Update Order Status body rỗng → 400 | 400 | 400 | PASS |
| C-BVA-11 | Create Contract body rỗng → 400 | 400 | 400 | PASS |
| C-BVA-12 | Get Contract ID = 0 → 404 | 404 | 404 | PASS |
| C-BVA-13 | Update Contract status không hợp lệ → 400 | 400 | 400 | PASS |
| S-BVA-09 | Create Sales Order body rỗng → 400 | 400 | 400 | PASS |

---

## 4. Kỹ Thuật Kiểm Thử Đã Áp Dụng

| Kỹ thuật | Số test cases | Tỷ lệ |
|---|---|---|
| Equivalence Partitioning (EP) | 62 | 65.3% |
| Boundary Value Analysis (BVA) | 22 | 23.2% |
| Decision Table (DT) | 11 | 11.6% |
| **Tổng** | **95** | **100%** |

---

## 5. File Report Đã Xuất
- `reports/module-c-newman-report_20260703_161732.json`
- `reports/module-c-newman-report_20260703_161732.xml`
