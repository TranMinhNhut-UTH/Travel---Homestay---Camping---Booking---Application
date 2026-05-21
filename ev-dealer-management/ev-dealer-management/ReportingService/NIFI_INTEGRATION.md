# Apache NiFi Integration Guide

## Tổng quan

Apache NiFi được sử dụng để đồng bộ dữ liệu từ các services (SalesService, VehicleService) vào ReportingService một cách tự động và định kỳ.

## Kiến trúc

```
SalesService (Port 5003)
    ↓ (NiFi Fetch)
    ↓
NiFi Flow
    ↓ (Transform & Aggregate)
    ↓
ReportingService (Port 5214)
```

## Cài đặt Apache NiFi

### 1. Download và cài đặt

```bash
# Download Apache NiFi
wget https://archive.apache.org/dist/nifi/1.23.2/nifi-1.23.2-bin.zip
unzip nifi-1.23.2-bin.zip
cd nifi-1.23.2
```

### 2. Khởi động NiFi

```bash
# Windows
bin\run-nifi.bat

# Linux/Mac
bin/nifi.sh start
```

NiFi UI sẽ chạy tại: `http://localhost:8443/nifi`

## Cấu hình Flow

### Flow 1: Sync Sales Data

1. **GenerateFlowFile** - Tạo trigger định kỳ (mỗi giờ)
   - Schedule: `0 0 * * * ?` (mỗi giờ)

2. **InvokeHTTP** - Fetch Orders từ SalesService
   - URL: `http://localhost:5003/api/sales/orders`
   - Method: GET
   - Query Parameters:
     - `fromDate`: ${fromDate}
     - `toDate`: ${toDate}

3. **TransformJSON** - Transform dữ liệu
   - JOLT Spec: Map fields từ Order sang SalesSummary format

4. **AggregateContent** - Aggregate theo Dealer và Date
   - Group by: `dealerId`, `date`

5. **InvokeHTTP** - Post to ReportingService
   - URL: `http://localhost:5214/api/reports/sales-summary`
   - Method: POST
   - Content-Type: `application/json`

### Flow 2: Sync Inventory Data

1. **GenerateFlowFile** - Tạo trigger định kỳ (mỗi 6 giờ)

2. **InvokeHTTP** - Fetch Vehicles từ VehicleService
   - URL: `http://localhost:5002/api/vehicles`
   - Method: GET

3. **TransformJSON** - Transform dữ liệu
   - Map Vehicle sang InventorySummary format

4. **InvokeHTTP** - Post to ReportingService
   - URL: `http://localhost:5214/api/reports/inventory-summary`
   - Method: POST

## Import Flow Template

1. Mở NiFi UI: `http://localhost:8443/nifi`
2. Click "Upload Template" (icon ở toolbar)
3. Chọn file `nifi-flow.json`
4. Drag template vào canvas
5. Configure các processors với đúng URLs và credentials

## Monitoring

- Xem flow status trong NiFi UI
- Check logs: `logs/nifi-app.log`
- Monitor data flow: NiFi UI → Data Provenance

## Troubleshooting

### Connection Issues
- Đảm bảo các services đang chạy
- Check firewall rules
- Verify URLs trong processors

### Data Transformation Issues
- Check JOLT spec syntax
- Verify JSON structure từ source APIs
- Review error logs trong NiFi

## Tùy chỉnh Schedule

Để thay đổi tần suất sync:

1. Mở processor "GenerateFlowFile"
2. Tab "Scheduling"
3. Thay đổi "Run Schedule":
   - Mỗi giờ: `0 0 * * * ?`
   - Mỗi 6 giờ: `0 0 */6 * * ?`
   - Mỗi ngày: `0 0 0 * * ?`

## Best Practices

1. **Error Handling**: Thêm processors để handle errors
2. **Backpressure**: Configure backpressure limits
3. **Monitoring**: Set up alerts cho failed flows
4. **Data Validation**: Validate data trước khi post
5. **Idempotency**: Ensure duplicate data không được insert


