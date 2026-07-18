# Báo cáo đối chiếu độ phủ endpoint Postman

## 1. Mục tiêu

Đối chiếu chính xác method/path trong backend với collection CI, phân biệt endpoint đã có request, mới phủ một phần, chưa phủ, đang inactive và route gateway trùng với service gốc. Báo cáo không xem một gateway proxy là endpoint nghiệp vụ mới.

## 2. Phạm vi và nguồn dữ liệu

- Collection chuẩn: `ev-dealer-management.postman_collection.json` – 116 request.
- Environment: `postman/ev-dealer-management.postman_environment.json`.
- Backend inventory: `docs/testing/BACKEND_ENDPOINT_INVENTORY.md`.
- Source routes: UserService, CustomerService, VehicleService, SalesService, ReportingService và NotificationService.
- Gateway: `APIGatewayService/Program.cs`, chỉ dùng để đánh giá khả năng proxy.

`DealerManagementService` hiện chỉ có file project, không có controller hoặc minimal API route nên không được tính endpoint. `ProcessedReservationsController.cs` bị comment toàn bộ; năm route trong file là inactive và bị loại khỏi mẫu số active.

## 3. Phương pháp phân loại

| Phân loại | Tiêu chí |
|---|---|
| Covered | Có ít nhất một request trong collection trùng method và route gốc, có collection-level assertion. |
| Partially covered | Có request đúng endpoint nhưng chưa phủ đủ nhánh dữ liệu, quyền, query hoặc chuỗi ID động. |
| Not covered | Route active nhưng không có request trùng method/path. |
| Inactive/commented endpoint | Code không tạo route runtime nên không tính vào active coverage. |
| Gateway proxy duplicate | Cùng endpoint nghiệp vụ qua gateway; không cộng thêm vào tổng endpoint. |

Matching được chuẩn hóa không phân biệt hoa/thường và coi `{id}`, `{customerId}` cùng là path parameter. Utility route (`weatherforecast`, health) vẫn được liệt kê để báo cáo đầy đủ nhưng tách khỏi đánh giá nghiệp vụ.

## 4. Tổng hợp theo module

| Module | Service | Active origin routes | Method/path có request | Chưa có request | Ghi chú |
|---|---|---:|---:|---:|---|
| ED-21 – Module A | UserService | 14 | 14 | 0 | Auth/User có request; các nhánh quyền và ID động chỉ phủ một phần. |
| ED-21 – Module A | CustomerService | 17 | 16 | 1 | Thiếu utility `GET /weatherforecast`; CRUD stateful phụ thuộc customer/test-drive/complaint ID. |
| ED-22 – Module B | VehicleService | 17 | 15 | 2 | Thiếu `GET /api/Health/ready` và `/live`. |
| ED-23 – Module C | SalesService | 24 | 18 | 6 | Thiếu health Orders và năm route facade `/api/Sales/*`. |
| ED-23 – Module C | ReportingService | 19 | 14 | 5 | Thiếu hai GET-by-ID, hai POST summary và utility weatherforecast. |
| ED-23 – Module C | NotificationService | 6 | 5 | 1 | Năm POST nghiệp vụ có request; thiếu `GET /health`. |
| **Tổng** |  | **97** | **82** | **15** | 82 là origin route có cặp method/path, không phải 82 request PASS. |

ED-21 có 31 route/30 route có request; ED-22 có 17/15; ED-23 có 49/37. Collection có 116 request vì một endpoint có thể có happy path và nhiều negative/boundary case.

## 5. Endpoint chưa được phủ

| Module | Service | Method | Endpoint | Phân loại/đề xuất |
|---|---|---|---|---|
| ED-21 | CustomerService | GET | `/weatherforecast` | Utility; Not covered, có thể loại khỏi phạm vi nghiệp vụ. |
| ED-22 | VehicleService | GET | `/api/Health/ready` | Not covered; thêm smoke readiness nếu CI cần. |
| ED-22 | VehicleService | GET | `/api/Health/live` | Not covered; thêm liveness smoke test nếu CI cần. |
| ED-23 | SalesService | GET | `/api/Orders/health` | Not covered. |
| ED-23 | SalesService | GET | `/api/Sales/quotes/{id}` | Not covered; facade trùng miền Quotes nhưng là route active riêng. |
| ED-23 | SalesService | POST | `/api/Sales/orders` | Not covered. |
| ED-23 | SalesService | GET | `/api/Sales/orders/{id}` | Not covered. |
| ED-23 | SalesService | POST | `/api/Sales/contracts` | Not covered. |
| ED-23 | SalesService | GET | `/api/Sales/contracts/{id}` | Not covered. |
| ED-23 | ReportingService | GET | `/api/reports/sales-summary/{id}` | Not covered. |
| ED-23 | ReportingService | POST | `/api/reports/sales-summary` | Not covered. |
| ED-23 | ReportingService | GET | `/api/reports/inventory-summary/{id}` | Not covered. |
| ED-23 | ReportingService | POST | `/api/reports/inventory-summary` | Not covered. |
| ED-23 | ReportingService | GET | `/weatherforecast` | Utility; Not covered. |
| ED-23 | NotificationService | GET | `/health` | Not covered. |

## 6. Khu vực chỉ phủ một phần

| Nhóm | Hiện trạng | Rủi ro còn lại |
|---|---|---|
| Authentication/Users | Có login, register, admin CRUD và role/approve | Cần tách rõ 401 và 403 theo role; các request dùng `managedUserId`/`deleteUserId` phải có dữ liệu runtime. |
| Vehicle/Dealer CRUD | Có GET/POST/PUT/DELETE và reserve | DELETE dùng biến riêng; nếu chưa tạo/lưu ID sẽ kiểm tra sai dữ liệu hoặc URL chưa resolve. |
| Customer/Test Drive/Complaint | Có toàn bộ method CRUD chính | Collection lưu một số ID dưới tên `created*` nhưng request sau dùng biến chuẩn; database reset làm ID hard-code mất hiệu lực. |
| Sales | Có Quotes, Orders, Contracts, Payments, Deliveries, Promotions | Chưa phủ facade `/api/Sales/*`; Payment/Delivery cần Order ID đúng kiểu và tồn tại. |
| Reporting | Có 14/19 route | Query combinations và POST/GET-by-ID summary chưa phủ. |
| Notifications | Có năm POST | Fake token có thể trả business failure; chưa có health request. |

## 7. Gateway proxy và request đặc biệt

- Các request dùng `{{baseUrl}}` chỉ được xem reachable khi `APIGatewayService` có proxy đúng method/path. Việc route gốc tồn tại không chứng minh gateway route hoạt động.
- Reporting, Notification và phần lớn Sales route nên dùng `{{reportingServiceUrl}}`, `{{notificationServiceUrl}}`, `{{salesServiceUrl}}` nếu gateway không proxy.
- `GET /images/sample.jpg` là gateway/static-file check, không có controller method tương ứng; đây là request hợp lệ cho routing/static content nhưng không tính vào 97 origin routes.
- Dealer CRUD thuộc VehicleService. `DealerManagementService` không cung cấp endpoint để thay thế.
- Năm route ProcessedReservations nằm trong controller bị comment, do đó không nên thêm lại vào collection cho đến khi backend thực sự map route.

## 8. Biến Postman và test data

Collection-level pre-request sinh `futureAppointmentDate`; collection-level test lưu các ID `created*`; Login dùng request-level script để lưu `authToken`. Các biến phải chú ý khi chạy regression:

- `deleteDealerId`, `deleteVehicleId`, `deleteCustomerId`, `deleteUserId`, `managedUserId`, `newContractOrderId` không có default tin cậy và cần được tạo/lưu trước khi dùng.
- `testDriveId`, `complaintId`, `customerId`, `dealerId`, `vehicleId` có default nhưng có thể không tồn tại trong database hiện tại.
- Nếu create lưu `createdTestDriveId` nhưng GET/PUT/DELETE đọc `testDriveId`, chuỗi phụ thuộc vẫn có thể dùng ID cũ. Đây là lỗi test data/collection flow, không phải bằng chứng route không tồn tại.
- Không dùng ngày appointment cố định đã qua thời điểm chạy.

## 9. Defect/issue đã quan sát

Black-box từng phát hiện 400, 401, 403, 404, 405 và 500. Status code một mình không đủ xác định nguyên nhân. Cần lưu response body và log service để phân loại: validation/test data, auth, route/method, gateway proxy hoặc backend exception. Tài liệu này không đánh dấu các request là PASS khi thiếu Newman artifact tương ứng.

## 10. Kết luận

Collection có độ phủ method/path rộng (82/97 origin routes) nhưng chưa đồng nghĩa toàn bộ chức năng pass. Khoảng trống chính nằm ở Sales facade, summary write/detail của Reporting, health endpoints và các luồng stateful dùng ID động. CI ED-47 đã pass và unit test 37/37 pass, nhưng coverage code còn 14,13% line/6,74% branch và black-box vẫn cần evidence theo từng run.
