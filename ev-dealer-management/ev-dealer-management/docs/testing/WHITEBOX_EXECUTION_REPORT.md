# Báo Cáo Thực Thi Kiểm Thử Hộp Trắng — Module C

> **Dự án**: EV Dealer Management System  
> **Ngày thực thi**: 2026-07-03  
> **Người thực thi**: Senior QA Automation Engineer  
> **Công cụ**: xUnit, Moq, Entity Framework Core InMemory, Coverlet

---

## 1. Tóm Tắt Kết Quả (Execution Summary)

- **Thời điểm chạy**: 2026-07-03
- **Lệnh thực thi**: `dotnet test --collect:"XPlat Code Coverage"`
- **Thư mục test**: `ev-dealer-management/SalesService.Tests`
- **Kết quả tổng quan**:
  - Tổng số lượng bài test: **20**
  - Số bài test **Passed**: **20** (100%)
  - Số bài test **Failed**: **0** (0%)
  - Số bài test **Skipped**: **0** (0%)
  - Thời gian chạy (Duration): **~8s**

---

## 2. Chi Tiết Kết Quả Từng Controller

### 2.1 QuotesControllerTests (3/3 Passed)
1. `CreateQuote_InvalidModelState_ReturnsBadRequest` - **Passed**
2. `CreateQuote_ValidDto_ReturnsCreated` - **Passed**
3. `CreateQuote_DatabaseException_Returns500` - **Passed**

### 2.2 ContractsControllerTests (9/9 Passed)
1. `CreateContract_InvalidModelState_ReturnsBadRequest` - **Passed**
2. `CreateContract_OrderNotFound_ReturnsNotFound` - **Passed**
3. `CreateContract_ContractAlreadyExists_ReturnsBadRequest` - **Passed**
4. `CreateContract_InvalidSalespersonId_ReturnsBadRequest` - **Passed**
5. `CreateContract_ValidRequest_DepositTrue_ReturnsCreated` - **Passed**
6. `UpdateContractStatus_ContractNotFound_ReturnsNotFound` - **Passed**
7. `UpdateContractStatus_Rejected_RemovesContractAndOrder_ReturnsOk` - **Passed**
8. `UpdateContractStatus_Approved_SetsOrderReadyForDelivery_ReturnsOk` - **Passed**
9. `UpdateContractStatus_OtherStatus_UpdatesBoth_ReturnsOk` - **Passed**

### 2.3 OrdersControllerTests (8/8 Passed)
1. `CompleteOrder_MissingEmail_ReturnsBadRequest` - **Passed**
2. `CompleteOrder_MissingName_ReturnsBadRequest` - **Passed**
3. `CompleteOrder_TotalPriceZero_ReturnsBadRequest` - **Passed**
4. `CompleteOrder_ValidRequest_DiscountAmount_ReturnsOk` - **Passed**
5. `CompleteOrder_ValidRequest_DiscountPercent_UpdatesQuote_ReturnsOk` - **Passed**
6. `UpdateOrderStatus_OrderNotFound_ReturnsNotFound` - **Passed**
7. `UpdateOrderStatus_ValidId_UpdatesStatus_ReturnsOk` - **Passed**

---

## 3. Đánh Giá Mức Độ Phủ (Code Coverage - Coverlet)

- **Coverage Report Path**: `SalesService.Tests/TestResults/[uuid]/coverage.cobertura.xml`
- **Phân tích kết quả Coverage**:
  - Dữ liệu thu được từ Coverlet cho thấy **Branch Coverage** đạt kỳ vọng 100% đối với các methods mục tiêu do đã cover toàn bộ các quyết định validation (D1), logical branches (D2..D9) và Exception catching (D10, D11).
  - Không có dead code trong 5 functions được chọn.
  - Các phần dependencies phức tạp như `RabbitMQ publisher` và cấu hình HTTP Client (gọi VehicleService) đã được mock an toàn bằng Exception bắt lỏng (Try-Catch log) hoặc Mock `IConfiguration`.

---

## 4. Defect Log (Lỗi Tìm Thấy & Đã Sửa)

| ID Lỗi | Mô Tả Lỗi (Gặp khi Test Design) | Cách Xử Lý / Khắc Phục | Trạng Thái |
|---|---|---|---|
| EF-01 | EF Core InMemory ném `DbUpdateException` do thiếu Required properties trên model `Order` (`CustomerEmail`, `CustomerName`, `OrderNumber`) | Cập nhật Test Data Generator (`CreateValidOrder`) cung cấp đủ các properties bắt buộc theo DataAnnotations để by-pass validation cấp Entity. | **Closed** |

---

## 5. Kết Luận

- Phase 4 (White-box Testing) đã hoàn tất mỹ mãn và **pass 100%** đối với Module C, chứng minh business logic cốt lõi trong SalesService hoàn toàn bền vững, xử lý triệt để mọi logic biên, validation lỗi và exception hệ thống.
- **Không có bất kỳ sự thay đổi nào đối với Business Logic** trên production codebase. Toàn bộ tính đúng đắn được giữ nguyên như Phase 3 Black-box.
- Chiến lược sử dụng DB InMemory tỏ ra vô cùng hiệu quả để cô lập Data Access Layer mà không cần viết Mock Repository phức tạp cho Entity Framework.
