# Quy trình kiểm thử EV Dealer Management

## 1. Mục tiêu

Tài liệu này hướng dẫn cách chạy và đọc kết quả kiểm thử black-box bằng Postman/Newman, kiểm thử white-box bằng xUnit, thu thập code coverage và xử lý defect. Kết quả chỉ được ghi `PASS` khi có log thực thi tương ứng; thiết kế test case trong Markdown hoặc Excel không tự chứng minh việc thực thi thành công.

## 2. Phạm vi

- ED-21 – Module A: Authentication, Users, Customers, Test Drives, Complaints.
- ED-22 – Module B: Vehicles, Dealers.
- ED-23 – Module C: Sales, Orders, Payments, Deliveries, Reporting, Notifications.
- Ngoài phạm vi: kiểm thử giao diện frontend, tải lớn, bảo mật chuyên sâu và endpoint đang bị comment.

## 3. Công cụ và nguồn kiểm thử

| Mục đích | Công cụ/nguồn |
|---|---|
| Chạy API thủ công | Postman Collection Runner |
| Chạy black-box tự động | Newman, collection `ev-dealer-management.postman_collection.json` |
| Biến môi trường | `postman/ev-dealer-management.postman_environment.json` |
| Chạy white-box | .NET 8, xUnit, Moq, EF Core InMemory |
| Thu thập coverage | Coverlet `XPlat Code Coverage` |
| Tự động hóa | `.github/workflows/ci-jira.yml` |
| Quản lý công việc/defect | Jira, mã ED-21/ED-22/ED-23 và issue liên quan |

## 4. Môi trường kiểm thử local

Yêu cầu cài .NET 8 SDK, Node.js và Newman. Trước khi chạy, đóng các process cũ đang khóa SQLite và kiểm tra các cổng:

| Service | URL mặc định |
|---|---|
| API Gateway | `http://localhost:5036` |
| UserService | `http://localhost:7001` |
| SalesService | `http://localhost:5003` |
| VehicleService | `http://localhost:5068` |
| CustomerService | `http://localhost:5039` |
| ReportingService | `http://localhost:5208` |
| NotificationService | `http://localhost:5051` |

Từ thư mục `ev-dealer-management/ev-dealer-management`, chạy:

```powershell
.\start-all-services.ps1
```

Nếu script launcher lỗi, chạy từng project bằng `dotnet run` và đặt đúng `ASPNETCORE_URLS`. Chỉ chạy test sau khi endpoint health hoặc Swagger của service liên quan phản hồi. Các route chưa được gateway proxy phải dùng URL service gốc.

## 5. Test data và biến động

1. Import environment `postman/ev-dealer-management.postman_environment.json`.
2. Kiểm tra `baseUrl`, các biến `*ServiceUrl`, `loginUsername`, `loginPassword` và `authToken`.
3. Chạy Login trước; token được lưu bởi request-level script.
4. Với luồng CRUD, tạo dữ liệu trước rồi dùng ID trả về. Không giả định ID `1` còn tồn tại sau các lần xóa database hoặc chạy regression.
5. Thứ tự đề xuất: User/Dealer/Vehicle → Customer → Test Drive/Complaint → Quote → Order → Contract → Payment/Delivery → Reports/Notifications.
6. `futureAppointmentDate` phải được sinh tại thời điểm chạy; không dùng ngày cố định đã nằm trong quá khứ.

Các biến `delete*`, `managedUserId` hoặc ID phụ thuộc phải được xác nhận có giá trị trước request. Nếu biến chưa được khởi tạo, ghi `BLOCKED` hoặc lỗi test data, không kết luận endpoint backend sai.

## 6. Chạy bằng Postman Collection Runner

1. Import collection và environment chuẩn.
2. Chọn environment EV Dealer Management.
3. Mở Collection Runner, giữ nguyên thứ tự request.
4. Tắt request phá dữ liệu nếu chỉ chạy smoke test; nếu chạy regression đầy đủ phải chuẩn bị dữ liệu riêng cho các request DELETE.
5. Chạy collection và lưu export/screenshot của request fail, gồm URL đã resolve, status, response body và assertion.

Collection có collection-level script dùng chung để kiểm tra status, từ chối HTTP 500, thời gian phản hồi, Content-Type và JSON. Không sao chép script chung vào từng request. Request-level script chỉ dùng khi cần lưu token hoặc ID.

## 7. Chạy Newman local

Từ root repository:

```powershell
newman run .\ev-dealer-management.postman_collection.json `
  -e .\postman\ev-dealer-management.postman_environment.json `
  --reporters cli,junit,htmlextra `
  --reporter-junit-export .\test-results\newman-results.xml `
  --reporter-htmlextra-export .\test-results\newman-report.html
```

Nếu chưa có HTML reporter:

```powershell
npm install -g newman newman-reporter-htmlextra
```

Đọc kết quả theo thứ tự: request error → status thực tế → response body → assertion fail → biến đã resolve. `ECONNREFUSED` là lỗi môi trường/service chưa chạy; 400 thường là binding/validation/test data; 401/403 là authentication/authorization; 404 là route hoặc dữ liệu; 405 là method/proxy; 500 là backend exception cần log service.

## 8. Chạy unit test và coverage

Từ `ev-dealer-management/ev-dealer-management`:

```powershell
dotnet test DealerSystem.sln
```

Kết quả đã xác nhận gần nhất: 37 total, 37 passed, 0 failed, 0 skipped.

Thu thập coverage:

```powershell
dotnet test DealerSystem.sln --collect:"XPlat Code Coverage"
```

File được tạo tại `SalesService.Tests/TestResults/<run-id>/coverage.cobertura.xml`. Báo cáo gần nhất ghi line coverage `14,13%` và branch coverage `6,74%`. Tỷ lệ này thấp, chỉ phản ánh phạm vi assembly được instrument; không được diễn giải thành toàn hệ thống đã được kiểm thử đầy đủ.

## 9. Tiêu chí đánh giá

| Trạng thái | Quy tắc |
|---|---|
| PASS | Có execution evidence; status, response, assertion và thời gian phản hồi đúng kỳ vọng. |
| FAIL | Request chạy được nhưng sai contract, assertion fail hoặc backend trả lỗi ngoài kỳ vọng. |
| BLOCKED | Không thể chạy do service, credential, dữ liệu phụ thuộc hoặc môi trường. |
| NOT RUN | Test case mới ở mức thiết kế hoặc chưa có evidence tương ứng. |

Không đổi expected status để hợp thức hóa lỗi. Với request fail, phải đọc response body và log backend trước khi phân loại.

## 10. Quy trình xử lý defect

`Test fail → thu thập evidence → phân tích nguyên nhân → tạo/link Jira Bug → sửa đúng lớp → chạy targeted test → chạy regression → push → GitHub Actions → reviewer xác nhận`

Defect cần có test case liên quan, endpoint, dữ liệu đầu vào, expected/actual, HTTP status, response/log rút gọn, branch/commit và link CI. Phân loại rõ lỗi test data, collection, gateway, xác thực, business rule hoặc backend exception. Sau khi sửa phải chạy lại test bị lỗi, toàn bộ Newman phù hợp và `dotnet test DealerSystem.sln`.

## 11. Kết quả và kết luận hiện tại

- White-box: 37/37 test pass.
- CI: đã pass cho thay đổi ED-47; git history xác nhận PR #35 đã merge.
- Black-box: collection có 116 request và đã phát hiện các lỗi runtime/data-dependent; không có căn cứ trong tài liệu để khẳng định toàn bộ endpoint hiện đều pass.
- Coverage: 14,13% line và 6,74% branch; cần tiếp tục mở rộng test business logic theo rủi ro.

Evidence cần lưu gồm Newman CLI log, JUnit XML, HTML report, coverage XML và GitHub Actions run. Jira là nơi theo dõi defect, không thay thế log kiểm thử.
