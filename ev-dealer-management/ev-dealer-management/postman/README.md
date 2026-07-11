# Postman Collection — EV Dealer Management System

> **Ngày tạo**: 2026-07-03 | **Phiên bản**: 1.0

---

## 1. Collection Files

| File | Vị trí | Mô tả |
|---|---|---|
| `EV Dealer Management API.postman_collection.json` | Project root | Collection chính — chứa toàn bộ API requests |

### Không cần collection riêng cho Module C

Runner script `scripts/run-module-c-blackbox-tests.ps1` sử dụng `--folder` filter để chỉ chạy 8 Module C folders từ collection chính. Không tạo bản copy để tránh trùng lặp và đảm bảo single source of truth.

---

## 2. Environment Files

### Hiện tại: Không bắt buộc

Collection đang dùng **hardcoded URLs** (direct port access):
- `http://localhost:5003` cho SalesService
- `http://localhost:5208` cho ReportingService
- `http://localhost:5051` cho NotificationService

### Nếu cần tạo Environment

Tạo file `Module_C_Local.postman_environment.json` với nội dung:

```json
{
  "id": "module-c-local",
  "name": "Module C - Local",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5036",
      "type": "default",
      "enabled": true
    },
    {
      "key": "salesServiceUrl",
      "value": "http://localhost:5003",
      "type": "default",
      "enabled": true
    },
    {
      "key": "reportingServiceUrl",
      "value": "http://localhost:5208",
      "type": "default",
      "enabled": true
    },
    {
      "key": "notificationServiceUrl",
      "value": "http://localhost:5051",
      "type": "default",
      "enabled": true
    },
    {
      "key": "authToken",
      "value": "",
      "type": "secret",
      "enabled": false
    }
  ],
  "_postman_variable_scope": "environment"
}
```

---

## 3. Required Variables

| Variable | Default | Mô tả |
|---|---|---|
| `baseUrl` | `http://localhost:5036` | API Gateway (không dùng cho Module C trực tiếp) |
| `salesServiceUrl` | `http://localhost:5003` | SalesService port |
| `reportingServiceUrl` | `http://localhost:5208` | ReportingService port |
| `notificationServiceUrl` | `http://localhost:5051` | NotificationService port |
| `authToken` | _(empty)_ | JWT token nếu cần auth (hiện tại không bắt buộc) |

---

## 4. How to Import into Postman

1. Mở Postman → **Import**
2. Chọn file `EV Dealer Management API.postman_collection.json`
3. (Optional) Import environment file nếu đã tạo
4. Collection sẽ hiển thị với 14 folders, trong đó 8 folders bắt đầu bằng **"Module C -"**

---

## 5. How to Run Manually (Postman GUI)

1. Mở collection → chọn folder **"Module C - Quotes"**
2. Click **Run folder** (Runner icon)
3. Chọn environment nếu có
4. Click **Run** → xem kết quả từng request
5. Lặp lại cho các folder Module C khác

### Run tất cả Module C cùng lúc:
1. Right-click collection → **Run collection**
2. Uncheck tất cả folders NGOÀI Module C
3. Chỉ giữ 8 folders Module C được check
4. Click **Run**

---

## 6. How to Run with Newman (CLI)

### Cài đặt
```powershell
npm install -g newman
```

### Chạy qua script (Recommended)
```powershell
.\scripts\run-module-c-blackbox-tests.ps1
```

### Chạy thủ công
```powershell
newman run "EV Dealer Management API.postman_collection.json" `
  --folder "Module C - Quotes" `
  --folder "Module C - Orders" `
  --folder "Module C - Contracts" `
  --folder "Module C - Payments" `
  --folder "Module C - Deliveries & Promotions" `
  --folder "Module C - Sales Composite API" `
  --folder "Module C - Reporting API" `
  --folder "Module C - Notification & E2E Flow" `
  --reporters cli,json `
  --reporter-json-export reports/module-c-newman-report.json
```

---

## 7. Report Output Paths

| Report | Path | Format |
|---|---|---|
| JSON Report | `reports/module-c-newman-report.json` | Newman JSON |
| JUnit XML | `reports/module-c-newman-report.xml` | JUnit XML (for CI/CD) |
| Timestamped JSON | `reports/module-c-newman-report_YYYYMMDD_HHMMSS.json` | Backup |
| Timestamped XML | `reports/module-c-newman-report_YYYYMMDD_HHMMSS.xml` | Backup |

---

## 8. Collection Statistics

_Source: `node scripts/count-postman-tests.js`_

| Metric | Value |
|---|---|
| Total requests (toàn collection) | 189 |
| Total pm.test assertions | 200 |
| Module C requests | 113 |
| Module C pm.test assertions | 170 |

### Module C Folders

| Folder | Requests | pm.test |
|---|---|---|
| Module C - Quotes | 12 | 20 |
| Module C - Orders | 16 | 31 |
| Module C - Contracts | 13 | 24 |
| Module C - Payments | 9 | 17 |
| Module C - Deliveries & Promotions | 12 | 18 |
| Module C - Sales Composite API | 13 | 18 |
| Module C - Reporting API | 20 | 20 |
| Module C - Notification & E2E Flow | 18 | 22 |

---

## 9. Known Limitations

1. **Không có environment file mặc định** — URLs hardcode trong collection. Nếu port thay đổi, cần sửa trực tiếp trong collection hoặc tạo environment file.

2. **Auth không bắt buộc** — SalesService, ReportingService, NotificationService không yêu cầu JWT token cho local testing.

3. **RabbitMQ dependency** — Một số endpoint (CompleteOrder, CreatePayment) publish event qua RabbitMQ. Nếu RabbitMQ không chạy, event sẽ fail silently nhưng API vẫn trả 200/201.

4. **NotificationService FCM** — Test FCM endpoints sẽ trả 400/500 nếu chưa config Firebase credentials. Đây là expected behavior trong local environment.

5. **ReportingService data** — ReportingService cần dữ liệu sync từ SalesService. Nếu chạy test riêng lẻ, một số report endpoints có thể trả empty data.

6. **Execution order matters** — E2E tests (E2E-01, E2E-02, E2E-03) phải chạy SAU các CRUD tests vì phụ thuộc data đã tạo.
