# BLACK BOX EXECUTION REPORT

| Thuộc tính | Giá trị |
|---|---|
| Project | EV Dealer Management |
| Loại báo cáo | Black-box Execution Report |
| Phạm vi Jira | ED-21, ED-22, ED-23 và API Gateway |
| Collection hiện hành | `ev-dealer-management.postman_collection.json` |
| Số request trong collection hiện hành | 116 |

## 1. PURPOSE

Báo cáo này tổng hợp việc thực thi kiểm thử black-box đã có evidence trong repository, các kết quả quan sát được và những giới hạn của evidence hiện tại.

Tài liệu này khác với Test Case Specification:

- Specification mô tả test case, dữ liệu, bước thực hiện và kết quả mong đợi.
- Execution Report chỉ ghi nhận kết quả thực thi khi có bằng chứng từ Postman Runner, Newman, JUnit XML, log hoặc GitHub Actions.
- Việc một request tồn tại trong collection không chứng minh request đó đã PASS.

## 2. TEST ENVIRONMENT

| Thành phần | Môi trường/công cụ |
|---|---|
| Backend | .NET 8 REST APIs |
| API access | API Gateway và URL trực tiếp của từng service |
| Thiết kế/chạy thủ công | Postman |
| Chạy tự động | Newman |
| Continuous Integration | GitHub Actions |
| Local operating system | Windows |
| Collection | `ev-dealer-management.postman_collection.json` |
| Environment | `postman/ev-dealer-management.postman_environment.json` |

Các API phụ thuộc vào trạng thái service, database, dữ liệu seed, token xác thực và các dịch vụ ngoài như RabbitMQ hoặc Firebase. Vì vậy, cùng một request có thể cho kết quả khác nhau giữa local và CI nếu các dependency không tương đương.

## 3. TEST SCOPE

| Module | Phạm vi nghiệp vụ |
|---|---|
| ED-21 | Authentication, Users, Customers, Test Drives, Complaints |
| ED-22 | Vehicles, Dealers |
| ED-23 | Sales, Orders, Contracts, Payments, Deliveries, Reporting, Notifications |
| Cross-module | API Gateway, routing và dependency giữa các service |

Collection hiện hành có 116 request. Con số này là số request được định nghĩa, không phải số request PASS. Theo endpoint coverage audit, collection có request cho 82/97 active origin method/route; 15 active route chưa có request. Năm route `ProcessedReservations` nằm trong controller bị comment toàn bộ nên được xem là inactive, không tính là endpoint runtime.

## 4. EXECUTION PROCESS

```text
Developer
    ↓
Postman Collection
    ↓
Postman Environment và dữ liệu seed
    ↓
Postman Runner hoặc Newman
    ↓
GitHub Actions
    ↓
CLI log, JUnit XML, HTML report và service logs
    ↓
Kết quả và defect evidence
```

Quy trình CI hiện khởi động các service, kiểm tra health/Swagger, seed dữ liệu phụ thuộc, cấp token, truyền các ID runtime cho Newman, rồi xuất CLI log, JUnit XML và HTML report. Request chỉ được đánh dấu PASS hoặc FAIL khi artifact tương ứng xác nhận assertion và response thực tế.

## 5. EXECUTION SUMMARY

| Item | Value |
|---|---|
| Project | EV Dealer Management |
| Black-box collection | 116 requests defined |
| Execution tools | Postman, Newman |
| CI | GitHub Actions |
| CI status đã xác nhận trong tài liệu hiện có | PASS cho thay đổi ED-47 |
| Historical Module C Newman run | 124 requests, 170 assertions, 0 failed assertions |
| Current 116-request collection result theo từng request | Not Verified |
| Unit test, dùng làm evidence bổ trợ | 37 passed, 0 failed, 0 skipped |
| Execution status | Completed với evidence từng phần; full current-run outcome chưa được xác nhận |

Historical Module C run sử dụng collection/report riêng và không được dùng để kết luận rằng toàn bộ 116 request của collection hiện hành đều PASS. Kết quả unit test cũng không thay thế black-box execution evidence.

## 6. OBSERVED RESULTS

| Observation | Description |
|---|---|
| Authentication | JWT/token hợp lệ được yêu cầu đối với protected endpoints. Lỗi login/token đã từng ảnh hưởng chuỗi request phía sau. |
| Validation | HTTP 400 đã được quan sát khi body, field binding, business rule hoặc test data không hợp lệ. |
| Authentication failure | HTTP 401 đã được quan sát khi thiếu hoặc sai thông tin xác thực. |
| Authorization failure | HTTP 403 đã được quan sát khi user đã xác thực nhưng không có quyền phù hợp. |
| Missing route/resource | HTTP 404 đã được quan sát khi route hoặc dữ liệu theo ID không tồn tại. |
| Unsupported method/routing | HTTP 405 đã được quan sát khi HTTP method hoặc gateway mapping không khớp endpoint. |
| Server exception | HTTP 500 đã được quan sát trong các tình huống backend/dependency không được xử lý, bao gồm lịch sử lỗi database và Firebase. |
| Service availability | `ECONNREFUSED` đã từng xuất hiện khi service chưa được khởi động hoặc không lắng nghe đúng port. |

Status code một mình không đủ để xác định root cause. Mỗi lỗi cần được đối chiếu với URL đã resolve, request body, response body, biến môi trường và backend/service log. Các quan sát trên không có nghĩa toàn bộ API đều fail.

## 7. KNOWN ISSUES DURING EXECUTION

| Nhóm vấn đề | Evidence/ảnh hưởng đã ghi nhận |
|---|---|
| Gateway routing | Gateway không proxy đầy đủ mọi route. Reporting, Notification và một số Sales API cần dùng URL service gốc nếu gateway chưa có mapping tương ứng. |
| Service startup | Launcher, port sai hoặc service chưa sẵn sàng có thể gây `ECONNREFUSED` và làm các request phụ thuộc bị lỗi hàng loạt. |
| Authentication | Login/token lỗi làm các protected request phía sau nhận 401 hoặc 403. |
| Dynamic IDs | Các biến như customer, vehicle, dealer, test drive, complaint, order và contract ID phải được tạo/lưu trước khi request phụ thuộc chạy. ID hard-code có thể không tồn tại sau khi reset database. |
| Order dependency | Payment và Delivery yêu cầu `OrderId` đúng kiểu và tồn tại. OrderId mismatch hoặc dữ liệu order chưa được tạo có thể gây validation/business failure. |
| Database seed | Seed không đồng nhất giữa local và CI có thể làm ID không tồn tại, trùng dữ liệu hoặc thay đổi kết quả business rule. |
| Firebase | Notification request phụ thuộc cấu hình/credential Firebase; fake token hoặc Firebase chưa cấu hình có thể trả business failure hoặc server error. |
| RabbitMQ/dependency | Luồng notification có dependency vào message broker và consumer; trạng thái dependency cần được xác nhận trước khi kết luận lỗi API. |
| ProcessedReservations | Controller bị comment toàn bộ; các route trong controller không tồn tại ở runtime và không nên được xem là request executable hiện hành. |

Các nguyên nhân trên là nhóm vấn đề đã được ghi nhận trong lịch sử và tài liệu dự án. Root cause của một lần chạy cụ thể vẫn là `Unknown` nếu không có response body và service log tương ứng.

## 8. EXECUTION EVIDENCE

| Evidence | Vị trí | Trạng thái sử dụng |
|---|---|---|
| Collection hiện hành | `ev-dealer-management.postman_collection.json` | Xác nhận 116 request được định nghĩa; không chứng minh 116 PASS. |
| Environment hiện hành | `postman/ev-dealer-management.postman_environment.json` | Xác nhận cấu hình biến dùng bởi local và CI. |
| CI workflow | `.github/workflows/ci-jira.yml` | Xác nhận Newman chạy collection/environment trên và xuất CLI, JUnit, HTML artifacts. |
| Historical Module C Newman JSON | `ev-dealer-management/ev-dealer-management/reports/module-c-newman-report_20260705_161956.json` | Xác nhận run lịch sử riêng: 124 requests, 170 assertions, 0 failed assertions. |
| Historical Module C Newman JUnit | `ev-dealer-management/ev-dealer-management/reports/module-c-newman-report_20260705_161956.xml` | 113 test suites, 170 tests, 0 failures, 0 errors. |
| Local full-run JUnit artifact | `test-results/newman-results.xml` | Có artifact nhưng chứa các response value `undefined` và nhiều failure/error; không đủ tin cậy để gán trạng thái hiện tại cho 116 request. |
| GitHub Actions artifacts của run PASS | CLI log, JUnit XML, HTML report theo workflow | Run/link cụ thể: Not Available trong workspace hiện tại. |
| Postman Runner export hoặc screenshot | Không tìm thấy artifact tương ứng trong workspace | Not Available. |

Không nhúng hình vào báo cáo. Evidence cần được lưu dưới dạng artifact gốc để có thể kiểm tra request, response, assertion và thời gian chạy.

## 9. LIMITATIONS

- Chưa có artifact đầy đủ của run GitHub Actions PASS hiện tại trong workspace để đối chiếu trạng thái của từng request trong collection 116 request.
- Không phải mọi active endpoint đều có request trong collection; coverage method/route không đồng nghĩa coverage đầy đủ theo dữ liệu và business branch.
- Historical Module C report dùng phạm vi và số request khác collection hiện hành, nên chỉ là evidence lịch sử cho Module C.
- Một số test phụ thuộc database, seed data, ID sinh động, thứ tự request và trạng thái service.
- Notification phụ thuộc Firebase; event flow có thể phụ thuộc RabbitMQ và consumer tương ứng.
- Postman Runner export/screenshot cho lần chạy hiện tại không có trong repository.
- Không thể xác nhận pass rate của toàn bộ collection hiện hành; giá trị này là `Not Verified`.

## 10. CONCLUSION

Black-box testing đã được thiết kế và thực thi bằng Postman/Newman cho EV Dealer Management. GitHub Actions đã được dùng để tự động khởi động service, chuẩn bị dữ liệu, chạy Newman và xuất evidence. Lịch sử thực thi đã phát hiện các nhóm lỗi authentication, authorization, validation, missing data, gateway routing, dependency, service startup, Firebase và database seed, với các HTTP status 400, 401, 403, 404, 405 và 500 từng được quan sát.

Evidence hiện có xác nhận CI PASS cho thay đổi ED-47, unit test 37/37 PASS và một historical Module C Newman run đạt 170/170 assertions. Tuy nhiên, chưa có đủ artifact trong workspace để kết luận toàn bộ 116 request của collection hiện hành đều PASS hoặc hệ thống hoàn toàn không còn lỗi. Kết luận cuối cùng cho full current-run vẫn là `Not Verified` cho đến khi CLI log, JUnit XML hoặc HTML report tương ứng được lưu và đối chiếu.
