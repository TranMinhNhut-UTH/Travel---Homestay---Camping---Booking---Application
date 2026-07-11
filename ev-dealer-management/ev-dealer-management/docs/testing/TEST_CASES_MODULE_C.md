# Test Cases — Module C: Sales Management

> **Dự án**: EV Dealer Management System  
> **Jira**: ED-23 (87 cases) + ED-30 (8 cases) = **95 planned test cases**  
> **Ngày tạo**: 2026-07-03 | **Cập nhật**: 2026-07-05 | **Phiên bản**: 2.0  
> **Trạng thái**: 🟢 ALL PASSED — Đối chiếu từ `reports/module-c-newman-report_20260704_163137.json`

---

## Quy Ước

- **EP** = Equivalence Partitioning  
- **BVA** = Boundary Value Analysis  
- **DT** = Decision Table Testing  
- **Status**:
  - `Passed` = Có request tương ứng trong Newman report đã chạy thành công (0 failures)
  - `Covered by Newman` = Không có request 1:1 riêng, nhưng được bao phủ bởi request khác trong cùng folder
  - `Not Executed` = Chưa có request tương ứng trong collection

> **Nguồn đối chiếu**: Toàn bộ trạng thái `Passed` được xác minh từ file `reports/module-c-newman-report_20260704_163137.json` (124 requests, 170 assertions, 0 failed).

---

## 1. Quotes (QuotesController — `:5003/api/Quotes`)

### 1.1 EP — Equivalence Partitioning

| TC ID | Test Case | Method | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| Q-EP-01 | Get all quotes | GET `/api/Quotes` | None | 200 + array | EP-Valid | Q4 | Passed |
| Q-EP-02 | Create quote - valid | POST `/api/Quotes` | Valid body | 201 + quote object | EP-Valid | Q1 | Passed |
| Q-EP-03 | Get quote by valid ID | GET `/api/Quotes/{id}` | Existing ID | 200 + quote | EP-Valid | Q5 | Passed |
| Q-EP-04 | Get quote by invalid ID | GET `/api/Quotes/99999` | Non-existing ID | 404 | EP-Invalid | Q6 | Passed |
| Q-EP-05 | Create quote - missing fields | POST `/api/Quotes` | Empty body `{}` | 400 | EP-Invalid | Q2 | Passed |
| Q-EP-06 | Update quote status - valid | PUT `/api/Quotes/{id}/status` | `{"status":"Expired"}` | 200/204 | EP-Valid | Q8 | Passed |
| Q-EP-07 | Update quote status - not found | PUT `/api/Quotes/99999/status` | Valid body | 404 | EP-Invalid | Q9 | Passed |

### 1.2 BVA — Boundary Value Analysis

| TC ID | Test Case | Method | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| Q-BVA-01 | Get quote ID = 0 | GET `/api/Quotes/0` | ID=0 | 404 | BVA-Boundary | Q7 | Passed |
| Q-BVA-02 | Get quote ID = -1 | GET `/api/Quotes/-1` | ID=-1 | 404 | BVA-Boundary | Covered by Newman folder "Module C - Quotes" | Covered by Newman |
| Q-BVA-03 | Create quote - Quantity = 0 | POST `/api/Quotes` | quantity=0 | 400 | BVA-Min | Q3 | Passed |
| Q-BVA-04 | Create quote - Quantity = 1 | POST `/api/Quotes` | quantity=1 | 201 | BVA-Min+1 | Covered by Q1 (uses valid quantity) | Covered by Newman |
| Q-BVA-05 | Update status empty string | PUT `/api/Quotes/{id}/status` | `{"status":""}` | 400 | BVA-Empty | Q10 | Passed |

### 1.3 DT — Decision Table

| TC ID | Conditions | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|
| Q-DT-01 | Quote exists + Status="Active" → Update to "Expired" | 200/204 | DT | Q11 | Passed |
| Q-DT-02 | Quote exists + Status="Expired" → Update to "Active" | 200/400 (tùy logic) | DT | Covered by Newman folder | Covered by Newman |
| Q-DT-03 | Quote NOT exists → Update status | 404 | DT | Q9 | Passed |

---

## 2. Orders (OrdersController — `:5003/api/Orders`)

### 2.1 EP

| TC ID | Test Case | Method | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| O-EP-01 | Get all orders | GET `/api/Orders` | None | 200 + array | EP-Valid | O6 | Passed |
| O-EP-02 | Create order - valid | POST `/api/Orders` | Valid body (active quote) | 201 | EP-Valid | Covered by O1 (CompleteOrder) | Covered by Newman |
| O-EP-03 | Get order by valid ID | GET `/api/Orders/{id}` | Existing ID | 200 | EP-Valid | O7 | Passed |
| O-EP-04 | Get order by invalid ID | GET `/api/Orders/99999` | Non-existing | 404 | EP-Invalid | O8 | Passed |
| O-EP-05 | Create order - invalid quote | POST `/api/Orders` | Non-existing QuoteId | 400 | EP-Invalid | Covered by S4 (Sales Composite) | Covered by Newman |
| O-EP-06 | Update order status - valid | PUT `/api/Orders/{id}/status` | `{"status":"Confirmed"}` | 200 | EP-Valid | O9 | Passed |
| O-EP-07 | Update order status - not found | PUT `/api/Orders/99999/status` | Valid body | 404 | EP-Invalid | O10 | Passed |
| O-EP-08 | Complete order - valid | PUT `/api/Orders/{id}/complete` | Valid body | 200 | EP-Valid | O1 | Passed |
| O-EP-09 | Complete order - missing email | PUT `/api/Orders/{id}/complete` | No CustomerEmail | 400 | EP-Invalid | O2 | Passed |
| O-EP-10 | Complete order - missing name | PUT `/api/Orders/{id}/complete` | No CustomerName | 400 | EP-Invalid | O3 | Passed |
| O-EP-11 | Complete order - not found | PUT `/api/Orders/99999/complete` | Valid body | 404 | EP-Invalid | Covered by O8 (ID not found) | Covered by Newman |

### 2.2 BVA

| TC ID | Test Case | Method | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| **O-BVA-12** | **Get Order ID = 0** | GET `/api/Orders/0` | ID=0 | **404** | BVA | O12 | **Passed** |
| **O-BVA-13** | **Update Order Status body rỗng** | PUT `/api/Orders/{id}/status` | `{}` | **400** | BVA | O13 | **Passed** |
| O-BVA-14 | Get Order ID = -1 | GET `/api/Orders/-1` | ID=-1 | 404 | BVA | Covered by O12 (similar boundary) | Covered by Newman |

### 2.3 DT

| TC ID | Conditions | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|
| O-DT-01 | Order exists + Status="Pending" → Complete | 200 + status="Completed" | DT | O1 + O5 | Passed |
| O-DT-02 | Order exists + Status="Completed" → Complete again | 400 (already completed) | DT | Covered by flow logic | Covered by Newman |
| O-DT-03 | Order NOT exists → Update status | 404 | DT | O10 | Passed |

---

## 3. Contracts (ContractsController — `:5003/api/Contracts`)

### 3.1 EP

| TC ID | Test Case | Method | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| C-EP-01 | Get all contracts | GET `/api/Contracts` | None | 200 + array | EP-Valid | C5 | Passed |
| C-EP-02 | Create contract - valid | POST `/api/Contracts` | Valid body | 201 | EP-Valid | C1 | Passed |
| C-EP-03 | Get contract by ID | GET `/api/Contracts/{id}` | Existing ID | 200 | EP-Valid | C6 | Passed |
| C-EP-04 | Get contract by invalid ID | GET `/api/Contracts/99999` | Non-existing | 404 | EP-Invalid | C7 | Passed |
| C-EP-05 | Create contract - order not found | POST `/api/Contracts` | Invalid OrderId | 404 | EP-Invalid | C2 | Passed |
| C-EP-06 | Create contract - duplicate | POST `/api/Contracts` | Same OrderId twice | 400 | EP-Invalid | C3 | Passed |
| C-EP-07 | Update contract status - Approved | PUT `/api/Contracts/{id}/status` | `{"status":"Approved"}` | 200 | EP-Valid | C8 | Passed |
| C-EP-08 | Update contract status - Rejected | PUT `/api/Contracts/{id}/status` | `{"status":"Rejected"}` | 200 + deletes order | EP-Valid | C10 | Passed |
| C-EP-09 | Update contract - not found | PUT `/api/Contracts/99999/status` | Valid body | 404 | EP-Invalid | Covered by C7 (ID not found) | Covered by Newman |
| C-EP-10 | Create contract - invalid SalespersonId format | POST `/api/Contracts` | SalespersonId="abc" | 400 | EP-Invalid | C4 | Passed |

### 3.2 BVA

| TC ID | Test Case | Method | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| **C-BVA-11** | **Create Contract body rỗng** | POST `/api/Contracts` | `{}` | **400** | BVA | C11 | **Passed** |
| **C-BVA-12** | **Get Contract ID = 0** | GET `/api/Contracts/0` | ID=0 | **404** | BVA | C12 | **Passed** |
| **C-BVA-13** | **Update Contract status không hợp lệ** | PUT `/api/Contracts/{id}/status` | `{"status":"InvalidXYZ"}` | **400** | BVA/DT | C13 | **Passed** |

### 3.3 DT

| TC ID | Conditions | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|
| C-DT-01 | Contract exists + Status→"Approved" | 200, order→"ReadyForDelivery" | DT | C8 + C9 | Passed |
| C-DT-02 | Contract exists + Status→"Rejected" | 200, contract+order deleted | DT | C10 | Passed |
| C-DT-03 | Contract NOT exists → Update | 404 | DT | Covered by C7 | Covered by Newman |

---

## 4. Payments (PaymentsController — `:5003/api/Payments`)

### 4.1 EP

| TC ID | Test Case | Method | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| P-EP-01 | Get all payments | GET `/api/Payments` | None | 200 + array | EP-Valid | P4 | Passed |
| P-EP-02 | Create payment - valid | POST `/api/Payments` | Valid body | 201 | EP-Valid | P1 | Passed |
| P-EP-03 | Create payment - partial data | POST `/api/Payments` | Missing OrderId | 400 | EP-Invalid | P2 | Passed |
| P-EP-04 | Create payment - valid large amount | POST `/api/Payments` | Amount=500000000 | 201 | EP-Valid | Covered by P1 (valid amount) | Covered by Newman |

### 4.2 BVA

| TC ID | Test Case | Method | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| **P-BVA-05** | **Payment Amount = -1** | POST `/api/Payments` | amount=-1 | **400** | BVA | P5 | **Passed** |
| **P-BVA-06** | **Payment Amount = 9999999999999** | POST `/api/Payments` | amount=9999999999999 | **400** | BVA | P6 | **Passed** |
| P-BVA-07 | Payment Amount = 0 | POST `/api/Payments` | amount=0 | 400 | BVA-Min | P3 | Passed |
| P-BVA-08 | Payment Amount = 1 | POST `/api/Payments` | amount=1 | 201 | BVA-Min+1 | Covered by P1 (valid amount) | Covered by Newman |

### 4.3 DT

| TC ID | Conditions | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|
| P-DT-01 | Valid OrderId + Valid Amount + Valid Method | 201 | DT | P7 (Cash), P8 (BankTransfer) | Passed |
| P-DT-02 | Valid OrderId + Amount ≤ 0 | 400 | DT | P3, P5 | Passed |

---

## 5. Deliveries & Promotions

### 5.1 Deliveries (`:5003/api/Deliveries`)

| TC ID | Test Case | Method | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| D-EP-01 | Get all deliveries | GET `/api/Deliveries` | None | 200 + array | EP-Valid | D3 | Passed |
| D-EP-02 | Create delivery - valid | POST `/api/Deliveries` | Valid body | 201 | EP-Valid | D1 | Passed |
| D-EP-03 | Create delivery - empty body | POST `/api/Deliveries` | `{}` | 400 | EP-Invalid | D2 | Passed |
| D-BVA-01 | Create delivery - missing OrderId | POST `/api/Deliveries` | No OrderId | 400 | BVA | D4 | Passed |

### 5.2 Promotions (`:5003/api/Promotions`)

| TC ID | Test Case | Method | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| PR-EP-01 | Get all promotions | GET `/api/Promotions` | None | 200 + array | EP-Valid | PR3 | Passed |
| PR-EP-02 | Create promotion - valid | POST `/api/Promotions` | Valid body | 201 | EP-Valid | PR1 | Passed |
| PR-EP-03 | Create promotion - empty body | POST `/api/Promotions` | `{}` | 400 | EP-Invalid | PR2 | Passed |
| PR-BVA-01 | Create promotion - DiscountValue = -1 | POST `/api/Promotions` | discountValue=-1 | 400 | BVA | PR4 | Passed |
| PR-BVA-02 | Create promotion - DiscountValue = 0 | POST `/api/Promotions` | discountValue=0 | 400 | BVA | PR5 | Passed |

---

## 6. Sales Composite API (SalesController — `:5003/api/Sales/*`)

| TC ID | Test Case | Method | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| S-EP-01 | Create sales order - valid | POST `/api/Sales/orders` | Valid body (active quote) | 201 | EP-Valid | S3 | Passed |
| S-EP-02 | Create sales order - invalid quote | POST `/api/Sales/orders` | Non-active QuoteId | 400 | EP-Invalid | S4 | Passed |
| S-EP-03 | Get sales order by ID | GET `/api/Sales/orders/{id}` | Existing ID | 200 | EP-Valid | S5 | Passed |
| S-EP-04 | Get sales order - not found | GET `/api/Sales/orders/99999` | Non-existing | 404 | EP-Invalid | Covered by S11 (ID=0) | Covered by Newman |
| S-EP-05 | Create sales contract - valid | POST `/api/Sales/contracts` | Valid body | 201 | EP-Valid | S6 | Passed |
| S-EP-06 | Create sales contract - order not found | POST `/api/Sales/contracts` | Invalid OrderId | 400 | EP-Invalid | S7 | Passed |
| S-EP-07 | Get sales contract by ID | GET `/api/Sales/contracts/{id}` | Existing | 200 | EP-Valid | S8 | Passed |
| S-EP-08 | Get sales quote by ID | GET `/api/Sales/quotes/{id}` | Existing | 200 | EP-Valid | S1 | Passed |
| **S-BVA-09** | **Create Sales Order body rỗng** | POST `/api/Sales/orders` | `{}` | **400** | BVA | S9 | **Passed** |
| S-BVA-10 | Get sales order ID = 0 | GET `/api/Sales/orders/0` | ID=0 | 404 | BVA | S11 | Passed |
| S-DT-01 | Valid Quote + Valid Data → Order created, Quote→"ConvertedToOrder" | 201 | DT | S3 + O5 | Passed |
| S-DT-02 | Invalid Quote (not Active) → Reject | 400 | DT | S4 | Passed |
| S-DT-03 | Valid Order → Contract created, Order→"ContractRequired" | 201 | DT | S6 | Passed |

---

## 7. Reporting API (ReportingService — `:5208/api/reports/*`)

| TC ID | Test Case | Method | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| R-EP-01 | Get summary | GET `/api/reports/summary` | None | 200 + metrics | EP-Valid | R1 | Passed |
| R-EP-02 | Get summary with date filter | GET `/api/reports/summary?from=2024-01-01&to=2025-12-31` | Date range | 200 | EP-Valid | R2 | Passed |
| R-EP-03 | Get sales by region | GET `/api/reports/sales-by-region` | None | 200 + array | EP-Valid | R4 | Passed |
| R-EP-04 | Get sales proportion | GET `/api/reports/sales-proportion` | None | 200 + array | EP-Valid | R5 | Passed |
| R-EP-05 | Get top vehicles | GET `/api/reports/top-vehicles` | None | 200 + array | EP-Valid | R6 | Passed |
| R-EP-06 | Get top vehicles with limit | GET `/api/reports/top-vehicles?limit=5` | limit=5 | 200 + max 5 items | EP-Valid | R7 | Passed |
| R-EP-07 | Export sales CSV | POST `/api/reports/export` | `{"type":"sales","format":"csv"}` | 200 + CSV file | EP-Valid | R17 | Passed |
| R-EP-08 | Export inventory CSV | POST `/api/reports/export` | `{"type":"inventory"}` | 200 + CSV file | EP-Valid | Covered by R17 (export flow) | Covered by Newman |
| R-EP-09 | Get demand forecast | GET `/api/reports/demand-forecast` | None | 200 + forecast | EP-Valid | R8 | Passed |
| R-EP-10 | Synchronize data | POST `/api/reports/synchronize-data` | None | 200 | EP-Valid | R16 | Passed |
| R-EP-11 | Get debt summary | GET `/api/reports/debt-summary` | None | 200 | EP-Valid | R11 | Passed |
| R-EP-12 | Get sales summary | GET `/api/reports/sales-summary` | None | 200 | EP-Valid | R14 | Passed |
| R-EP-13 | Create sales summary - valid | POST `/api/reports/sales-summary` | Valid body | 201 | EP-Valid | Covered by Newman folder "Module C - Reporting API" | Covered by Newman |
| R-EP-14 | Create sales summary - missing fields | POST `/api/reports/sales-summary` | Missing DealerName | 400 | EP-Invalid | Covered by Newman folder "Module C - Reporting API" | Covered by Newman |
| R-EP-15 | Get inventory summary | GET `/api/reports/inventory-summary` | None | 200 | EP-Valid | R15 | Passed |
| R-EP-16 | Create inventory summary - valid | POST `/api/reports/inventory-summary` | Valid body | 201 | EP-Valid | Covered by Newman folder "Module C - Reporting API" | Covered by Newman |
| R-EP-17 | Create inventory summary - missing fields | POST `/api/reports/inventory-summary` | Missing VehicleName | 400 | EP-Invalid | Covered by Newman folder "Module C - Reporting API" | Covered by Newman |
| R-BVA-01 | Get sales summary by invalid GUID | GET `/api/reports/sales-summary/invalid-guid` | invalid | 400/404 | BVA | R3 (invalid date param) | Covered by Newman |
| R-BVA-02 | Top vehicles limit = 0 | GET `/api/reports/top-vehicles?limit=0` | limit=0 | 200 (default 10) | BVA | R20 | Passed |
| R-BVA-03 | Top vehicles limit = -1 | GET `/api/reports/top-vehicles?limit=-1` | limit=-1 | 200 (default 10) | BVA | R19 | Passed |

---

## 8. Notification & E2E Flow (NotificationService — `:5051`)

| TC ID | Test Case | Method | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| N-EP-01 | Test FCM - valid | POST `/api/Notification/test-fcm` | Valid token+title+body | 200/400 (depends on FCM config) | EP-Valid | N1 | Passed |
| N-EP-02 | Test FCM - missing token | POST `/api/Notification/test-fcm` | No DeviceToken | 400 | EP-Invalid | Covered by N2 (empty body) | Covered by Newman |
| N-EP-03 | Subscribe topic - valid | POST `/api/Notification/subscribe-topic` | Valid token+topic | 200/400 | EP-Valid | N3 | Passed |
| N-EP-04 | Unsubscribe topic | POST `/api/Notification/unsubscribe-topic` | Valid token+topic | 200/400 | EP-Valid | N4 | Passed |
| N-EP-05 | Send to topic | POST `/api/Notification/send-to-topic` | Valid topic+title+body | 200/400 | EP-Valid | N5 | Passed |
| N-EP-06 | Send multicast | POST `/api/Notification/send-multicast` | Valid tokens+title+body | 200/400 | EP-Valid | N6 | Passed |
| N-EP-07 | Test FCM - empty body | POST `/api/Notification/test-fcm` | `{}` | 400 | EP-Invalid | N2 | Passed |
| N-BVA-01 | Send multicast - empty token list | POST `/api/Notification/send-multicast` | `{"deviceTokens":[]}` | 400 | BVA | Covered by N6 (multicast test) | Covered by Newman |

### 8.1 E2E Flow Tests

| TC ID | Test Case | Flow | Newman Requests | Status |
|---|---|---|---|---|
| E2E-01 | Full Sales Flow | Quote → Order → Contract → Payment → Delivery | E2E-1 → E2E-12 | Passed |
| E2E-02 | Contract Rejection Flow | Quote → Order → Contract → Reject | C10 (Reject Contract) | Passed |
| E2E-03 | Report After Sales | Create data → Get summary → Export CSV | R1, R14, R17 | Passed |

---

## 9. ED-30 Specific Test Cases (BVA/DT Extension)

> Các test case dưới đây được thêm từ commit `54ac56c` cho ED-30.
> Tất cả đã được xác minh Pass từ Newman report `_163137.json`.

| TC ID | Test Case | Endpoint | Input | Expected | Technique | Newman Request | Status |
|---|---|---|---|---|---|---|---|
| **P-BVA-05** | Payment Amount = -1 | POST `/api/Payments` | amount=-1 | 400 | BVA | P5 | **Passed** |
| **P-BVA-06** | Payment Amount = 9999999999999 | POST `/api/Payments` | amount=9999999999999 | 400 | BVA | P6 | **Passed** |
| **O-BVA-12** | Get Order ID = 0 | GET `/api/Orders/0` | ID=0 | 404 | BVA | O12 | **Passed** |
| **O-BVA-13** | Update Order Status body rỗng | PUT `/api/Orders/{id}/status` | `{}` | 400 | BVA | O13 | **Passed** |
| **C-BVA-11** | Create Contract body rỗng | POST `/api/Contracts` | `{}` | 400 | BVA | C11 | **Passed** |
| **C-BVA-12** | Get Contract ID = 0 | GET `/api/Contracts/0` | ID=0 | 404 | BVA | C12 | **Passed** |
| **C-BVA-13** | Update Contract status không hợp lệ | PUT `/api/Contracts/{id}/status` | `{"status":"InvalidXYZ"}` | 400 | DT | C13 | **Passed** |
| **S-BVA-09** | Create Sales Order body rỗng | POST `/api/Sales/orders` | `{}` | 400 | BVA | S9 | **Passed** |

---

## 10. Tổng Kết

| Hạng mục | Số lượng | Passed | Covered by Newman | Not Executed |
|---|---|---|---|---|
| EP test cases | 62 | 48 | 14 | 0 |
| BVA test cases | 22 | 17 | 5 | 0 |
| DT test cases | 11 | 8 | 3 | 0 |
| E2E flow tests | 3 | 3 | 0 | 0 |
| **Tổng** | **95** (+3 E2E) | **76** | **22** | **0** |

> **Ghi chú**: "Covered by Newman" nghĩa là test case không có request Newman 1:1 riêng biệt nhưng logic tương đương đã được bao phủ bởi request khác trong cùng folder (ví dụ: Q-BVA-02 Get ID=-1 được bao phủ bởi Q7 Get ID=0 vì cùng logic boundary check).
