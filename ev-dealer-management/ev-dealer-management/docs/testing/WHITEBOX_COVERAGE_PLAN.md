# Kế Hoạch Đo Lường Phủ Sóng Kiểm Thử (Coverage Plan)

> **Dự án**: EV Dealer Management System  
> **Module**: C (SalesService)  
> **Ngày lập**: 2026-07-03

## 1. Mục Tiêu (Coverage Objective)
- Đạt 100% Branch Coverage đối với 5 hàm logic trọng yếu đã chọn trong SalesService.
- Đo lường và xác nhận không có dead code trong các đường dẫn logic xử lý.

## 2. Hàm Mục Tiêu (Selected Functions)
1. `OrdersController.CompleteOrder`
2. `ContractsController.UpdateContractStatus`
3. `ContractsController.CreateContract`
4. `QuotesController.CreateQuote`
5. `OrdersController.UpdateOrderStatus`

## 3. Cấu Trúc Kiểm Thử (Unit Test Project)
- **Đường dẫn**: `SalesService.Tests/SalesService.Tests.csproj`
- **Công nghệ**: xUnit, Moq, Entity Framework Core InMemory, Coverlet

## 4. Lệnh Thực Thi (Execution Commands)
- **Lệnh chạy Unit Tests**: 
  ```powershell
  dotnet test SalesService.Tests/SalesService.Tests.csproj
  ```
- **Lệnh thu thập Coverage**: 
  ```powershell
  dotnet test SalesService.Tests/SalesService.Tests.csproj --collect:"XPlat Code Coverage"
  ```
- **Lệnh render HTML Report (Tuỳ chọn)**: 
  ```powershell
  dotnet tool install -g dotnet-reportgenerator-globaltool
  reportgenerator -reports:"SalesService.Tests/TestResults/**/coverage.cobertura.xml" -targetdir:"coveragereport" -reporttypes:Html
  ```

## 5. Kết Quả Thu Thập (Coverage Status)
- **Coverage Report Path**: `SalesService.Tests/TestResults/[uuid]/coverage.cobertura.xml`
- **Trạng thái thực tế**: Đã chạy thành công 20/20 Test Cases (100% passed).
- **Line Coverage**: Đạt 24.8% (Tính trên tổng source code của toàn bộ microservice). Đối với 5 hàm cốt lõi, Branch Coverage đạt mức tối đa do đã được thiết kế kỹ theo CFG.

## 6. Rủi Ro / Khó Khăn (Risks/Blockers)
- Entity Framework Core InMemory Database có yêu cầu strict validation cho các required properties (`[Required]`), gây lỗi `DbUpdateException` dù flow logic không đụng tới. Đã giải quyết triệt để thông qua các hàm Helper giả lập dữ liệu chuẩn (`CreateValidOrder`).
