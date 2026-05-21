# VehicleService API Testing Guide với Postman

## Tổng quan
Hướng dẫn chi tiết cách test API CRUD của VehicleService sử dụng Postman. Service đang chạy trên `http://localhost:5224`.

## 1. Health Check
**Trong Postman:**
- **Method**: GET
- **URL**: http://localhost:5224/health
- **Headers**: Không cần thêm gì
- **Body**: Không có

**Sau khi gửi request, bạn sẽ thấy Expected Response:**
```
Status: 200 OK
Body: "Healthy"
```

## 2. Lấy danh sách xe (GET /api/vehicles)
**Trong Postman:**
- **Method**: GET
- **URL**: http://localhost:5224/api/vehicles?page=1&pageSize=10
- **Headers**: Không cần thêm gì
- **Body**: Không có
- **Params** (tùy chọn - nhập trong tab "Params" của Postman):
  - `page`: 1 (số trang, default: 1)
  - `pageSize`: 10 (số items/trang, default: 10)
  - `search`: (để trống hoặc nhập từ khóa tìm kiếm theo model/description)
  - `type`: sedan hoặc suv (lọc theo loại xe)
  - `dealerId`: 1 (lọc theo dealer)
  - `minPrice`: (để trống hoặc nhập giá tối thiểu)
  - `maxPrice`: (để trống hoặc nhập giá tối đa)
  - `sortBy`: model, price, hoặc createdAt (sắp xếp theo)
  - `sortOrder`: asc hoặc desc (thứ tự sắp xếp)

**Cách nhập Params trong Postman:**
1. Click vào tab "Params" (bên cạnh Headers)
2. Nhập key-value pairs như trên
3. Để trống nếu không muốn lọc/sắp xếp

**Sau khi gửi request, bạn sẽ thấy Expected Response trong tab "Body" của response:**
```json
{
  "items": [
    {
      "id": 1,
      "model": "Tesla Model 3",
      "type": "sedan",
      "price": 45000.0,
      "batteryCapacity": 75,
      "range": 350,
      "stockQuantity": 12,
      "description": "Premium electric sedan with autopilot capabilities",
      "dealerId": 1,
      "dealerName": "Tesla Center HCMC",
      "images": [...],
      "colorVariants": [...],
      "specifications": {...},
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalCount": 6,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

## 3. Lấy chi tiết xe (GET /api/vehicles/{id})
**Trong Postman:**
- **Method**: GET
- **URL**: http://localhost:5224/api/vehicles/1
- **Headers**: Không cần thêm gì
- **Body**: Không có

**Expected Response:** Chi tiết vehicle với đầy đủ thông tin liên quan

## 4. Thêm xe mới (POST /api/vehicles)
**Trong Postman:**
- **Method**: POST
- **URL**: http://localhost:5224/api/vehicles
- **Headers**:
  - Key: Content-Type, Value: application/json
- **Body**: Chọn "raw" > "JSON"
- **Body content**:
```json
{
  "model": "Tesla Model S",
  "type": "sedan",
  "price": 80000,
  "batteryCapacity": 100,
  "range": 400,
  "stockQuantity": 5,
  "description": "Luxury electric sedan with cutting-edge technology",
  "dealerId": 1,
  "images": [
    {
      "url": "https://example.com/tesla-models.jpg",
      "altText": "Tesla Model S",
      "order": 1
    }
  ],
  "colorVariants": [
    {
      "name": "Pearl White",
      "hex": "#FFFFFF",
      "stock": 2
    }
  ],
  "specifications": {
    "acceleration": "3.1s",
    "topSpeed": "162 mph",
    "charging": "15 min",
    "warranty": "8 years",
    "seats": 5,
    "cargo": "28 cu ft"
  }
}
```

**Expected Response:**
```
Status: 201 Created
Body: Vehicle object mới được tạo với ID
```

## 5. Cập nhật xe (PUT /api/vehicles/{id})
**Trong Postman:**
- **Method**: PUT
- **URL**: http://localhost:5224/api/vehicles/{id} (thay {id} bằng ID thực tế)
- **Headers**:
  - Key: Content-Type, Value: application/json
- **Body**: Chọn "raw" > "JSON"
- **Body content**: JSON tương tự POST nhưng có thể thay đổi giá trị

**Expected Response:**
```
Status: 200 OK
Body: Vehicle object đã được cập nhật
```

## 6. Xóa xe (DELETE /api/vehicles/{id})
**Trong Postman:**
- **Method**: DELETE
- **URL**: http://localhost:5224/api/vehicles/{id} (thay {id} bằng ID thực tế)
- **Headers**: Không cần thêm gì
- **Body**: Không có

**Expected Response:**
```
Status: 204 No Content
```

## 7. Export dữ liệu
### CSV Export
**Trong Postman:**
- **Method**: GET
- **URL**: http://localhost:5224/api/export/vehicles/csv
- **Headers**: Không cần thêm gì
- **Body**: Không có

**Expected Response:** File CSV download

### JSON Export
**Trong Postman:**
- **Method**: GET
- **URL**: http://localhost:5224/api/export/vehicles/json
- **Headers**: Không cần thêm gì
- **Body**: Không có

**Expected Response:** JSON array của tất cả vehicles

## Lưu ý quan trọng
- **Dealer ID**: Phải sử dụng dealer ID tồn tại (thường là 1)
- **RabbitMQ Events**: Sau mỗi POST/PUT/DELETE, kiểm tra console log để thấy event được publish
- **Required Fields**: `model`, `type`, `price`, `dealerId` là bắt buộc
- **Optional Fields**: `images`, `colorVariants`, `specifications` có thể để trống

## Troubleshooting
- **404 Not Found**: Kiểm tra service đang chạy và URL chính xác
- **400 Bad Request**: Kiểm tra JSON format và required fields
- **500 Internal Server Error**: Xem console log để debug
