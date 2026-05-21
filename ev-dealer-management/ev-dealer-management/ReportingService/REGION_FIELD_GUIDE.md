# Hướng dẫn Region Field và Migration

## 📋 Tổng quan

ReportingService đã được cập nhật để hỗ trợ **Region field** (Miền Bắc, Miền Trung, Miền Nam) cho việc báo cáo theo khu vực.

---

## 🔄 Chạy Migration

### Bước 1: Dừng Service (nếu đang chạy)

Dừng service đang chạy trước khi chạy migration.

### Bước 2: Tạo và Apply Migration

```powershell
cd ReportingService
dotnet ef migrations add AddRegionField --context ReportingDbContext
dotnet ef database update --context ReportingDbContext
```

**Lưu ý:** Nếu dùng SQLite, migration sẽ tự động apply khi service khởi động lại (nếu chưa có migration).

---

## 📝 Region Field trong Models

### SalesSummary

```json
{
  "date": "2025-01-15T00:00:00Z",
  "dealerId": "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d",
  "dealerName": "Dealer Hà Nội",
  "region": "Miền Bắc",  // ← BẮT BUỘC: "Miền Bắc", "Miền Trung", hoặc "Miền Nam"
  "salespersonId": "11111111-2222-3333-4444-555555555551",
  "salespersonName": "Nguyễn Văn A",
  "totalOrders": 5,
  "totalRevenue": 1500000000
}
```

### InventorySummary

```json
{
  "vehicleId": "v1111111-1111-1111-1111-111111111111",
  "vehicleName": "Tesla Model 3",
  "dealerId": "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d",
  "dealerName": "Dealer Hà Nội",
  "region": "Miền Bắc",  // ← BẮT BUỘC
  "stockCount": 15
}
```

---

## 🎯 Endpoints mới/cập nhật

### 1. GET /api/reports/sales-by-region

**Trước:** Group theo DealerName  
**Sau:** Group theo Region

**Response:**
```json
[
  {
    "region": "Miền Nam",
    "sales": 22,
    "revenue": 6600000000
  },
  {
    "region": "Miền Bắc",
    "sales": 19,
    "revenue": 5700000000
  },
  {
    "region": "Miền Trung",
    "sales": 7,
    "revenue": 2100000000
  }
]
```

### 2. GET /api/reports/sales-proportion (MỚI)

Endpoint mới cho donut chart - trả về tỷ trọng doanh số theo region.

**Response:**
```json
[
  {
    "region": "Miền Nam",
    "sales": 22,
    "revenue": 6600000000,
    "salesPercentage": 45.8,
    "revenuePercentage": 45.8
  },
  {
    "region": "Miền Bắc",
    "sales": 19,
    "revenue": 5700000000,
    "salesPercentage": 39.6,
    "revenuePercentage": 39.6
  },
  {
    "region": "Miền Trung",
    "sales": 7,
    "revenue": 2100000000,
    "salesPercentage": 14.6,
    "revenuePercentage": 14.6
  }
]
```

### 3. GET /api/reports/summary

**Cập nhật:** Thêm `totalDealers` vào response.

**Response:**
```json
{
  "type": "sales",
  "from": null,
  "to": null,
  "metrics": {
    "totalSales": 48,
    "totalRevenue": 18000000000,
    "activeDealers": 3,
    "totalDealers": 30,  // ← MỚI
    "conversionRate": 0.1234
  }
}
```

---

## ⚠️ Lưu ý khi Import Data

Khi import data qua POST endpoints, **bắt buộc** phải có field `region`:

- ✅ `"region": "Miền Bắc"`
- ✅ `"region": "Miền Trung"`
- ✅ `"region": "Miền Nam"`
- ❌ Thiếu field `region` → 400 Bad Request

---

## 🔧 Mapping Dealer → Region

**Quy ước mapping:**
- Dealer Hà Nội → **Miền Bắc**
- Dealer TP.HCM → **Miền Nam**
- Dealer Đà Nẵng → **Miền Trung**

Bạn có thể tự định nghĩa mapping khác tùy theo nhu cầu.

---

## 📊 Test Endpoints

```powershell
# Test sales by region
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/sales-by-region" | ConvertTo-Json

# Test sales proportion
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/sales-proportion" | ConvertTo-Json

# Test summary với totalDealers
Invoke-RestMethod -Uri "http://localhost:5208/api/reports/summary" | ConvertTo-Json
```

---

## 🐛 Troubleshooting

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| `400 Bad Request: Region is required` | Thiếu field region khi POST | Thêm `"region": "Miền Bắc"` vào JSON |
| `Migration failed` | Database đang được sử dụng | Dừng service trước khi chạy migration |
| `Column 'Region' does not exist` | Chưa chạy migration | Chạy `dotnet ef database update` |

