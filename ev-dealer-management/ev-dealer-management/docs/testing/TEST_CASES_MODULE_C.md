# Test Cases — Module C: Sales Management

> **Dự án**: EV Dealer Management System  
> **Jira**: ED-23 (87 cases) + ED-30 (8 cases) = **95 planned test cases**  
> **Ngày tạo**: 2026-07-03 | **Phiên bản**: 1.0

---

## Quy Ước

- **EP** = Equivalence Partitioning  
- **BVA** = Boundary Value Analysis  
- **DT** = Decision Table Testing  
- **Status**: `Not Executed` (chưa chạy live), `Planned` (đã có trong Postman)

---

## 1. Quotes (QuotesController — `:5003/api/Quotes`)

### 1.1 EP — Equivalence Partitioning

| TC ID | Test Case | Method | Input | Expected | Technique | Status |
|---|---|---|---|---|---|---|
| Q-EP-01 | Get all quotes | GET `/api/Quotes` | None | 200 + array | EP-Valid | Planned |
| Q-EP-02 | Create quote - valid | POST `/api/Quotes` | Valid body | 201 + quote object | EP-Valid | Planned |
| Q-EP-03 | Get quote by valid ID | GET `/api/Quotes/{id}` | Existing ID | 200 + quote | EP-Valid | Planned |
| Q-EP-04 | Get quote by invalid ID | GET `/api/Quotes/99999` | Non-existing ID | 404 | EP-Invalid | Planned |
| Q-EP-05 | Create quote - missing fields | POST `/api/Quotes` | Empty body `{}` | 400 | EP-Invalid | Planned |
| Q-EP-06 | Update quote status - valid | PUT `/api/Quotes/{id}/status` | `{"status":"Expired"}` | 200 | EP-Valid | Planned |
| Q-EP-07 | Update quote status - not found | PUT `/api/Quotes/99999/status` | Valid body | 404 | EP-Invalid | Planned |

### 1.2 BVA — Boundary Value Analysis

| TC ID | Test Case | Method | Input | Expected | Technique | Status |
|---|---|---|---|---|---|---|
| Q-BVA-01 | Get quote ID = 0 | GET `/api/Quotes/0` | ID=0 | 404 | BVA-Boundary | Planned |
| Q-BVA-02 | Get quote ID = -1 | GET `/api/Quotes/-1` | ID=-1 | 404 | BVA-Boundary | Planned |
| Q-BVA-03 | Create quote - Quantity = 0 | POST `/api/Quotes` | quantity=0 | 400 | BVA-Min | Planned |
| Q-BVA-04 | Create quote - Quantity = 1 | POST `/api/Quotes` | quantity=1 | 201 | BVA-Min+1 | Planned |
| Q-BVA-05 | Update status empty string | PUT `/api/Quotes/{id}/status` | `{"status":""}` | 400 | BVA-Empty | Planned |

### 1.3 DT — Decision Table

| TC ID | Conditions | Expected | Technique | Status |
|---|---|---|---|---|
| Q-DT-01 | Quote exists + Status="Active" → Update to "Expired" | 200 | DT | Planned |
| Q-DT-02 | Quote exists + Status="Expired" → Update to "Active" | 200 (hoặc 400 tùy logic) | DT | Planned |
| Q-DT-03 | Quote NOT exists → Update status | 404 | DT | Planned |

---

## 2. Orders (OrdersController — `:5003/api/Orders`)

### 2.1 EP

| TC ID | Test Case | Method | Input | Expected | Technique | Status |
|---|---|---|---|---|---|---|
| O-EP-01 | Get all orders | GET `/api/Orders` | None | 200 + array | EP-Valid | Planned |
| O-EP-02 | Create order - valid | POST `/api/Orders` | Valid body (active quote) | 201 | EP-Valid | Planned |
| O-EP-03 | Get order by valid ID | GET `/api/Orders/{id}` | Existing ID | 200 | EP-Valid | Planned |
| O-EP-04 | Get order by invalid ID | GET `/api/Orders/99999` | Non-existing | 404 | EP-Invalid | Planned |
| O-EP-05 | Create order - invalid quote | POST `/api/Orders` | Non-existing QuoteId | 400 | EP-Invalid | Planned |
| O-EP-06 | Update order status - valid | PUT `/api/Orders/{id}/status` | `{"status":"Confirmed"}` | 200 | EP-Valid | Planned |
| O-EP-07 | Update order status - not found | PUT `/api/Orders/99999/status` | Valid body | 404 | EP-Invalid | Planned |
| O-EP-08 | Complete order - valid | PUT `/api/Orders/{id}/complete` | Valid body | 200 | EP-Valid | Planned |
| O-EP-09 | Complete order - missing email | PUT `/api/Orders/{id}/complete` | No CustomerEmail | 400 | EP-Invalid | Planned |
| O-EP-10 | Complete order - missing name | PUT `/api/Orders/{id}/complete` | No CustomerName | 400 | EP-Invalid | Planned |
| O-EP-11 | Complete order - not found | PUT `/api/Orders/99999/complete` | Valid body | 404 | EP-Invalid | Planned |

### 2.2 BVA

| TC ID | Test Case | Method | Input | Expected | Technique | Status |
|---|---|---|---|---|---|---|
| **O-BVA-12** | **Get Order ID = 0** | GET `/api/Orders/0` | ID=0 | **404** | BVA | **ED-30** |
| **O-BVA-13** | **Update Order Status body rỗng** | PUT `/api/Orders/{id}/status` | `{}` | **400** | BVA | **ED-30** |
| O-BVA-14 | Get Order ID = -1 | GET `/api/Orders/-1` | ID=-1 | 404 | BVA | Planned |

### 2.3 DT

| TC ID | Conditions | Expected | Technique | Status |
|---|---|---|---|---|
| O-DT-01 | Order exists + Status="Pending" → Complete | 200 + status="Completed" | DT | Planned |
| O-DT-02 | Order exists + Status="Completed" → Complete again | 400 (already completed) | DT | Planned |
| O-DT-03 | Order NOT exists → Update status | 404 | DT | Planned |

---

## 3. Contracts (ContractsController — `:5003/api/Contracts`)

### 3.1 EP

| TC ID | Test Case | Method | Input | Expected | Technique | Status |
|---|---|---|---|---|---|---|
| C-EP-01 | Get all contracts | GET `/api/Contracts` | None | 200 + array | EP-Valid | Planned |
| C-EP-02 | Create contract - valid | POST `/api/Contracts` | Valid body | 201 | EP-Valid | Planned |
| C-EP-03 | Get contract by ID | GET `/api/Contracts/{id}` | Existing ID | 200 | EP-Valid | Planned |
| C-EP-04 | Get contract by invalid ID | GET `/api/Contracts/99999` | Non-existing | 404 | EP-Invalid | Planned |
| C-EP-05 | Create contract - order not found | POST `/api/Contracts` | Invalid OrderId | 404 | EP-Invalid | Planned |
| C-EP-06 | Create contract - duplicate | POST `/api/Contracts` | Same OrderId twice | 400 | EP-Invalid | Planned |
| C-EP-07 | Update contract status - Approved | PUT `/api/Contracts/{id}/status` | `{"status":"Approved"}` | 200 | EP-Valid | Planned |
| C-EP-08 | Update contract status - Rejected | PUT `/api/Contracts/{id}/status` | `{"status":"Rejected"}` | 200 + deletes order | EP-Valid | Planned |
| C-EP-09 | Update contract - not found | PUT `/api/Contracts/99999/status` | Valid body | 404 | EP-Invalid | Planned |
| C-EP-10 | Create contract - invalid SalespersonId format | POST `/api/Contracts` | SalespersonId="abc" | 400 | EP-Invalid | Planned |

### 3.2 BVA

| TC ID | Test Case | Method | Input | Expected | Technique | Status |
|---|---|---|---|---|---|---|
| **C-BVA-11** | **Create Contract body rỗng** | POST `/api/Contracts` | `{}` | **400** | BVA | **ED-30** |
| **C-BVA-12** | **Get Contract ID = 0** | GET `/api/Contracts/0` | ID=0 | **404** | BVA | **ED-30** |
| **C-BVA-13** | **Update Contract status không hợp lệ** | PUT `/api/Contracts/{id}/status` | `{"status":"InvalidXYZ"}` | **400** | BVA/DT | **ED-30** |

### 3.3 DT

| TC ID | Conditions | Expected | Technique | Status |
|---|---|---|---|---|
| C-DT-01 | Contract exists + Status→"Approved" | 200, order→"ReadyForDelivery" | DT | Planned |
| C-DT-02 | Contract exists + Status→"Rejected" | 200, contract+order deleted | DT | Planned |
| C-DT-03 | Contract NOT exists → Update | 404 | DT | Planned |

---

## 4. Payments (PaymentsController — `:5003/api/Payments`)

### 4.1 EP

| TC ID | Test Case | Method | Input | Expected | Technique | Status |
|---|---|---|---|---|---|---|
| P-EP-01 | Get all payments | GET `/api/Payments` | None | 200 + array | EP-Valid | Planned |
| P-EP-02 | Create payment - valid | POST `/api/Payments` | Valid body | 201 | EP-Valid | Planned |
| P-EP-03 | Create payment - partial data | POST `/api/Payments` | Missing OrderId | 400 | EP-Invalid | Planned |
| P-EP-04 | Create payment - valid large amount | POST `/api/Payments` | Amount=500000000 | 201 | EP-Valid | Planned |

### 4.2 BVA

| TC ID | Test Case | Method | Input | Expected | Technique | Status |
|---|---|---|---|---|---|---|
| **P-BVA-05** | **Payment Amount = -1** | POST `/api/Payments` | amount=-1 | **400** | BVA | **ED-30** |
| **P-BVA-06** | **Payment Amount = 9999999999999** | POST `/api/Payments` | amount=9999999999999 | **400** | BVA | **ED-30** |
| P-BVA-07 | Payment Amount = 0 | POST `/api/Payments` | amount=0 | 400 | BVA-Min | Planned |
| P-BVA-08 | Payment Amount = 1 | POST `/api/Payments` | amount=1 | 201 | BVA-Min+1 | Planned |

### 4.3 DT

| TC ID | Conditions | Expected | Technique | Status |
|---|---|---|---|---|
| P-DT-01 | Valid OrderId + Valid Amount + Valid Method | 201 | DT | Planned |
| P-DT-02 | Valid OrderId + Amount ≤ 0 | 400 | DT | Planned |

---

## 5. Deliveries & Promotions

### 5.1 Deliveries (`:5003/api/Deliveries`)

| TC ID | Test Case | Method | Input | Expected | Technique | Status |
|---|---|---|---|---|---|---|
| D-EP-01 | Get all deliveries | GET `/api/Deliveries` | None | 200 + array | EP-Valid | Planned |
| D-EP-02 | Create delivery - valid | POST `/api/Deliveries` | Valid body | 201 | EP-Valid | Planned |
| D-EP-03 | Create delivery - empty body | POST `/api/Deliveries` | `{}` | 400 | EP-Invalid | Planned |
| D-BVA-01 | Create delivery - missing OrderId | POST `/api/Deliveries` | No OrderId | 400 | BVA | Planned |

### 5.2 Promotions (`:5003/api/Promotions`)

| TC ID | Test Case | Method | Input | Expected | Technique | Status |
|---|---|---|---|---|---|---|
| PR-EP-01 | Get all promotions | GET `/api/Promotions` | None | 200 + array | EP-Valid | Planned |
| PR-EP-02 | Create promotion - valid | POST `/api/Promotions` | Valid body | 201 | EP-Valid | Planned |
| PR-EP-03 | Create promotion - empty body | POST `/api/Promotions` | `{}` | 400 | EP-Invalid | Planned |
| PR-BVA-01 | Create promotion - DiscountValue = -1 | POST `/api/Promotions` | discountValue=-1 | 400 | BVA | Planned |
| PR-BVA-02 | Create promotion - DiscountValue = 0 | POST `/api/Promotions` | discountValue=0 | 400 | BVA | Planned |

---

## 6. Sales Composite API (SalesController — `:5003/api/Sales/*`)

| TC ID | Test Case | Method | Input | Expected | Technique | Status |
|---|---|---|---|---|---|---|
| S-EP-01 | Create sales order - valid | POST `/api/Sales/orders` | Valid body (active quote) | 201 | EP-Valid | Planned |
| S-EP-02 | Create sales order - invalid quote | POST `/api/Sales/orders` | Non-active QuoteId | 400 | EP-Invalid | Planned |
| S-EP-03 | Get sales order by ID | GET `/api/Sales/orders/{id}` | Existing ID | 200 | EP-Valid | Planned |
| S-EP-04 | Get sales order - not found | GET `/api/Sales/orders/99999` | Non-existing | 404 | EP-Invalid | Planned |
| S-EP-05 | Create sales contract - valid | POST `/api/Sales/contracts` | Valid body | 201 | EP-Valid | Planned |
| S-EP-06 | Create sales contract - order not found | POST `/api/Sales/contracts` | Invalid OrderId | 400 | EP-Invalid | Planned |
| S-EP-07 | Get sales contract by ID | GET `/api/Sales/contracts/{id}` | Existing | 200 | EP-Valid | Planned |
| S-EP-08 | Get sales quote by ID | GET `/api/Sales/quotes/{id}` | Existing | 200 | EP-Valid | Planned |
| **S-BVA-09** | **Create Sales Order body rỗng** | POST `/api/Sales/orders` | `{}` | **400** | BVA | **ED-30** |
| S-BVA-10 | Get sales order ID = 0 | GET `/api/Sales/orders/0` | ID=0 | 404 | BVA | Planned |
| S-DT-01 | Valid Quote + Valid Data → Order created, Quote→"ConvertedToOrder" | 201 | DT | Planned |
| S-DT-02 | Invalid Quote (not Active) → Reject | 400 | DT | Planned |
| S-DT-03 | Valid Order → Contract created, Order→"ContractRequired" | 201 | DT | Planned |

---

## 7. Reporting API (ReportingService — `:5208/api/reports/*`)

| TC ID | Test Case | Method | Input | Expected | Technique | Status |
|---|---|---|---|---|---|---|
| R-EP-01 | Get summary | GET `/api/reports/summary` | None | 200 + metrics | EP-Valid | Planned |
| R-EP-02 | Get summary with date filter | GET `/api/reports/summary?from=2024-01-01&to=2025-12-31` | Date range | 200 | EP-Valid | Planned |
| R-EP-03 | Get sales by region | GET `/api/reports/sales-by-region` | None | 200 + array | EP-Valid | Planned |
| R-EP-04 | Get sales proportion | GET `/api/reports/sales-proportion` | None | 200 + array | EP-Valid | Planned |
| R-EP-05 | Get top vehicles | GET `/api/reports/top-vehicles` | None | 200 + array | EP-Valid | Planned |
| R-EP-06 | Get top vehicles with limit | GET `/api/reports/top-vehicles?limit=5` | limit=5 | 200 + max 5 items | EP-Valid | Planned |
| R-EP-07 | Export sales CSV | POST `/api/reports/export` | `{"type":"sales","format":"csv"}` | 200 + CSV file | EP-Valid | Planned |
| R-EP-08 | Export inventory CSV | POST `/api/reports/export` | `{"type":"inventory"}` | 200 + CSV file | EP-Valid | Planned |
| R-EP-09 | Get demand forecast | GET `/api/reports/demand-forecast` | None | 200 + forecast | EP-Valid | Planned |
| R-EP-10 | Synchronize data | POST `/api/reports/synchronize-data` | None | 200 | EP-Valid | Planned |
| R-EP-11 | Get debt summary | GET `/api/reports/debt-summary` | None | 200 | EP-Valid | Planned |
| R-EP-12 | Get sales summary | GET `/api/reports/sales-summary` | None | 200 | EP-Valid | Planned |
| R-EP-13 | Create sales summary - valid | POST `/api/reports/sales-summary` | Valid body | 201 | EP-Valid | Planned |
| R-EP-14 | Create sales summary - missing fields | POST `/api/reports/sales-summary` | Missing DealerName | 400 | EP-Invalid | Planned |
| R-EP-15 | Get inventory summary | GET `/api/reports/inventory-summary` | None | 200 | EP-Valid | Planned |
| R-EP-16 | Create inventory summary - valid | POST `/api/reports/inventory-summary` | Valid body | 201 | EP-Valid | Planned |
| R-EP-17 | Create inventory summary - missing fields | POST `/api/reports/inventory-summary` | Missing VehicleName | 400 | EP-Invalid | Planned |
| R-BVA-01 | Get sales summary by invalid GUID | GET `/api/reports/sales-summary/invalid-guid` | invalid | 400/404 | BVA | Planned |
| R-BVA-02 | Top vehicles limit = 0 | GET `/api/reports/top-vehicles?limit=0` | limit=0 | 200 (default 10) | BVA | Planned |
| R-BVA-03 | Top vehicles limit = -1 | GET `/api/reports/top-vehicles?limit=-1` | limit=-1 | 200 (default 10) | BVA | Planned |

---

## 8. Notification & E2E Flow (NotificationService — `:5051`)

| TC ID | Test Case | Method | Input | Expected | Technique | Status |
|---|---|---|---|---|---|---|
| N-EP-01 | Test FCM - valid | POST `/api/Notification/test-fcm` | Valid token+title+body | 200/400 (depends on FCM config) | EP-Valid | Planned |
| N-EP-02 | Test FCM - missing token | POST `/api/Notification/test-fcm` | No DeviceToken | 400 | EP-Invalid | Planned |
| N-EP-03 | Subscribe topic - valid | POST `/api/Notification/subscribe-topic` | Valid token+topic | 200/400 | EP-Valid | Planned |
| N-EP-04 | Unsubscribe topic | POST `/api/Notification/unsubscribe-topic` | Valid token+topic | 200/400 | EP-Valid | Planned |
| N-EP-05 | Send to topic | POST `/api/Notification/send-to-topic` | Valid topic+title+body | 200/400 | EP-Valid | Planned |
| N-EP-06 | Send multicast | POST `/api/Notification/send-multicast` | Valid tokens+title+body | 200/400 | EP-Valid | Planned |
| N-EP-07 | Test FCM - empty body | POST `/api/Notification/test-fcm` | `{}` | 400 | EP-Invalid | Planned |
| N-BVA-01 | Send multicast - empty token list | POST `/api/Notification/send-multicast` | `{"deviceTokens":[]}` | 400 | BVA | Planned |

### 8.1 E2E Flow Tests

| TC ID | Test Case | Flow | Expected | Status |
|---|---|---|---|---|
| E2E-01 | Full Sales Flow | Create Quote → Create Order → Create Contract → Approve → Payment → Delivery | All steps 200/201 | Planned |
| E2E-02 | Contract Rejection Flow | Create Quote → Create Order → Create Contract → Reject | Contract+Order deleted | Planned |
| E2E-03 | Report After Sales | Create sales data → Get summary → Export CSV | Report reflects new data | Planned |

---

## 9. ED-30 Specific Test Cases (BVA/DT Extension)

> Các test case dưới đây được thêm từ commit `54ac56c` cho ED-30:

| TC ID | Test Case | Endpoint | Input | Expected | Technique |
|---|---|---|---|---|---|
| **P-BVA-05** | Payment Amount = -1 | POST `/api/Payments` | amount=-1 | 400 | BVA |
| **P-BVA-06** | Payment Amount = 9999999999999 | POST `/api/Payments` | amount=9999999999999 | 400 | BVA |
| **O-BVA-12** | Get Order ID = 0 | GET `/api/Orders/0` | ID=0 | 404 | BVA |
| **O-BVA-13** | Update Order Status body rỗng | PUT `/api/Orders/{id}/status` | `{}` | 400 | BVA |
| **C-BVA-11** | Create Contract body rỗng | POST `/api/Contracts` | `{}` | 400 | BVA |
| **C-BVA-12** | Get Contract ID = 0 | GET `/api/Contracts/0` | ID=0 | 404 | BVA |
| **C-BVA-13** | Update Contract status không hợp lệ | PUT `/api/Contracts/{id}/status` | `{"status":"InvalidXYZ"}` | 400 | DT |
| **S-BVA-09** | Create Sales Order body rỗng | POST `/api/Sales/orders` | `{}` | 400 | BVA |

---

## 10. Tổng Kết

| Hạng mục | Số lượng |
|---|---|
| Tổng test cases documented | 95 |
| EP test cases | 62 |
| BVA test cases | 22 |
| DT test cases | 11 |
| ED-30 specific | 8 |
| E2E flow tests | 3 |
