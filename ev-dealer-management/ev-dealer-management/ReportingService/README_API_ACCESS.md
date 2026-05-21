# ReportingService API - Hướng dẫn Truy cập

## ⚡ Quick Start (30 giây)

### 1. Khởi động

```bash
cd ReportingService
dotnet run
```

### 2. Chọn một trong 4 cách truy cập:

#### **Cách A: Swagger UI (Dễ nhất - Khuyên dùng)**

```
Mở: http://localhost:5208/swagger
→ Click "Try it out"
→ Click "Execute"
→ Xem kết quả
```

#### **Cách B: REST Client (VS Code)**

```
Mở file: ReportingService.http
Click "Send Request" trên endpoint bạn chọn
```

#### **Cách C: PowerShell**

```powershell
curl -X GET "http://localhost:5208/api/reports/sales-summary"
```

#### **Cách D: JavaScript/React**

```javascript
const data = await fetch(
  "http://localhost:5208/api/reports/sales-summary"
).then((r) => r.json());
```

#### **Cách E: Postman (GUI Tool)**

```
1. Tải: https://www.postman.com/downloads/
2. Mở Postman
3. Tạo request POST
4. URL: http://localhost:5208/api/reports/sales-summary
5. Body: Paste JSON data
6. Click "Send"
```

📖 Xem file `POSTMAN_GUIDE.md` để hướng dẫn chi tiết.

---

## 📊 API Endpoints

### Sales Summary (Doanh số)

```
GET    /api/reports/sales-summary              # Lấy tất cả
GET    /api/reports/sales-summary/{id}         # Lấy chi tiết
POST   /api/reports/sales-summary              # Tạo mới
```

**Query filters:** `?fromDate=2025-01-01&toDate=2025-01-31&dealerId=uuid`

### Inventory Summary (Tồn kho)

```
GET    /api/reports/inventory-summary          # Lấy tất cả
GET    /api/reports/inventory-summary/{id}     # Lấy chi tiết
POST   /api/reports/inventory-summary          # Tạo mới
```

**Query filters:** `?dealerId=uuid&vehicleId=uuid`

---

## 📝 Ví dụ

### Lấy tất cả doanh số

```bash
curl -X GET "http://localhost:5208/api/reports/sales-summary"
```

### Tạo doanh số mới (PowerShell)

```powershell
$body = @{
    date = "2025-01-15T00:00:00Z"
    dealerId = "550e8400-e29b-41d4-a716-446655440000"
    dealerName = "Dealer Hà Nội"
    salespersonId = "550e8400-e29b-41d4-a716-446655440002"
    salespersonName = "Nguyễn Văn A"
    totalOrders = 5
    totalRevenue = 1500000000
} | ConvertTo-Json

curl -X POST "http://localhost:5208/api/reports/sales-summary" `
  -ContentType "application/json" `
  -Body $body
```

### Lọc doanh số theo khoảng thời gian

```bash
curl -X GET "http://localhost:5208/api/reports/sales-summary?fromDate=2025-01-01&toDate=2025-01-31"
```

---

## 🔗 Response Format

### Success (200 OK)

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "uuid",
      "date": "2025-01-15T00:00:00Z",
      "dealerName": "Dealer Hà Nội",
      "totalRevenue": 1500000000,
      ...
    }
  ]
}
```

### Error (4xx/5xx)

```json
{
  "success": false,
  "error": "Chi tiết lỗi"
}
```

---

## 🆘 Troubleshooting

| Lỗi                  | Giải pháp                                     |
| -------------------- | --------------------------------------------- |
| "Failed to connect"  | Kiểm tra: `dotnet run` có chạy không?         |
| "ECONNREFUSED 5208"  | Đảm bảo API chạy trên http://localhost:5208   |
| "CORS error"         | CORS đã được cấu hình cho localhost           |
| "Database not found" | PostgreSQL cần chạy, migrations tự động apply |

---

## ✅ Kiểm tra kết nối

```bash
curl -X GET "http://localhost:5208/api/reports/sales-summary"

# Kết quả mong đợi:
# {
#   "success": true,
#   "count": 0,
#   "data": []
# }
```

---

## 📖 Chi tiết Endpoints

Xem file `API_ENDPOINTS.md` để biết chi tiết tất cả endpoints, parameters, request/response examples.
