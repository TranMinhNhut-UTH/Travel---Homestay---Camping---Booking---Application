# Quy trình kiểm chứng phần mềm và CI/Jira

## 1. Mục tiêu và phạm vi

Quy trình áp dụng cho backend EV Dealer Management, kết hợp black-box API testing và white-box unit testing trước khi merge. Tài liệu phản ánh workflow `.github/workflows/ci-jira.yml`, collection root, project `SalesService.Tests` và các script Jira hiện có.

## 2. Công cụ và vai trò

| Công cụ | Vai trò |
|---|---|
| Postman | Thiết kế, chạy thủ công và debug black-box request. |
| Newman | Chạy collection tự động local/CI, xuất CLI/JUnit/HTML evidence. |
| xUnit | Kiểm tra white-box business logic và service-layer method. |
| Moq/EF Core InMemory | Cô lập dependency và dữ liệu trong unit test. |
| GitHub Actions | Build, chạy xUnit/Newman, lưu artifact và quyết định trạng thái CI. |
| Jira | Theo dõi story, comment kết quả CI, transition và defect. |

## 3. Luồng kiểm chứng

```text
Developer
  → Local Test (xUnit + Postman/Newman)
  → Commit có Jira ID
  → Push branch
  → GitHub Actions
      → build/restore
      → xUnit white-box
      → khởi động services
      → Newman black-box
      → lưu artifact và đồng bộ Jira
  → Pull Request + review
  → Merge main
  → Jira Done khi transition khả dụng
```

White-box nằm ở local test và job `dotnet test`; black-box nằm ở Postman Runner/Newman sau khi service sẵn sàng. CI không biến test design thành execution evidence: chỉ log thực thi và artifact mới chứng minh PASS/FAIL.

## 4. Quy trình theo trạng thái

### Push PASS

CI build thành công, 37 unit test pass và Newman không có assertion/request error. Workflow đăng báo cáo PASS, comment issue lấy từ tên branch và gọi Jira sync. Với branch `fix/ED-47-*`, ED-47 là issue chính; bug liên kết cũ không được cập nhật thay cho story nếu branch không mang mã bug đó.

### Push FAIL

Workflow vẫn upload `newman.log`, JUnit và HTML bằng `if: always()`. Jira report ghi FAIL và có thể tạo/deduplicate CI Bug theo logic hiện có. Không tạo bug mới cho run PASS. Người xử lý phải phân tích lỗi là test data, collection, gateway, auth, backend hay môi trường trước khi sửa.

### Merge Pull Request

Khi PR từ branch `fix/*` hoặc `hotfix/*` merge vào `main`, job merge lấy Jira ID từ head branch và yêu cầu transition Done. Transition chỉ thành công nếu Jira workflow cung cấp transition phù hợp; script phải log rõ khi không tìm thấy thay vì che giấu.

## 5. Quy ước Git và Jira

- Branch: `feature/ED-xx-mo-ta`, `fix/ED-xx-mo-ta`, `hotfix/ED-xx-mo-ta`.
- Commit: `ED-xx test: ...`, `ED-xx fix: ...`, `ED-xx docs: ...`.
- PR phải ghi Jira ID, phạm vi thay đổi, evidence local và rủi ro regression.
- Không commit Jira API token hoặc `.env`.

Secrets bắt buộc: `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY`. Reporter/assignee account ID là tùy chọn và script có fallback khi Jira từ chối trường identity.

## 6. Tiêu chí cho phép merge

1. Restore/build pass.
2. Unit test pass; hiện tại baseline là 37/37.
3. Newman pass, hoặc mọi lỗi được phân loại rõ với Jira/evidence và quyết định ngoại lệ được reviewer chấp thuận.
4. CI tổng thể pass.
5. Reviewer chấp thuận và không còn comment blocking.
6. Không giảm coverage hoặc vô hiệu hóa assertion để làm CI xanh.

## 7. Test data, kết quả và defect

Postman dùng environment chuẩn và ID động từ response. Unit test dùng mock/EF InMemory, không phụ thuộc service đang chạy. Khi fail, lưu expected/actual, response body, stack trace/log backend, branch/commit và CI URL. Jira Bug phải link test case và story tương ứng; fix xong cần targeted retest và regression.

## 8. Hiện trạng xác nhận

| Hạng mục | Trạng thái | Evidence trong repository |
|---|---|---|
| Unit test | PASS 37/37 | 37 `[Fact]` trong `SalesService.Tests` và lần chạy đã xác nhận |
| Coverage | Thấp | Cobertura gần nhất: 14,13% line, 6,74% branch |
| CI ED-47 | PASS | Workflow có step PASS report/sync; git history chứa merge PR #35 |
| Black-box | Có automation, còn rủi ro runtime/data | Collection root có 116 request và collection-level assertions |
| PR ED-47 | Đã merge | Commit merge `473a08a` ngày 2026-07-18 |

## 9. Kết luận

Pipeline đã tích hợp xUnit, Newman, artifact và Jira, nhưng coverage còn thấp và black-box phụ thuộc trạng thái service/database. Không được kết luận hệ thống hết bug, toàn bộ endpoint pass hoặc 100% chức năng đã được kiểm thử chỉ từ trạng thái CI hiện tại.
