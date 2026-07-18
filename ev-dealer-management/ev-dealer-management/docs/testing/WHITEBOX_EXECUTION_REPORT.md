# Báo cáo thực thi kiểm thử white-box

## 1. Mục tiêu và phạm vi

Báo cáo kết quả unit test hiện tại của solution EV Dealer Management. Phạm vi tập trung business logic/service-layer và các controller method được gọi trực tiếp, không khởi tạo HTTP server và không phải integration test.

## 2. Công cụ và môi trường

- .NET 8, xUnit 2.5.3.
- Moq 4.20.72.
- EF Core InMemory cho dữ liệu cô lập.
- Coverlet collector `XPlat Code Coverage`.
- Solution: `DealerSystem.sln`.

## 3. Quy trình thực thi

```powershell
dotnet test DealerSystem.sln
dotnet test DealerSystem.sln --collect:"XPlat Code Coverage"
```

Coverage XML nằm tại `SalesService.Tests/TestResults/<run-id>/coverage.cobertura.xml`.

## 4. Kết quả test

| Chỉ số | Giá trị |
|---|---:|
| Total | 37 |
| Passed | 37 |
| Failed | 0 |
| Skipped | 0 |

| Test class | Số test | Đối tượng chính |
|---|---:|---|
| `UserServiceTests` | 4 | Login và register failure |
| `OrderBusinessLogicTests` | 3 | Discount, quote state, order number |
| `PaymentBusinessLogicTests` | 3 | Create, validation, DTO mapping |
| `ReportingServiceTests` | 4 | Demand forecast và date range |
| `NotificationServiceTests` | 4 | Fake FCM happy/failure cases |
| `OrdersControllerTests` | 7 | Order validation/status |
| `ContractsControllerTests` | 9 | Contract create/status branches |
| `QuotesControllerTests` | 3 | Quote create validation/error |
| **Tổng** | **37** |  |

## 5. Coverage thực tế

Cobertura gần nhất (`23088ff0-9c0a-41b0-b988-43017d0efd84`) ghi:

| Metric | Kết quả | Diễn giải |
|---|---:|---|
| Line coverage | 14,13% (861/6091) | Thấp; nhiều service/nhánh production chưa được unit test. |
| Branch coverage | 6,74% (73/1082) | Thấp; failure/business branches cần mở rộng. |

Không có dữ liệu để khẳng định statement coverage hoặc cyclomatic complexity. Kết quả 37/37 PASS chỉ chứng minh các test đã viết đang pass, không chứng minh toàn bộ hệ thống đúng hoặc đạt coverage cao.

## 6. Mock/dependency strategy

- Moq: `IEmailService`, `IConfiguration`, `ILogger<T>`.
- EF Core InMemory: `UserDbContext`, `SalesDbContext`, `ReportingDbContext`.
- `FakeFcmService`: kiểm tra logic notification không phụ thuộc FCM thật.
- Không gọi HTTP controller qua network trong unit test.

## 7. Defect/issue và hạn chế

- Nullable/package vulnerability warnings có thể xuất hiện nhưng không làm test fail; cần xử lý riêng theo backlog.
- Coverage thấp do solution có nhiều controller/minimal API/service chưa được cô lập kiểm thử.
- Báo cáo Module C cũ 20/20 là snapshot lịch sử, không còn là baseline toàn solution.

## 8. Kết luận

Baseline white-box hiện tại là 37/37 PASS. Ưu tiên tiếp theo là thêm failure/authorization/business-rule tests cho CustomerService, VehicleService, các nhánh Sales/Reporting còn thiếu và theo dõi coverage theo từng lần chạy CI.
