# Testing Documentation

Đây là bộ tài liệu testing chính thức và là documentation root duy nhất cho hoạt động kiểm thử của toàn bộ project EV Dealer Management.

| File | Vai trò |
|---|---|
| `BACKEND_ENDPOINT_INVENTORY.md` | Danh sách method, route và contract của các endpoint backend đang active. |
| `BLACK_BOX_TEST_CASES.md` | Đặc tả test case black-box cho các module ED-21, ED-22 và ED-23. |
| `BLACK_BOX_EXECUTION_REPORT.md` | Báo cáo thực thi black-box dựa trên Postman, Newman và GitHub Actions evidence. |
| `POSTMAN_ENDPOINT_COVERAGE_AUDIT.md` | Đối chiếu độ phủ giữa Postman collection và endpoint backend. |
| `TEST_CASE_SPECIFICATION.xlsx` | Workbook tổng hợp test case, kết quả, coverage, defect và traceability. |
| `TEST_PROCEDURES.md` | Quy trình chuẩn để chạy Postman/Newman, unit test, coverage và xử lý defect. |
| `WHITEBOX_EXECUTION_REPORT.md` | Báo cáo thực thi unit test white-box và coverage đã đo được. |
| `WHITEBOX_COVERAGE_PLAN.md` | Kế hoạch mở rộng white-box coverage theo business risk. |

## Quy ước

- Collection chính thức: `ev-dealer-management.postman_collection.json`.
- Postman environment chính thức: `postman/ev-dealer-management.postman_environment.json`.
- Unit test chạy từ solution `ev-dealer-management/ev-dealer-management/DealerSystem.sln`.
- Chỉ ghi `PASS` hoặc `FAIL` khi có execution evidence tương ứng; trường hợp chưa đủ evidence sử dụng `NOT RUN`, `BLOCKED` hoặc `Not Verified` theo từng tài liệu.
- Không sử dụng tài liệu testing nằm ngoài thư mục này làm baseline chính thức.
