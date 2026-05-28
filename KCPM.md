# 📘 Project Requirement Summary - Software Verification Course

## 1. Tổng quan hệ thống

Hệ thống mô phỏng quy trình phát triển phần mềm theo mô hình:

- Frontend - Backend độc lập
- Backend cung cấp REST API
- Giao tiếp qua HTTP protocol
- Có tích hợp:
  - Jira (quản lý task / bug / workflow)
  - GitHub/GitLab (quản lý source code)
  - Postman (test API)
  - CI/CD (optional theo repo)

---

## 2. Kiến trúc hệ thống

### 2.1 Frontend - Backend separation
- Frontend chỉ gọi API
- Backend xử lý logic nghiệp vụ
- Không phụ thuộc trực tiếp nhau

### 2.2 Backend
- Xây dựng theo REST API
- Sử dụng HTTP protocol
- Có unit test coverage
- Log lỗi rõ ràng để tracking qua Jira

---

## 3. Công nghệ sử dụng

### Backend
- REST API
- Java / Node.js / Spring Boot (tuỳ project)
- Unit Testing framework (JUnit / Jest / Mocha)

### Tool hỗ trợ
- Jira (task management)
- GitHub (version control)
- Postman (API testing)
- Web IDE / VSCode
- Command Line (git, run test)

---

## 4. Quy trình làm việc (Workflow)

### 4.1 Flow chính

### 4.2 Chi tiết quy trình

1. Member 1:
   - Nhận Functional Requirements
   - Viết Unit Test
   - Chạy test
   - Nếu fail → tạo bug trên Jira

2. Jira Flow:
   - Bug được log lên Jira
   - Assign cho Member 2

3. Member 2:
   - Fix bug
   - Commit lại source code

4. Review:
   - Merge vào main branch

---

## 5. Git Workflow

- Có thể dùng nhiều branch
- Quy định chính:
  - `main` branch là bản chính cuối tuần
  - Feature branches cho từng task
  - Merge theo tuần

### Chu trình lặp:

---

## 6. Jira Requirements

### 6.1 Task tracking
- Mỗi lỗi phải tạo Jira Issue
- Issue phải có:
  - ID
  - Comment chuẩn (bắt buộc)
  - Log lỗi rõ ràng

### 6.2 Quy tắc chấm điểm
- Sai comment hoặc thiếu ID → bị rớt
- Jira là nguồn đối chiếu chính với Git history

---

## 7. Postman & API Testing

### 7.1 Postman usage
- Tạo Workspace theo project
- Tạo Collection theo module
- Sử dụng Environment variables:
  - base_url
  - token
  - api_key

### 7.2 Test Script
- Có pre-request script
- Có test script để validate response
- Automation test cơ bản

---

## 8. Environment & Security

- File `.env` chứa:
  - Jira token
  - API keys
- ⚠️ KHÔNG commit file `.env` lên repo
- Sử dụng `.gitignore` để loại trừ

---

## 9. Reporting (Báo cáo)

### 9.1 Tần suất
- Mỗi tuần 1 report
- Tổng cộng: 8 tuần → 8 reports

### 9.2 Nội dung report
- Jira tickets đã xử lý
- Git commits
- Test results
- Bug logs
- Sprint summary

### 9.3 Format
- Markdown (`.md`)
- Convert sang PDF để nộp

---

## 10. Project Structure yêu cầu

- Repo phải có:
  - `main` branch
  - feature branches
  - test folder
  - logs/report folder
  - `.env.example`
  - `.gitignore`

---

## 11. Tổng hợp cuối kỳ (Final Skill File)

- Sau khi hoàn thành project:
  - Tổng hợp toàn bộ kiến thức + workflow
  - Tạo 1 file skills duy nhất
  - Mục tiêu: giúp team sau không phải tốn thời gian setup lại Jira / repo / workflow

---

## 12. Lưu ý quan trọng

- Commit history sẽ bị kiểm tra
- Jira + Git phải khớp nhau 100%
- Main branch là căn cứ chấm điểm cuối tuần
- Comment Jira bắt buộc chuẩn hóa
- Có thể dùng nhiều branch nhưng phải rõ ràng

---

## JIRA BACKLOG SECTION

| Jira ID | Summary | Description | Acceptance Criteria | Labels | Type |
|---|---|---|---|---|---|
| ED-1 | Postman Testing - Module A | Module A covers Access, Users, Customers, TestDrives, Complaints. Endpoints include `/api/auth/*`, `/api/users/*`, `/api/customers/*`, `/api/TestDrives/*`, `/api/Complaints/*`. | Postman collection created; all endpoints tested with happy + negative cases; collection runs successfully in CI. | testing, postman, automation | Task |
| ED-2 | Postman Testing - Module B | Module B covers Vehicles, Dealers, VehicleTypes, Export, Health. Endpoints include `/api/vehicles/*`, `/api/dealers/*`, `/api/vehicletypes/*`, `/api/export/*`, `/api/health`. | Postman collection created; all endpoints tested with happy + negative cases; collection runs successfully in CI. | testing, postman, automation | Task |
| ED-3 | Postman Testing - Module C | Module C covers Sales Flow, Orders, Contracts, Payments, Deliveries, Promotions, Reports, Notifications. Endpoints include `/api/Quotes/*`, `/api/Orders/*`, `/api/Contracts/*`, `/api/Payments/*`, `/api/Deliveries/*`, `/api/Promotions/*`, `/api/reports/*`, `/api/notification/*`. | Postman collection created; all endpoints tested with happy + negative cases; collection runs successfully in CI. | testing, postman, automation | Task |

## POSTMAN SECTION

### ModuleA.postman_collection.json

```json
{
  "info": {
    "name": "EV Dealer - Module A",
    "_postman_id": "module-a-collection",
    "description": "Module A: Auth, Users, Customers, TestDrives, Complaints",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login Success",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": { "mode": "raw", "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"P@ssw0rd!\"\n}" },
            "url": "{{baseUrl}}/api/auth/login"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Status code is 200', function () { pm.response.to.have.status(200); });",
                  "pm.test('Response has token field', function () { const json = pm.response.json(); pm.expect(json).to.be.an('object'); pm.expect(json.token || json.accessToken || json.data?.token).to.exist; });"
                ]
              }
            }
          ]
        },
        {
          "name": "Login Invalid Password",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": { "mode": "raw", "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"wrong-password\"\n}" },
            "url": "{{baseUrl}}/api/auth/login"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Status code is 400 or 401', function () { pm.expect([400, 401]).to.include(pm.response.code); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Register Success",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": { "mode": "raw", "raw": "{\n  \"username\": \"sales01\",\n  \"email\": \"sales01@example.com\",\n  \"fullName\": \"Sales User\",\n  \"password\": \"P@ssw0rd!\",\n  \"role\": \"Sales\",\n  \"dealerId\": 1\n}" },
            "url": "{{baseUrl}}/api/auth/register"
          },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }]
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "Get Me",
          "request": { "method": "GET", "header": [{ "key": "Authorization", "value": "Bearer {{authToken}}" }], "url": "{{baseUrl}}/api/users/me" },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });", "pm.test('Response is an object', function () { pm.expect(pm.response.json()).to.be.an('object'); });"] } }]
        },
        {
          "name": "Get Users",
          "request": { "method": "GET", "header": [{ "key": "Authorization", "value": "Bearer {{authToken}}" }], "url": "{{baseUrl}}/api/users" },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"] } }]
        },
        {
          "name": "Admin List Users",
          "request": { "method": "GET", "header": [{ "key": "Authorization", "value": "Bearer {{authToken}}" }], "url": "{{baseUrl}}/api/admin/users" },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 403', function () { pm.expect([200, 403]).to.include(pm.response.code); });"] } }]
        }
      ]
    },
    {
      "name": "Customers",
      "item": [
        {
          "name": "Create Customer",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }],
            "body": { "mode": "raw", "raw": "{\n  \"name\": \"Nguyen Van A\",\n  \"email\": \"customer@example.com\",\n  \"phone\": \"+84912345678\",\n  \"address\": \"Ha Noi\",\n  \"dealerId\": 1,\n  \"status\": \"active\"\n}" },
            "url": "{{baseUrl}}/api/customers"
          },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }]
        },
        {
          "name": "Create Customer Invalid Email",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }],
            "body": { "mode": "raw", "raw": "{\n  \"name\": \"Nguyen Van A\",\n  \"email\": \"invalid-email\",\n  \"phone\": \"+84912345678\",\n  \"address\": \"Ha Noi\",\n  \"dealerId\": 1,\n  \"status\": \"active\"\n}" },
            "url": "{{baseUrl}}/api/customers"
          },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 400 or 422', function () { pm.expect([400, 422]).to.include(pm.response.code); });"] } }]
        }
      ]
    },
    {
      "name": "TestDrives",
      "item": [
        {
          "name": "Create Test Drive",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }],
            "body": { "mode": "raw", "raw": "{\n  \"customerId\": 1,\n  \"vehicleId\": 1,\n  \"dealerId\": 1,\n  \"appointmentDate\": \"2026-06-01T09:00:00Z\",\n  \"notes\": \"Morning slot\",\n  \"status\": \"Scheduled\"\n}" },
            "url": "{{baseUrl}}/api/TestDrives"
          },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }]
        },
        {
          "name": "Create Test Drive Missing Vehicle",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }],
            "body": { "mode": "raw", "raw": "{\n  \"customerId\": 1,\n  \"dealerId\": 1,\n  \"appointmentDate\": \"2026-06-01T09:00:00Z\",\n  \"notes\": \"Missing vehicle\",\n  \"status\": \"Scheduled\"\n}" },
            "url": "{{baseUrl}}/api/TestDrives"
          },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 400 or 422', function () { pm.expect([400, 422]).to.include(pm.response.code); });"] } }]
        }
      ]
    },
    {
      "name": "Complaints",
      "item": [
        {
          "name": "Create Complaint",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }],
            "body": { "mode": "raw", "raw": "{\n  \"customerId\": 1,\n  \"type\": \"Bao hanh\",\n  \"title\": \"Remote not working\",\n  \"description\": \"Customer reports a broken remote\",\n  \"assignedToStaffID\": 10,\n  \"priority\": \"High\",\n  \"relatedOrderID\": 1,\n  \"relatedVehicleID\": 1\n}" },
            "url": "{{baseUrl}}/api/Complaints"
          },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }]
        },
        {
          "name": "Complaint Unauthorized",
          "request": { "method": "GET", "url": "{{baseUrl}}/api/Complaints" },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 401 or 403', function () { pm.expect([401, 403]).to.include(pm.response.code); });"] } }]
        }
      ]
    }
  ],
  "event": [
    {
      "listen": "prerequest",
      "script": { "type": "text/javascript", "exec": ["pm.collectionVariables.set('baseUrl', pm.collectionVariables.get('baseUrl') || pm.environment.get('baseUrl') || 'http://localhost:5036');"] }
    }
  ]
}
```

### ModuleB.postman_collection.json

```json
{
  "info": {
    "name": "EV Dealer - Module B",
    "_postman_id": "module-b-collection",
    "description": "Module B: Vehicles, Dealers, VehicleTypes, Export, Health",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Vehicles",
      "item": [
        {
          "name": "Get Vehicles",
          "request": { "method": "GET", "url": "{{baseUrl}}/api/vehicles?page=1&pageSize=10" },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"] } }]
        },
        {
          "name": "Create Vehicle",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }],
            "body": { "mode": "raw", "raw": "{\n  \"Model\": \"VinFast VF 8\",\n  \"Type\": \"SUV\",\n  \"Price\": 1200000000,\n  \"BatteryCapacity\": 87.7,\n  \"Range\": 420,\n  \"StockQuantity\": 5,\n  \"Description\": \"Demo vehicle\",\n  \"DealerId\": 1\n}" },
            "url": "{{baseUrl}}/api/vehicles"
          },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }]
        },
        {
          "name": "Reserve Vehicle",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }],
            "body": { "mode": "raw", "raw": "{\n  \"customerName\": \"Nguyen Van A\",\n  \"customerEmail\": \"customer@example.com\",\n  \"customerPhone\": \"+84912345678\",\n  \"colorVariantId\": 1,\n  \"notes\": \"Reserve for demo\",\n  \"quantity\": 1,\n  \"deviceToken\": \"sample-device-token\"\n}" },
            "url": "{{baseUrl}}/api/vehicles/1/reserve"
          },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }]
        },
        {
          "name": "Reserve Vehicle Invalid Quantity",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }],
            "body": { "mode": "raw", "raw": "{\n  \"customerName\": \"Nguyen Van A\",\n  \"customerEmail\": \"customer@example.com\",\n  \"customerPhone\": \"+84912345678\",\n  \"colorVariantId\": 1,\n  \"notes\": \"Invalid quantity\",\n  \"quantity\": 0,\n  \"deviceToken\": \"sample-device-token\"\n}" },
            "url": "{{baseUrl}}/api/vehicles/1/reserve"
          },
          "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 400 or 422', function () { pm.expect([400, 422]).to.include(pm.response.code); });"] } }]
        }
      ]
    },
    {
      "name": "Dealers",
      "item": [
        { "name": "Get Dealers", "request": { "method": "GET", "url": "{{baseUrl}}/api/dealers" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"] } }] },
        { "name": "Create Dealer", "request": { "method": "POST", "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }], "body": { "mode": "raw", "raw": "{\n  \"name\": \"VinFast Ha Noi\",\n  \"region\": \"Ha Noi\",\n  \"contact\": \"0900000000\",\n  \"email\": \"dealer@example.com\",\n  \"address\": \"123 Demo Street\"\n}" }, "url": "{{baseUrl}}/api/dealers" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }] }
      ]
    },
    {
      "name": "VehicleTypes",
      "item": [
        { "name": "Get Vehicle Types", "request": { "method": "GET", "url": "{{baseUrl}}/api/vehicletypes" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"] } }] }
      ]
    },
    {
      "name": "Export & Health",
      "item": [
        { "name": "Export Vehicles CSV", "request": { "method": "GET", "url": "{{baseUrl}}/api/export/vehicles/csv" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"] } }] },
        { "name": "Export Vehicles JSON", "request": { "method": "GET", "url": "{{baseUrl}}/api/export/vehicles/json" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"] } }] },
        { "name": "Health Check", "request": { "method": "GET", "url": "{{baseUrl}}/api/health" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"] } }] }
      ]
    }
  ],
  "event": [
    { "listen": "prerequest", "script": { "type": "text/javascript", "exec": ["pm.collectionVariables.set('baseUrl', pm.collectionVariables.get('baseUrl') || pm.environment.get('baseUrl') || 'http://localhost:5036');"] } }
  ]
}
```

### ModuleC.postman_collection.json

```json
{
  "info": {
    "name": "EV Dealer - Module C",
    "_postman_id": "module-c-collection",
    "description": "Module C: Sales Flow, Orders, Contracts, Payments, Reports, Notifications",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Quotes",
      "item": [
        { "name": "Get Quotes", "request": { "method": "GET", "url": "{{baseUrl}}/api/Quotes" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"] } }] },
        { "name": "Create Quote", "request": { "method": "POST", "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }], "body": { "mode": "raw", "raw": "{\n  \"customerId\": 1,\n  \"dealerId\": 1,\n  \"salespersonId\": 1,\n  \"vehicleId\": 1,\n  \"colorId\": 1,\n  \"quantity\": 1,\n  \"unitPrice\": 1200000000,\n  \"totalPrice\": 1200000000,\n  \"status\": \"Active\",\n  \"notes\": \"Demo quote\"\n}" }, "url": "{{baseUrl}}/api/Quotes" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }] },
        { "name": "Update Quote Status", "request": { "method": "PUT", "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }], "body": { "mode": "raw", "raw": "{\n  \"status\": \"ConvertedToOrder\"\n}" }, "url": "{{baseUrl}}/api/Quotes/1/status" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"] } }] }
      ]
    },
    {
      "name": "Orders",
      "item": [
        { "name": "Complete Order", "request": { "method": "POST", "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }], "body": { "mode": "raw", "raw": "{\n  \"quoteId\": 1,\n  \"customerId\": 1,\n  \"customerEmail\": \"customer@example.com\",\n  \"customerName\": \"Nguyen Van B\",\n  \"dealerId\": 1,\n  \"salespersonId\": 1,\n  \"paymentMethod\": \"Cash\",\n  \"deliveryDate\": \"2026-06-10T09:00:00Z\",\n  \"estimatedDeliveryDate\": \"2026-06-15T09:00:00Z\",\n  \"notes\": \"Complete order demo\",\n  \"paymentType\": \"Full\",\n  \"depositAmount\": 0,\n  \"interestRateYearly\": 0,\n  \"loanTermMonths\": 0,\n  \"vehicleId\": 1,\n  \"vehicleVariantId\": 1,\n  \"colorId\": 1,\n  \"quantity\": 1,\n  \"unitPrice\": 1200000000,\n  \"totalAmount\": 1200000000,\n  \"promotionId\": null,\n  \"discountAmount\": 0,\n  \"discountPercent\": 0,\n  \"discountNote\": \"\"\n}" }, "url": "{{baseUrl}}/api/Orders/complete" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }] },
        { "name": "Get Orders", "request": { "method": "GET", "url": "{{baseUrl}}/api/Orders" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"] } }] },
        { "name": "Update Order Status", "request": { "method": "PUT", "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }], "body": { "mode": "raw", "raw": "{\n  \"status\": \"ReadyForDelivery\"\n}" }, "url": "{{baseUrl}}/api/Orders/1/status" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"] } }] }
      ]
    },
    {
      "name": "Contracts / Payments / Deliveries / Promotions",
      "item": [
        { "name": "Create Contract", "request": { "method": "POST", "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }], "body": { "mode": "raw", "raw": "{\n  \"orderId\": 1,\n  \"customerId\": 1,\n  \"salespersonId\": \"1\",\n  \"contractDate\": \"2026-06-10T09:00:00Z\",\n  \"depositAmountReceived\": true,\n  \"termsAndConditions\": \"Demo contract\"\n}" }, "url": "{{baseUrl}}/api/Contracts" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }] },
        { "name": "Create Payment", "request": { "method": "POST", "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }], "body": { "mode": "raw", "raw": "{\n  \"orderId\": 1,\n  \"amount\": 1200000000,\n  \"paymentDate\": \"2026-06-10T09:00:00Z\",\n  \"paymentMethod\": \"Cash\",\n  \"status\": \"Completed\",\n  \"transactionId\": \"TXN-001\",\n  \"notes\": \"Demo payment\"\n}" }, "url": "{{baseUrl}}/api/Payments" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }] },
        { "name": "Create Delivery", "request": { "method": "POST", "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }], "body": { "mode": "raw", "raw": "{\n  \"orderId\": 1,\n  \"estimatedDeliveryDate\": \"2026-06-15T09:00:00Z\",\n  \"status\": \"Scheduled\",\n  \"notes\": \"Demo delivery\"\n}" }, "url": "{{baseUrl}}/api/Deliveries" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }] },
        { "name": "Create Promotion", "request": { "method": "POST", "header": [{ "key": "Content-Type", "value": "application/json" }, { "key": "Authorization", "value": "Bearer {{authToken}}" }], "body": { "mode": "raw", "raw": "{\n  \"name\": \"SUMMER2026\",\n  \"description\": \"Summer promotion\",\n  \"discountType\": \"Percent\",\n  \"discountValue\": 10,\n  \"startDate\": \"2026-06-01T00:00:00Z\",\n  \"endDate\": \"2026-08-31T23:59:59Z\"\n}" }, "url": "{{baseUrl}}/api/Promotions" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }] }
      ]
    },
    {
      "name": "Reports & Notifications",
      "item": [
        { "name": "Demand Forecast", "request": { "method": "GET", "url": "{{baseUrl}}/api/reports/demand-forecast?from={{reportFrom}}&to={{reportTo}}" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200', function () { pm.response.to.have.status(200); });"] } }] },
        { "name": "Export Report", "request": { "method": "POST", "header": [{ "key": "Content-Type", "value": "application/json" }], "body": { "mode": "raw", "raw": "{\n  \"type\": \"sales\",\n  \"from\": \"{{reportFrom}}\",\n  \"to\": \"{{reportTo}}\"\n}" }, "url": "{{baseUrl}}/api/reports/export" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }] },
        { "name": "Test FCM", "request": { "method": "POST", "header": [{ "key": "Content-Type", "value": "application/json" }], "body": { "mode": "raw", "raw": "{\n  \"deviceToken\": \"{{deviceToken}}\",\n  \"title\": \"Test notification\",\n  \"body\": \"Hello from Postman\",\n  \"data\": { \"source\": \"postman\" }\n}" }, "url": "{{baseUrl}}/api/notification/test-fcm" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }] },
        { "name": "Send To Topic", "request": { "method": "POST", "header": [{ "key": "Content-Type", "value": "application/json" }], "body": { "mode": "raw", "raw": "{\n  \"topic\": \"{{topic}}\",\n  \"title\": \"Broadcast\",\n  \"body\": \"Hello topic\",\n  \"data\": { \"source\": \"postman\" }\n}" }, "url": "{{baseUrl}}/api/notification/send-to-topic" }, "event": [{ "listen": "test", "script": { "type": "text/javascript", "exec": ["pm.test('Status code is 200 or 201', function () { pm.expect([200, 201]).to.include(pm.response.code); });"] } }] }
      ]
    }
  ],
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:5036" },
    { "key": "authToken", "value": "" },
    { "key": "reportFrom", "value": "2026-01-01" },
    { "key": "reportTo", "value": "2026-12-31" },
    { "key": "topic", "value": "ev-dealer-updates" },
    { "key": "deviceToken", "value": "sample-device-token" }
  ],
  "event": [
    { "listen": "prerequest", "script": { "type": "text/javascript", "exec": ["pm.collectionVariables.set('baseUrl', pm.collectionVariables.get('baseUrl') || pm.environment.get('baseUrl') || 'http://localhost:5036');"] } }
  ]
}
```