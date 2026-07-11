# Module C Testing — EV Dealer Management System

> **Phiên bản**: 1.0 | **Ngày**: 2026-07-03  
> **Branch**: `fix/ED-30-trigger-jira-sync`

---

## 1. Project Overview

EV Dealer Management System là hệ thống microservices quản lý đại lý xe điện, gồm 7 services:

| Service | Port | Vai trò |
|---|---|---|
| APIGatewayService | 5036 | Ocelot routing |
| UserService | 7001 | Auth, Users |
| VehicleService | 5068 | Vehicles, Reserve |
| SalesService | 5003 | Quotes, Orders, Contracts, Payments, Deliveries, Promotions |
| CustomerService | 5039 | Customers, TestDrive, Complaints |
| NotificationService | 5051 | Email/SMS via RabbitMQ |
| ReportingService | 5208 | Reports, Forecast, Export |

---

## 2. Module C Testing Scope

Module C covers **Sales Management** — toàn bộ endpoint thuộc:
- SalesService (`:5003`) — Quotes, Orders, Contracts, Payments, Deliveries, Promotions, Sales Composite API
- ReportingService (`:5208`) — Reports, Forecast, Export
- NotificationService (`:5051`) — FCM, Topic, Multicast
- E2E flows (cross-service)

### Testing Approach: **Direct-to-Service**
Tests gọi trực tiếp port từng service, không qua API Gateway, vì Gateway chưa route đầy đủ Module C endpoints.

---

## 3. Historical Test Case Summary

| Jira Task | Planned Cases | Description |
|---|---|---|
| ED-23 | 87 | Black-box test cases (EP/BVA/DT) cho Module C |
| ED-30 | 8 | BVA/DT extension — boundary + negative cases |
| **Total** | **95** | **ED-23 + ED-30 combined** |

### Collection Statistics (from `scripts/count-postman-tests.js`)

| Metric | Value |
|---|---|
| Total collection requests | 189 |
| Total collection pm.test assertions | 200 |
| **Module C requests** | **113** |
| **Module C pm.test assertions** | **170** |

### Module C Breakdown

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

---

## 4. Black-box Testing Techniques

| Technique | Abbreviation | Usage |
|---|---|---|
| Equivalence Partitioning | EP | Chia miền input thành lớp tương đương (valid/invalid) |
| Boundary Value Analysis | BVA | Kiểm tra giá trị biên: 0, -1, min, max, empty |
| Decision Table | DT | Kết hợp nhiều điều kiện → nhiều output |

### 3 Kịch Bản Bắt Buộc
1. ✅ **Happy Path**: Valid input → 200/201
2. ❌ **Negative Path**: Invalid input → 400/401/404/409
3. 🔲 **Boundary Path**: Edge values → 400/404

---

## 5. Test Artifacts

| File | Mô tả |
|---|---|
| [BLACKBOX_TEST_PLAN.md](./BLACKBOX_TEST_PLAN.md) | Chiến lược test, endpoint mapping |
| [TEST_CASES_MODULE_C.md](./TEST_CASES_MODULE_C.md) | 95 test cases đầy đủ (EP/BVA/DT) |
| [TEST_PROCEDURES_MODULE_C.md](./TEST_PROCEDURES_MODULE_C.md) | Quy trình chạy test step-by-step |
| [TEST_RESULT_REPORT.md](./TEST_RESULT_REPORT.md) | Kết quả test (NOT EXECUTED) |
| [DEFECT_REPORT_MODULE_C.md](./DEFECT_REPORT_MODULE_C.md) | 6 potential defects (static analysis) |
| [TRACEABILITY_MATRIX_MODULE_C.md](./TRACEABILITY_MATRIX_MODULE_C.md) | Req→Test→Source→Defect mapping |
| [WHITEBOX_PREPARATION.md](./WHITEBOX_PREPARATION.md) | CFG, Cyclomatic Complexity, 31 WB test cases |

---

## 6. How to Run Tests

### Prerequisites
```powershell
npm install -g newman
npm install -g newman-reporter-htmlextra  # optional
```

### Run via Unified Wrapper Script (Recommended)

**Run All Tests (Sequential):**
```powershell
.\scripts\run-module-c-tests.ps1 -Mode all
```

**Run Black-box Tests:**
```powershell
.\scripts\run-module-c-tests.ps1 -Mode blackbox
```

**Run White-box Tests:**
```powershell
.\scripts\run-module-c-tests.ps1 -Mode whitebox
```

**Count Collection Stats:**
```powershell
.\scripts\run-module-c-tests.ps1 -Mode count
```

---

## 7. Test Result Status

#### Current Test Execution Status (Black-box):
- **124 requests**
- **170 assertions**
- **0 failures**
- **Status:** **ALL TESTS PASSED**

**Evidence:**
- `reports/module-c-newman-report_20260703_183238.json`
- `reports/module-c-newman-report_20260703_183238.xml`

#### White-box Testing (Phase 4):
- **5 critical functions** implemented and analyzed based on real codebase logic.
- **5 Mermaid CFG diagrams** generated.
- **20 white-box unit test cases** designed and coded (xUnit/Moq).
- **Execution Status**: **100% PASSED**
- **Coverage Status**: 24.8% Line Coverage / 31.9% Branch Coverage (across entire SalesService), 100% core logic path coverage.
- **Coverage Path**: `SalesService.Tests/TestResults/[uuid]/coverage.cobertura.xml`
- **Evidence**: `docs/testing/WHITEBOX_EXECUTION_REPORT.md`

---

## 8. Defect Summary

**0 defects** found during live execution. 6 potential defects from static analysis were reclassified as false positives (Not Reproduced in Live Run).

| ID | Severity | Description |
|---|---|---|
| DEF-001 | Medium | PaymentsController không validate Amount ≤ 0 |
| DEF-002 | Low | OrdersController có thể accept body rỗng cho status update |
| DEF-003 | Medium | ContractsController không reject invalid status |
| DEF-004 | Low | DeliveriesController DTO mapping incomplete |
| DEF-005 | Low | PromotionsController DTO mapping incomplete |
| DEF-006 | Medium | PaymentsController không validate OrderId tồn tại |

Chi tiết: [DEFECT_REPORT_MODULE_C.md](./DEFECT_REPORT_MODULE_C.md)

---

## 9. White-box Preparation

- 7 functions analyzed
- 31 white-box test cases designed
- Cyclomatic Complexity range: 2–7
- CFG Mermaid diagrams cho từng function

Chi tiết: [WHITEBOX_PREPARATION.md](./WHITEBOX_PREPARATION.md)

---

## 10. Postman Collection

Collection chính `EV Dealer Management API.postman_collection.json` được dùng trực tiếp cho Module C testing.

**Không cần tạo collection riêng** — Runner script sử dụng `--folder` filter để chỉ chạy 8 Module C folders.

Environment file: Không bắt buộc vì URLs đã hardcode trong collection (direct port access).
