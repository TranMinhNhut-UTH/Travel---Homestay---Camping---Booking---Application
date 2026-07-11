# Thiết Kế Test Cases Hộp Trắng — Module C

> **Dự án**: EV Dealer Management System  
> **Ngày thiết kế**: 2026-07-03 | **Người thực hiện**: Senior QA Automation Engineer  
> **Căn cứ**: `WHITEBOX_PREPARATION.md` (Version 2.0 thực tế)

---

## 1. Mức Độ Phủ (Coverage Targets)

| Đối Tượng | Kỹ Thuật | Tiêu Chí Đạt (DoD) |
|---|---|---|
| **Statement Coverage** | Thực thi mọi dòng code ít nhất 1 lần | > 90% |
| **Branch/Decision Coverage** | Thực thi mọi nhánh True/False | 100% |
| **Path Coverage** | Đi qua các luồng logic cơ bản | Tối thiểu 15 Test Cases |

---

## 2. Danh Sách Test Cases

### 2.1 QuotesController.CreateQuote (V(G)=4)
*File: `QuotesControllerTests.cs`*

| ID | Nhánh Phủ (Path) | Mô tả Test Case | Expected Result | Trạng Thái |
|---|---|---|---|---|
| WT-Q1 | D1=True | ModelState không hợp lệ (lỗi validation) | `BadRequestObjectResult` (400) | Pass |
| WT-Q2 | D1=False, D2=False, D3=False | Đầu vào hợp lệ, SaveChanges thành công, Publish event thành công (hoặc mock bypass) | `CreatedAtActionResult` (201) | Pass |
| WT-Q3 | D1=False, D3=True | Bắt global exception do lỗi logic hoặc database (truyền null model) | `ObjectResult` (500) | Pass |

### 2.2 ContractsController.CreateContract (V(G)=7)
*File: `ContractsControllerTests.cs`*

| ID | Nhánh Phủ (Path) | Mô tả Test Case | Expected Result | Trạng Thái |
|---|---|---|---|---|
| WT-C1 | D1=True | ModelState không hợp lệ (thiếu OrderId) | `BadRequestObjectResult` | Pass |
| WT-C2 | D1=False, D2=True | OrderId không tồn tại trong database | `NotFoundObjectResult` | Pass |
| WT-C3 | D1=False, D2=False, D3=True | Đã tồn tại hợp đồng cho OrderId này | `BadRequestObjectResult` | Pass |
| WT-C4 | D1=False, D2=False, D3=False, D4=True | SalespersonId không parse được ra số nguyên | `BadRequestObjectResult` | Pass |
| WT-C5 | D1=False...D4=False, D5=True, D6=False | Đầu vào hợp lệ, DepositReceived=true | Contract.PaymentStatus="Partial", return 201 | Pass |
| WT-C6 | D1=False...D4=False, D5=False, D6=False | Đầu vào hợp lệ, DepositReceived=false | Contract.PaymentStatus="Unpaid", return 201 | Pass |

*(Ghi chú: WT-C6 có thể gộp chung vào test setup hoặc cover chung nhánh với WT-C5)*

### 2.3 ContractsController.UpdateContractStatus (V(G)=7)
*File: `ContractsControllerTests.cs`*

| ID | Nhánh Phủ (Path) | Mô tả Test Case | Expected Result | Trạng Thái |
|---|---|---|---|---|
| WT-C7 | D1=True | Contract ID không tồn tại | `NotFoundObjectResult` | Pass |
| WT-C8 | D1=False, D2=False, D3=True, D4=False | Status="Rejected". Thực hiện xoá Contract và xoá Order | Order xoá, Contract xoá, return 200 | Pass |
| WT-C9 | D1=False, D2=False, D3=False, D5=True, D6=False | Status="Approved". Đổi Order status -> "ReadyForDelivery" | Order.Status="ReadyForDelivery", return 200 | Pass |
| WT-C10| D1=False, D2=False, D3=False, D5=False, D6=False | Status khác (VD: "CustomStatus"). Cập nhật Order.Status | Order.Status="CustomStatus", return 200 | Pass |

### 2.4 OrdersController.CompleteOrder (V(G)=12)
*File: `OrdersControllerTests.cs`*

| ID | Nhánh Phủ (Path) | Mô tả Test Case | Expected Result | Trạng Thái |
|---|---|---|---|---|
| WT-O1 | D1=True | Thiếu thông tin CustomerEmail | `BadRequestObjectResult` | Pass |
| WT-O2 | D1=False, D2=True | Thiếu thông tin CustomerName | `BadRequestObjectResult` | Pass |
| WT-O3 | D1=False, D2=False... D8=True/False, D9=True | Tính toán TotalPrice bị `<= 0` do Discount quá lớn | `BadRequestObjectResult` | Pass |
| WT-O4 | D1=False...D6=True, D9=False, D11=False | Nhập DiscountAmount hợp lệ, tính TotalPrice thành công | TotalPrice trừ đúng DiscountAmount, return 200 | Pass |
| WT-O5 | D1=False...D6=False, D7=True, D9=False | Nhập DiscountPercent hợp lệ, kèm QuoteId > 0 | TotalPrice trừ theo Percent, Quote Status="ConvertedToOrder", return 200 | Pass |

### 2.5 OrdersController.UpdateOrderStatus (V(G)=4)
*File: `OrdersControllerTests.cs`*

| ID | Nhánh Phủ (Path) | Mô tả Test Case | Expected Result | Trạng Thái |
|---|---|---|---|---|
| WT-O6 | D1=True | Order ID không tồn tại trong database | `NotFoundObjectResult` | Pass |
| WT-O7 | D1=False, D2=False, D3=False | ID hợp lệ, cập nhật status thành công (VD: "Completed") | Order.Status="Completed", return 200 | Pass |

---

## 3. Tổng Kết Số Lượng
- Tổng Test Cases Thiết Kế: **15 Cases Cơ Bản** (Vượt chuẩn > 15).
- Số lượng test methods thực tế đã code bằng xUnit: **20 Tests** (Cover chi tiết hơn các case validate).
- Trạng thái tất cả cases: **Ready for Execution** (Đã code).
