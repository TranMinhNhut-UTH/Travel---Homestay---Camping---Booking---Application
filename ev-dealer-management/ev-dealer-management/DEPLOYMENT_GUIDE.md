# 🚀 Hướng Dẫn Triển Khai (Deployment Guide) - EV Dealer Management System

> **Lưu ý**: File này được cập nhật liên tục qua các phiên làm việc để lưu vết quy trình triển khai, danh sách thay đổi và các bước vận hành.

---

## 1. Mục Tiêu và Kiến Trúc
- **Dự án**: EV Dealer Management System
- **Mục tiêu**: Xây dựng hệ thống quản lý đại lý bán xe điện với kiến trúc Microservices (C# .NET 8).
- **Trạng thái hiện tại**: Đã hoàn thiện và vượt qua 100% các kịch bản kiểm thử (Blackbox API và Whitebox Unit Test) cho **Module C (Sales Management)**.

## 2. Danh Sách Thay Đổi (Module C - Automation Testing)
Các file tài liệu kiểm thử được thêm mới và cập nhật trong thư mục `docs/testing/`:
- `docs/testing/TEST_RESULT_REPORT_MODULE_C.md`: Báo cáo chi tiết kết quả chạy Newman cho Module C.
- `docs/testing/POSTMAN_GUIDE_MODULE_C.md`: Hướng dẫn cài đặt và chạy Postman/Newman.
- `docs/testing/TEST_CASES_MODULE_C.md`, `DEFECT_REPORT_MODULE_C.md`, `TEST_PROCEDURES_MODULE_C.md`, `TRACEABILITY_MATRIX_MODULE_C.md`: Cập nhật trạng thái Pass 100%.
- Bổ sung thư mục `chi-tiet/` (ngoài thư mục dự án) chứa các tài liệu phục vụ bảo vệ nghiệm thu.

## 3. Hướng Dẫn Cài Đặt và Môi Trường
- **Dependency**: .NET 8 SDK, Node.js, Newman (`npm i -g newman`), RabbitMQ.
- **Biến môi trường**: SQLite cho DB local, RabbitMQ cấu hình trong `appsettings.json` (không ghi credential thật).

## 4. Lệnh Vận Hành & Chạy Test Chi Tiết
Dự án cung cấp script tự động hóa bao gồm giả lập môi trường, seed data và dọn dẹp data cũ.

**Chạy tự động toàn bộ (Blackbox & Whitebox)**:
```powershell
.\scripts\run-module-c-all-tests.ps1 -SkipHealthCheck
```
*Script này sẽ chạy Unit Test, sau đó khởi động ngầm các Services và chạy Newman API Test.*

**Chạy thủ công Unit Test (Whitebox)**:
```powershell
dotnet test SalesService.Tests
```

**Báo cáo mới nhất (Reports)**:
- Newman (Blackbox): `reports/module-c-newman-report_20260705_161956.json` (124 requests, 170 assertions -> 100% Pass)
- xUnit (Whitebox): `reports/whitebox/module-c-whitebox-test-results.trx` (20/20 -> 100% Pass)

## 5. Lỗi Phát Sinh và Cách Khắc Phục (Troubleshooting)
- **Lỗi 500 khi đẩy sự kiện qua RabbitMQ (ECONNREFUSED)**:
  - **Khắc phục**: Khởi động NotificationService chạy nền thông qua test script `run-module-c-all-tests.ps1` để Consumer có thể nhận message từ SalesService.
- **Lỗi SQLite Foreign Key Constraint**:
  - **Khắc phục**: Thiết lập cơ chế tự động xóa các file tạm `.db-shm` và `.db-wal` cùng cơ sở dữ liệu cũ trước khi test để tránh xung đột Data Seed.
