# Hướng dẫn Test Nhanh - Import và Kiểm tra Dữ liệu

Hướng dẫn này giúp bạn **nhanh chóng import dữ liệu test** và **kiểm tra các endpoint** đã chuyển sang dữ liệu thật.

---

## 🚀 Bước 1: Khởi động Service

Mở PowerShell và chạy:

```powershell
cd D:\gitclone\ev-dealer-management\ev-dealer-management\ReportingService
$env:USE_SQLITE = "true"
dotnet run
```

Chờ đến khi thấy: `Now listening on: http://localhost:5208`

**Lưu ý:** Giữ cửa sổ PowerShell này mở trong khi test.

> 🔁 Nếu đây là lần đầu test trên máy của bạn, chạy thêm  
> `dotnet ef database update --context ReportingDbContext`  
> để tạo hai cột `Region` mới (Sales/Inventory).

---

## 📥 Bước 2: Import Dữ liệu Test

### Cách A: Dùng PowerShell Script (Nhanh nhất - Khuyên dùng)

Mở PowerShell mới (cửa sổ khác), copy và chạy script sau:

```powershell
$baseUrl = "http://localhost:5208/api/reports"

# ===== IMPORT SALES SUMMARY =====
Write-Host "`n=== Importing Sales Summary Data ===" -ForegroundColor Green

$salesData = @(
    @{
        date = "2025-01-05T00:00:00Z"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        region = "Miền Bắc"
        salespersonId = "11111111-2222-3333-4444-555555555551"
        salespersonName = "Nguyễn Văn A"
        totalOrders = 6
        totalRevenue = 1800000000
    },
    @{
        date = "2025-02-14T00:00:00Z"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        region = "Miền Bắc"
        salespersonId = "11111111-2222-3333-4444-555555555552"
        salespersonName = "Trần Thị B"
        totalOrders = 9
        totalRevenue = 2700000000
    },
    @{
        date = "2025-03-02T00:00:00Z"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        region = "Miền Bắc"
        salespersonId = "11111111-2222-3333-4444-555555555553"
        salespersonName = "Lý Quốc C"
        totalOrders = 8
        totalRevenue = 2560000000
    },
    @{
        date = "2025-01-12T00:00:00Z"
        dealerId = "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e"
        dealerName = "Dealer TP.HCM"
        region = "Miền Nam"
        salespersonId = "22222222-3333-4444-5555-666666666661"
        salespersonName = "Lê Văn C"
        totalOrders = 11
        totalRevenue = 3520000000
    },
    @{
        date = "2025-02-18T00:00:00Z"
        dealerId = "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e"
        dealerName = "Dealer TP.HCM"
        region = "Miền Nam"
        salespersonId = "22222222-3333-4444-5555-666666666662"
        salespersonName = "Phạm Thị D"
        totalOrders = 7
        totalRevenue = 2240000000
    },
    @{
        date = "2025-03-08T00:00:00Z"
        dealerId = "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e"
        dealerName = "Dealer TP.HCM"
        region = "Miền Nam"
        salespersonId = "22222222-3333-4444-5555-666666666663"
        salespersonName = "Đỗ Minh E"
        totalOrders = 9
        totalRevenue = 2970000000
    },
    @{
        date = "2025-01-20T00:00:00Z"
        dealerId = "c3d4e5f6-a7b8-4c5d-0e1f-3a4b5c6d7e8f"
        dealerName = "Dealer Đà Nẵng"
        region = "Miền Trung"
        salespersonId = "33333333-4444-5555-6666-777777777771"
        salespersonName = "Hoàng Văn E"
        totalOrders = 5
        totalRevenue = 1400000000
    },
    @{
        date = "2025-02-10T00:00:00Z"
        dealerId = "c3d4e5f6-a7b8-4c5d-0e1f-3a4b5c6d7e8f"
        dealerName = "Dealer Đà Nẵng"
        region = "Miền Trung"
        salespersonId = "33333333-4444-5555-6666-777777777772"
        salespersonName = "Võ Thu F"
        totalOrders = 6
        totalRevenue = 1740000000
    },
    @{
        date = "2025-03-05T00:00:00Z"
        dealerId = "c3d4e5f6-a7b8-4c5d-0e1f-3a4b5c6d7e8f"
        dealerName = "Dealer Đà Nẵng"
        region = "Miền Trung"
        salespersonId = "33333333-4444-5555-6666-777777777773"
        salespersonName = "Nguyễn Hà G"
        totalOrders = 4
        totalRevenue = 1160000000
    }
)

$salesSuccess = 0
$salesFailed = 0

foreach ($item in $salesData) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/sales-summary" -Method Post `
            -Body ($item | ConvertTo-Json) -ContentType "application/json"
        if ($response.success) {
            $salesSuccess++
            Write-Host "✓ Sales: $($item.dealerName) - $($item.salespersonName)" -ForegroundColor Green
        }
    } catch {
        $salesFailed++
        Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nSales Summary: $salesSuccess thành công, $salesFailed lỗi" -ForegroundColor Cyan

# ===== IMPORT INVENTORY SUMMARY =====
Write-Host "`n=== Importing Inventory Summary Data ===" -ForegroundColor Green

$inventoryData = @(
    @{
        vehicleId = "v1111111-1111-1111-1111-111111111111"
        vehicleName = "Tesla Model 3"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        region = "Miền Bắc"
        stockCount = 18
    },
    @{
        vehicleId = "v9991111-1111-1111-1111-111111111111"
        vehicleName = "VinFast VF9"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        region = "Miền Bắc"
        stockCount = 12
    },
    @{
        vehicleId = "v3333333-3333-3333-3333-333333333333"
        vehicleName = "Audi e-tron"
        dealerId = "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e"
        dealerName = "Dealer TP.HCM"
        region = "Miền Nam"
        stockCount = 14
    },
    @{
        vehicleId = "v4444444-4444-4444-4444-444444444444"
        vehicleName = "Mercedes EQE"
        dealerId = "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e"
        dealerName = "Dealer TP.HCM"
        region = "Miền Nam"
        stockCount = 9
    },
    @{
        vehicleId = "v5555555-5555-5555-5555-555555555555"
        vehicleName = "Porsche Taycan"
        dealerId = "c3d4e5f6-a7b8-4c5d-0e1f-3a4b5c6d7e8f"
        dealerName = "Dealer Đà Nẵng"
        region = "Miền Trung"
        stockCount = 7
    },
    @{
        vehicleId = "v5559999-5555-5555-5555-555555555555"
        vehicleName = "Hyundai Ioniq 5"
        dealerId = "c3d4e5f6-a7b8-4c5d-0e1f-3a4b5c6d7e8f"
        dealerName = "Dealer Đà Nẵng"
        region = "Miền Trung"
        stockCount = 11
    }
)

$inventorySuccess = 0
$inventoryFailed = 0

foreach ($item in $inventoryData) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/inventory-summary" -Method Post `
            -Body ($item | ConvertTo-Json) -ContentType "application/json"
        if ($response.success) {
            $inventorySuccess++
            Write-Host "✓ Inventory: $($item.vehicleName) - $($item.dealerName)" -ForegroundColor Green
        }
    } catch {
        $inventoryFailed++
        Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nInventory Summary: $inventorySuccess thành công, $inventoryFailed lỗi" -ForegroundColor Cyan

Write-Host "`n=== Import hoàn tất! ===" -ForegroundColor Yellow
Write-Host "Tổng: $($salesSuccess + $inventorySuccess) records đã được import thành công" -ForegroundColor Green
```

**Kết quả mong đợi:** Tất cả records sẽ được import thành công với status `201 Created`.

---

### Cách B: Dùng Swagger UI (Trực quan)

1. Mở trình duyệt: `http://localhost:5208/swagger`
2. Tìm endpoint `POST /api/reports/sales-summary`
3. Click **"Try it out"**
4. Paste JSON vào Request body (ví dụ từ Cách A ở trên)
5. Click **"Execute"**
6. Lặp lại cho các records khác

---

### Cách C: Dùng Postman

Xem hướng dẫn chi tiết trong file `IMPORT_DATA_GUIDE.md`

---

## ✅ Bước 3: Kiểm tra Dữ liệu đã Import

### Test 1: Kiểm tra Sales Summary

```powershell
# Lấy tất cả sales summary
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/sales-summary" | ConvertTo-Json -Depth 10

# Lọc theo dealer
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/sales-summary?dealerId=a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d" | ConvertTo-Json -Depth 10

# Lọc theo date range
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/sales-summary?fromDate=2025-01-01&toDate=2025-01-31" | ConvertTo-Json -Depth 10
```

### Test 2: Kiểm tra Inventory Summary

```powershell
# Lấy tất cả inventory summary
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/inventory-summary" | ConvertTo-Json -Depth 10
```

### Test 3: Kiểm tra Summary Report (Endpoint mới - dữ liệu thật)

```powershell
# Lấy summary metrics
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/summary" | ConvertTo-Json -Depth 10

# Lấy summary với filter date
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/summary?from=2025-01-01&to=2025-01-31" | ConvertTo-Json -Depth 10
```

**Kết quả mong đợi:**
```json
{
  "type": "sales",
  "from": "2025-01-01",
  "to": "2025-01-31",
  "metrics": {
    "totalSales": 65,
    "totalRevenue": 20090000000,
    "activeDealers": 3,
    "conversionRate": 0.48
  }
}
```

### Test 4: Kiểm tra Sales by Region (Endpoint mới - dữ liệu thật)

```powershell
# Lấy sales grouped by dealer
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/sales-by-region" | ConvertTo-Json -Depth 10

# Lọc theo date range
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/sales-by-region?from=2025-01-01&to=2025-01-31" | ConvertTo-Json -Depth 10
```

**Kết quả mong đợi:**
```json
[
  {
    "region": "Miền Bắc",
    "sales": 23,
    "revenue": 7060000000
  },
  {
    "region": "Miền Nam",
    "sales": 27,
    "revenue": 8730000000
  },
  {
    "region": "Miền Trung",
    "sales": 15,
    "revenue": 4300000000
  }
]
```

### Test 5: Kiểm tra Top Vehicles (Endpoint mới - dữ liệu thật)

```powershell
# Lấy top vehicles
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/top-vehicles" | ConvertTo-Json -Depth 10

# Lấy top 5 vehicles
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/top-vehicles?limit=5" | ConvertTo-Json -Depth 10
```

**Kết quả mong đợi:**
```json
[
  {
    "model": "Tesla Model 3",
    "stockCount": 18,
    "sales": 18,
    "revenue": 9000000000,
    "estimatedRevenue": 9000000000
  },
  {
    "model": "Audi e-tron",
    "stockCount": 14,
    "sales": 14,
    "revenue": 7000000000,
    "estimatedRevenue": 7000000000
  },
  ...
]
```

> Lưu ý: endpoint này đang xếp hạng **tồn kho** theo `stockCount`, đồng thời trả thêm `estimatedRevenue` dựa trên doanh thu trung bình mỗi đơn.

### Test 6: Test Export Report (Endpoint mới - dữ liệu thật)

```powershell
# Export sales report
$body = @{
    type = "sales"
    from = "2025-01-01"
    to = "2025-01-31"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5208/api/reports/export" `
    -Method Post -Body $body -ContentType "application/json" `
    -OutFile "sales_report.csv"

# Export inventory report
$body = @{
    type = "inventory"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5208/api/reports/export" `
    -Method Post -Body $body -ContentType "application/json" `
    -OutFile "inventory_report.csv"
```

---

## 🎯 Kiểm tra Nhanh với Swagger UI

1. Mở: `http://localhost:5208/swagger`
2. Test các endpoint:
   - `GET /api/reports/summary` - Xem metrics tổng hợp
   - `GET /api/reports/sales-by-region` - Xem sales theo dealer
   - `GET /api/reports/top-vehicles` - Xem top vehicles
   - `GET /api/reports/sales-summary` - Xem tất cả sales data
   - `GET /api/reports/inventory-summary` - Xem tất cả inventory data

---

## 🔍 So sánh: Trước và Sau

### Trước (Mock Data):
- `/api/reports/summary` → Trả về số cố định: `totalSales = 1350`
- `/api/reports/sales-by-region` → Trả về 3 regions cố định
- `/api/reports/top-vehicles` → Trả về 5 vehicles cố định

### Sau (Real Data):
- `/api/reports/summary` → Tính toán từ database: `totalSales = tổng thực tế`
- `/api/reports/sales-by-region` → Group theo dealer từ database
- `/api/reports/top-vehicles` → Query từ InventorySummaries, sắp xếp theo stock count

---

## 🐛 Troubleshooting

| Lỗi | Giải pháp |
|-----|-----------|
| `Connection refused` | Đảm bảo service đang chạy: `dotnet run` |
| `404 Not Found` | Kiểm tra URL: `http://localhost:5208` (không phải https) |
| `500 Internal Server Error` | Kiểm tra database connection, xem console log |
| `Empty result` | Import dữ liệu trước khi test endpoints |

---

## 📊 Kết quả Mong đợi

Sau khi import và test, bạn sẽ thấy:

1. **Summary metrics** tính từ dữ liệu thật (không còn hardcode)
2. **Sales by region** group theo dealer thực tế trong database
3. **Top vehicles** sắp xếp theo stock count thực tế
4. **Export** xuất file CSV với dữ liệu thật

**Tất cả endpoints giờ đều sử dụng dữ liệu thật từ database!** ✅

