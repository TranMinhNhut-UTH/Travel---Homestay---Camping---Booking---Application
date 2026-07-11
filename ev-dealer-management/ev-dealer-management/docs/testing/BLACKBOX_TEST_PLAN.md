# Kế Hoạch Kiểm Thử Hộp Đen — Module C: Sales Management

> **Dự án**: EV Dealer Management System  
> **Môn học**: Kiểm Chứng Phần Mềm (KCPM)  
> **Jira Tasks**: ED-23 (API Test), ED-30 (BVA/DT Extension)  
> **Ngày tạo**: 2026-07-03  
> **Phiên bản**: 1.0

---

## 1. Mục Tiêu

Kiểm thử toàn bộ API endpoints thuộc **Module C — Sales Management** của hệ thống EV Dealer Management bằng phương pháp **Black-box Testing** (hộp đen), sử dụng các kỹ thuật:

| Kỹ thuật | Viết tắt | Mục đích |
|---|---|---|
| Equivalence Partitioning | EP | Chia miền input thành lớp tương đương (valid/invalid) |
| Boundary Value Analysis | BVA | Kiểm tra giá trị biên (min, min±1, max, max±1) |
| Decision Table Testing | DT | Kiểm tra kết hợp nhiều điều kiện → nhiều output |

---

## 2. Phạm Vi Kiểm Thử

### 2.1 Services Liên Quan

| Service | Port | Vai trò trong Module C |
|---|---|---|
| SalesService | 5003 | CRUD: Quotes, Orders, Contracts, Payments, Deliveries, Promotions, Sales Composite |
| ReportingService | 5208 | Báo cáo doanh số, tồn kho, export CSV |
| NotificationService | 5051 | FCM push notification (test-fcm, subscribe/unsubscribe topic) |
| APIGatewayService | 5036 | Ocelot routing (KHÔNG route SalesService/ReportingService trực tiếp) |

### 2.2 Endpoint Mapping — Module C

| # | Controller | Method | Endpoint | Port |
|---|---|---|---|---|
| 1 | QuotesController | GET | `/api/Quotes` | 5003 |
| 2 | QuotesController | POST | `/api/Quotes` | 5003 |
| 3 | QuotesController | GET | `/api/Quotes/{id}` | 5003 |
| 4 | QuotesController | PUT | `/api/Quotes/{id}/status` | 5003 |
| 5 | OrdersController | GET | `/api/Orders` | 5003 |
| 6 | OrdersController | POST | `/api/Orders` | 5003 |
| 7 | OrdersController | GET | `/api/Orders/{id}` | 5003 |
| 8 | OrdersController | PUT | `/api/Orders/{id}/status` | 5003 |
| 9 | OrdersController | PUT | `/api/Orders/{id}/complete` | 5003 |
| 10 | ContractsController | GET | `/api/Contracts` | 5003 |
| 11 | ContractsController | POST | `/api/Contracts` | 5003 |
| 12 | ContractsController | GET | `/api/Contracts/{id}` | 5003 |
| 13 | ContractsController | PUT | `/api/Contracts/{id}/status` | 5003 |
| 14 | PaymentsController | GET | `/api/Payments` | 5003 |
| 15 | PaymentsController | POST | `/api/Payments` | 5003 |
| 16 | DeliveriesController | GET | `/api/Deliveries` | 5003 |
| 17 | DeliveriesController | POST | `/api/Deliveries` | 5003 |
| 18 | PromotionsController | GET | `/api/Promotions` | 5003 |
| 19 | PromotionsController | POST | `/api/Promotions` | 5003 |
| 20 | SalesController | POST | `/api/Sales/orders` | 5003 |
| 21 | SalesController | GET | `/api/Sales/orders/{id}` | 5003 |
| 22 | SalesController | POST | `/api/Sales/contracts` | 5003 |
| 23 | SalesController | GET | `/api/Sales/contracts/{id}` | 5003 |
| 24 | SalesController | GET | `/api/Sales/quotes/{id}` | 5003 |
| 25 | ReportingService | GET | `/api/reports/summary` | 5208 |
| 26 | ReportingService | GET | `/api/reports/sales-by-region` | 5208 |
| 27 | ReportingService | GET | `/api/reports/sales-proportion` | 5208 |
| 28 | ReportingService | GET | `/api/reports/top-vehicles` | 5208 |
| 29 | ReportingService | POST | `/api/reports/export` | 5208 |
| 30 | ReportingService | GET | `/api/reports/demand-forecast` | 5208 |
| 31 | ReportingService | POST | `/api/reports/synchronize-data` | 5208 |
| 32 | ReportingService | GET | `/api/reports/debt-summary` | 5208 |
| 33 | ReportingService | GET | `/api/reports/debt-report` | 5208 |
| 34 | ReportingService | GET | `/api/reports/sales-by-dealer` | 5208 |
| 35 | ReportingService | GET | `/api/reports/inventory-trends` | 5208 |
| 36 | ReportingService | GET | `/api/reports/sales-by-staff` | 5208 |
| 37 | ReportingService | GET | `/api/reports/sales-summary` | 5208 |
| 38 | ReportingService | GET | `/api/reports/sales-summary/{id}` | 5208 |
| 39 | ReportingService | POST | `/api/reports/sales-summary` | 5208 |
| 40 | ReportingService | GET | `/api/reports/inventory-summary` | 5208 |
| 41 | ReportingService | GET | `/api/reports/inventory-summary/{id}` | 5208 |
| 42 | ReportingService | POST | `/api/reports/inventory-summary` | 5208 |
| 43 | NotificationController | POST | `/api/Notification/test-fcm` | 5051 |
| 44 | NotificationController | POST | `/api/Notification/subscribe-topic` | 5051 |
| 45 | NotificationController | POST | `/api/Notification/unsubscribe-topic` | 5051 |
| 46 | NotificationController | POST | `/api/Notification/send-to-topic` | 5051 |
| 47 | NotificationController | POST | `/api/Notification/send-multicast` | 5051 |

### 2.3 Lưu Ý Về Gateway

Ocelot gateway (`ocelot.json`) **KHÔNG có route** cho SalesService, ReportingService, hay NotificationService. Tất cả test gọi **trực tiếp** vào port của từng service.

---

## 3. Kịch Bản Kiểm Thử (3 loại bắt buộc)

### 3.1 Happy Path (Positive Test) ✅
- Input hợp lệ → HTTP 200/201/204
- Verify response body có đúng cấu trúc, đúng dữ liệu
- Verify side effects (status change, relationship created)

### 3.2 Negative Path ❌
- Input sai logic → HTTP 400/401/404/409
- Thiếu field bắt buộc
- ID không tồn tại
- Trạng thái không hợp lệ
- Duplicate resource

### 3.3 Boundary Path 🔲
- ID = 0, ID = -1, ID = 999999
- Amount = 0, Amount = -1, Amount = 9999999999999
- Body rỗng `{}`
- String rỗng, null
- Giá trị biên min/max

---

## 4. Số Lượng Test Case

| Nguồn | Planned | Ghi chú |
|---|---|---|
| ED-23 | 87 | API test cases Module C |
| ED-30 | 8 | BVA/DT extension test cases |
| **Tổng planned** | **95** | |

### Trạng Thái Postman Collection Hiện Tại

| Metric | Giá trị |
|---|---|
| Toàn collection requests | 189 |
| Toàn collection pm.test | 200 |
| Module C requests | 113 |
| Module C pm.test | 170 |

### Module C Chi Tiết Theo Folder

| Folder | Requests | pm.test |
|---|---|---|
| Module C - Quotes | 12 | 20 |
| Module C - Orders | 16 | 31 |
| Module C - Contracts | 13 | 24 |
| Module C - Payments | 9 | 17 |
| Module C - Deliveries & Promotions | 12 | 18 |
| Module C - Sales Composite API | 13 | 18 |
| Module C - Reporting API | 20 | 20 |
| Module C - Notification & E2E Flow | 18 | 22 |
| **Tổng Module C** | **113** | **170** |

---

## 5. Công Cụ & Môi Trường

| Hạng mục | Giá trị |
|---|---|
| Tool | Postman v11+ / Newman CLI |
| Collection | `EV Dealer Management API.postman_collection.json` |
| Environment | `postman/Module_C_Local.postman_environment.json` |
| Runner script | `scripts/run-module-c-blackbox-tests.ps1` |
| Report output | `reports/module-c-newman-report.json`, `.xml` |
| Report format | JSON + JUnit XML |

---

## 6. Tiêu Chí Đạt/Không Đạt

| Tiêu chí | Yêu cầu |
|---|---|
| Test Pass Rate | 100% (tất cả pm.test phải PASS) |
| Coverage | Tất cả 47 endpoints có ít nhất 1 test |
| Kỹ thuật | Mỗi controller phải có EP + BVA + DT test |
| Kịch bản | Mỗi endpoint: Happy Path + Negative + Boundary |
| ED-30 cases | 8 BVA/DT cases phải có và PASS |

---

## 7. Rủi Ro & Giảm Thiểu

| Rủi ro | Mức độ | Giảm thiểu |
|---|---|---|
| Service không chạy | Cao | Script kiểm tra health trước khi test |
| RabbitMQ disabled | Thấp | Notification test qua HTTP trực tiếp |
| Database trống | Trung bình | Postman pre-request tạo data setup |
| Port conflict | Thấp | Sử dụng port cố định trong environment |

---

## 8. Tham Chiếu

- `docs/testing/TEST_CASES_MODULE_C.md` — Chi tiết từng test case
- `docs/testing/TEST_PROCEDURES_MODULE_C.md` — Quy trình chạy test
- `docs/testing/TRACEABILITY_MATRIX_MODULE_C.md` — Ma trận truy xuất
- `docs/testing/DEFECT_REPORT_MODULE_C.md` — Báo cáo lỗi
- `docs/testing/WHITEBOX_PREPARATION.md` — Chuẩn bị White-box
- `docs/testing/TEST_RESULT_REPORT.md` — Báo cáo kết quả
