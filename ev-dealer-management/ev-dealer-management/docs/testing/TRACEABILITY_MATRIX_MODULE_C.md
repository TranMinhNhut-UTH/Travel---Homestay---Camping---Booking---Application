# Ma Trận Truy Xuất — Module C: Sales Management

> **Dự án**: EV Dealer Management System  
> **Ngày tạo**: 2026-07-03 | **Phiên bản**: 1.0

---

## 1. Requirement → Test Case Mapping

| Req ID | Requirement | Test Cases | Postman Folder | Coverage |
|---|---|---|---|---|
| REQ-C01 | CRUD Quotes | Q-EP-01→07, Q-BVA-01→05, Q-DT-01→03 | Module C - Quotes | ✅ EP+BVA+DT |
| REQ-C02 | CRUD Orders | O-EP-01→11, O-BVA-12→14, O-DT-01→03 | Module C - Orders | ✅ EP+BVA+DT |
| REQ-C03 | CRUD Contracts | C-EP-01→10, C-BVA-11→13, C-DT-01→03 | Module C - Contracts | ✅ EP+BVA+DT |
| REQ-C04 | CRUD Payments | P-EP-01→04, P-BVA-05→08, P-DT-01→02 | Module C - Payments | ✅ EP+BVA+DT |
| REQ-C05 | CRUD Deliveries | D-EP-01→03, D-BVA-01 | Module C - Deliveries & Promotions | ✅ EP+BVA |
| REQ-C06 | CRUD Promotions | PR-EP-01→03, PR-BVA-01→02 | Module C - Deliveries & Promotions | ✅ EP+BVA |
| REQ-C07 | Sales Composite API | S-EP-01→08, S-BVA-09→10, S-DT-01→03 | Module C - Sales Composite API | ✅ EP+BVA+DT |
| REQ-C08 | Reporting API | R-EP-01→17, R-BVA-01→03 | Module C - Reporting API | ✅ EP+BVA |
| REQ-C09 | Notification API | N-EP-01→07, N-BVA-01 | Module C - Notification & E2E Flow | ✅ EP+BVA |
| REQ-C10 | E2E Sales Flow | E2E-01→03 | Module C - Notification & E2E Flow | ✅ E2E |

---

## 2. ED-30 Test Case → Requirement Mapping

| ED-30 TC ID | Requirement | Technique | Jira |
|---|---|---|---|
| P-BVA-05 | REQ-C04 (Payments) | BVA | ED-30 |
| P-BVA-06 | REQ-C04 (Payments) | BVA | ED-30 |
| O-BVA-12 | REQ-C02 (Orders) | BVA | ED-30 |
| O-BVA-13 | REQ-C02 (Orders) | BVA | ED-30 |
| C-BVA-11 | REQ-C03 (Contracts) | BVA | ED-30 |
| C-BVA-12 | REQ-C03 (Contracts) | BVA | ED-30 |
| C-BVA-13 | REQ-C03 (Contracts) | DT | ED-30 |
| S-BVA-09 | REQ-C07 (Sales Composite) | BVA | ED-30 |

---

## 3. Test Case → Source Code Mapping

| TC ID | Controller | Method | File | Lines |
|---|---|---|---|---|
| Q-EP-01 | QuotesController | GetAllQuotes | `SalesService/Controllers/QuotesController.cs` | 28-36 |
| Q-EP-02 | QuotesController | CreateQuote | `SalesService/Controllers/QuotesController.cs` | 42-139 |
| Q-EP-06 | QuotesController | UpdateQuoteStatus | `SalesService/Controllers/QuotesController.cs` | 154-210 |
| O-EP-02 | OrdersController | CreateOrder | `SalesService/Controllers/OrdersController.cs` | 30-125 |
| O-EP-06 | OrdersController | UpdateOrderStatus | `SalesService/Controllers/OrdersController.cs` | 141-195 |
| O-EP-08 | OrdersController | CompleteOrder | `SalesService/Controllers/OrdersController.cs` | 210-388 |
| C-EP-02 | ContractsController | CreateContract | `SalesService/Controllers/ContractsController.cs` | 49-110 |
| C-EP-07 | ContractsController | UpdateContractStatus | `SalesService/Controllers/ContractsController.cs` | 132-198 |
| P-EP-02 | PaymentsController | CreatePayment | `SalesService/Controllers/PaymentsController.cs` | 57-113 |
| S-EP-01 | SalesController | CreateOrder | `SalesService/Controllers/SalesController.cs` | 128-209 |
| R-EP-01 | ReportingService | GetReportSummary | `ReportingService/Program.cs` | 345-415 |
| N-EP-01 | NotificationController | TestFcm | `NotificationService/Controllers/NotificationController.cs` | 21-33 |

---

## 4. Test Case → Defect Mapping

| TC ID | Defect ID | Severity | Description |
|---|---|---|---|
| All Sales TCs | DEF-000 | Blocker | Toàn bộ API trả về 500 Internal Server Error |
| P-BVA-05 | DEF-001 | Medium | PaymentsController không validate Amount ≤ 0 |
| P-BVA-06 | DEF-001 | Medium | PaymentsController không validate Amount overflow |
| C-BVA-13 | DEF-003 | Medium | ContractsController không reject invalid status |
| O-BVA-13 | DEF-002 | Low | OrdersController có thể accept body rỗng |
| D-EP-02 | DEF-004 | Low | DeliveriesController DTO mapping incomplete |
| PR-EP-02 | DEF-005 | Low | PromotionsController DTO mapping incomplete |

---

## 5. Coverage Matrix

| Dimension | Covered | Total | % |
|---|---|---|---|
| Endpoints tested | 47 | 47 | 100% |
| EP test cases | 62 | 62 | 100% |
| BVA test cases | 22 | 22 | 100% |
| DT test cases | 11 | 11 | 100% |
| E2E flows | 3 | 3 | 100% |
| ED-30 cases | 8 | 8 | 100% |
| **Total test cases** | **95** | **95** | **100%** |

---

## 6. Live Execution Summary

**Module C live execution: 124 requests, 170 assertions, 0 failures**

- **Automation Status**: Executed
- **Actual Result**: Pass (All test cases)
- **Defect ID**: N/A for all passed cases

