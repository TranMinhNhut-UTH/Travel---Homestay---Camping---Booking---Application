# Kế hoạch mở rộng code coverage white-box

## 1. Mục tiêu

Duy trì 37 unit test hiện có và tăng coverage theo rủi ro nghiệp vụ. Không đặt mục tiêu 100% hình thức; ưu tiên decision branch, validation và failure case có ảnh hưởng cao.

## 2. Baseline đo được

| Metric | Baseline |
|---|---:|
| Unit test | 37 total / 37 passed / 0 failed / 0 skipped |
| Line coverage | 14,13% (861/6091) |
| Branch coverage | 6,74% (73/1082) |

Nguồn: Cobertura gần nhất trong `SalesService.Tests/TestResults/23088ff0-9c0a-41b0-b988-43017d0efd84/coverage.cobertura.xml`.

## 3. Thành phần đã có test

- User login/register failure.
- Orders, contracts, quotes và payment logic.
- Demand forecast của ReportingService.
- Fake FCM logic của NotificationService.

## 4. Khoảng trống ưu tiên

| Ưu tiên | Khu vực | Test đề xuất |
|---|---|---|
| Cao | CustomerService | Customer not found, duplicate email, test-drive FK/date, complaint customer validation. |
| Cao | VehicleService | Dealer/vehicle not found, stock boundary, reserve failure, validation DTO. |
| Cao | SalesService | Payment/Delivery OrderId, duplicate contract, invalid status và database exception. |
| Trung bình | ReportingService | Sync failure, invalid dates/limits, summary create/detail. |
| Trung bình | NotificationService | Topic/multicast payload combinations và dependency failure. |
| Trung bình | UserService | Authorization/role/approve/reset-password branches. |

## 5. Quy trình đo

```powershell
dotnet test DealerSystem.sln --collect:"XPlat Code Coverage"
```

Mỗi lần mở rộng test cần ghi total/pass/fail/skipped, line/branch coverage, file Cobertura và thay đổi so với baseline. Không so sánh coverage giữa các tập assembly khác nhau nếu chưa ghi rõ phạm vi instrument.

## 6. Tiêu chí chấp nhận

- Toàn bộ test cũ và mới pass.
- Không xóa/vô hiệu hóa test để tăng tỷ lệ giả tạo.
- Mỗi business rule quan trọng có happy case và ít nhất một failure case.
- Coverage không giảm nếu phạm vi instrument không đổi; nếu giảm phải giải thích bằng code mới hoặc thay đổi cấu hình.
- Mock chỉ cô lập dependency, không mô phỏng lại toàn bộ logic cần kiểm tra.

## 7. Hạn chế và kết luận

Line 14,13% và branch 6,74% cho thấy suite hiện còn mỏng so với toàn solution. Kế hoạch cần triển khai theo module ED-21, ED-22, ED-23 và ưu tiên nhánh từng gây lỗi black-box, thay vì tuyên bố các hàm mục tiêu đã đạt 100% khi báo cáo tổng thể không hỗ trợ kết luận đó.
