# 📊 Hướng Dẫn Xem Logs trong Docker Desktop

## 🖥️ Cách 1: Xem Logs trong Docker Desktop GUI

### Bước 1: Mở Docker Desktop
1. Mở **Docker Desktop** application
2. Vào tab **Containers** (hoặc **Containers / Apps**)

### Bước 2: Xem Logs của Container
1. Tìm container bạn muốn xem logs (ví dụ: `evm_rabbitmq`, `evm_salesservice`)
2. **Click vào tên container**
3. Vào tab **Logs** ở phía trên
4. Logs sẽ hiển thị real-time

### Bước 3: Xem Logs của Tất Cả Containers
1. Trong Docker Desktop, vào tab **Containers**
2. Bạn sẽ thấy danh sách tất cả containers:
   - `evm_rabbitmq` - RabbitMQ server
   - `evm_salesservice` - SalesService
   - `evm_vehicleservice` - VehicleService
   - `evm_userservice` - UserService
3. Click vào từng container để xem logs riêng

### Tính Năng Hữu Ích trong Docker Desktop:
- ✅ **Auto-refresh**: Logs tự động cập nhật
- ✅ **Search**: Có thể search trong logs
- ✅ **Filter**: Lọc logs theo level (INFO, ERROR, WARNING)
- ✅ **Export**: Export logs ra file
- ✅ **Follow**: Tự động scroll theo logs mới

---

## 💻 Cách 2: Xem Logs bằng Command Line

### Xem Logs của Một Service

```powershell
# Xem logs của RabbitMQ
docker-compose logs rabbitmq

# Xem logs của SalesService
docker-compose logs salesservice

# Xem logs của VehicleService
docker-compose logs vehicleservice
```

### Xem Logs Real-time (Follow)

```powershell
# Follow logs của một service
docker-compose logs -f rabbitmq

# Follow logs của tất cả services
docker-compose logs -f

# Follow logs của nhiều services
docker-compose logs -f rabbitmq salesservice
```

### Xem Logs với Timestamps

```powershell
# Xem logs với timestamp
docker-compose logs -t rabbitmq

# Follow logs với timestamp
docker-compose logs -f -t rabbitmq
```

### Xem Logs của N Container Cuối Cùng

```powershell
# Xem 100 dòng logs cuối cùng
docker-compose logs --tail=100 rabbitmq

# Xem 50 dòng logs cuối cùng và follow
docker-compose logs --tail=50 -f rabbitmq
```

### Xem Logs từ Thời Điểm Cụ Thể

```powershell
# Xem logs từ 10 phút trước
docker-compose logs --since 10m rabbitmq

# Xem logs từ 1 giờ trước
docker-compose logs --since 1h rabbitmq

# Xem logs từ một thời điểm cụ thể
docker-compose logs --since "2024-11-27T01:00:00" rabbitmq
```

---

## 🔍 Cách 3: Xem Logs trực tiếp từ Docker Container

```powershell
# Xem logs của container bằng tên container
docker logs evm_rabbitmq

# Follow logs
docker logs -f evm_rabbitmq

# Xem logs với timestamp
docker logs -t evm_rabbitmq

# Xem 100 dòng cuối cùng
docker logs --tail=100 evm_rabbitmq
```

---

## ✅ Kiểm Tra Services Đang Chạy

### Kiểm Tra Status

```powershell
# Xem status tất cả services
docker-compose ps

# Xem status chi tiết
docker ps

# Xem chỉ containers của project này
docker ps --filter "name=evm_"
```

### Kiểm Tra Health

```powershell
# Kiểm tra RabbitMQ health
docker-compose exec rabbitmq rabbitmq-diagnostics ping

# Kiểm tra SalesService
curl http://localhost:5003/api/orders/health

# Kiểm tra VehicleService
curl http://localhost:5224/health
```

---

## 🌐 Truy Cập Services

### RabbitMQ Management UI
- **URL**: http://localhost:15672
- **Username**: `guest`
- **Password**: `guest`

### SalesService
- **Swagger UI**: http://localhost:5003/swagger
- **Health Check**: http://localhost:5003/api/orders/health

### VehicleService
- **Health Check**: http://localhost:5224/health

### UserService
- **Port**: http://localhost:5223

---

## 🎯 Quick Commands Reference

```powershell
# Xem logs tất cả services (real-time)
docker-compose logs -f

# Xem logs một service cụ thể
docker-compose logs -f salesservice

# Xem status
docker-compose ps

# Restart một service
docker-compose restart salesservice

# Stop tất cả
docker-compose stop

# Start tất cả
docker-compose start

# Xem resource usage
docker stats
```

---

## 📝 Ví Dụ Thực Tế

### Xem Logs khi Test SalesService

```powershell
# Terminal 1: Xem logs SalesService
docker-compose logs -f salesservice

# Terminal 2: Xem logs RabbitMQ
docker-compose logs -f rabbitmq

# Terminal 3: Test API
curl http://localhost:5003/api/orders/health
```

### Debug khi có lỗi

```powershell
# 1. Xem logs của service bị lỗi
docker-compose logs --tail=100 salesservice

# 2. Xem logs của RabbitMQ (nếu liên quan đến MQ)
docker-compose logs --tail=100 rabbitmq

# 3. Kiểm tra container đang chạy
docker-compose ps

# 4. Restart service nếu cần
docker-compose restart salesservice
```

---

## 🐛 Troubleshooting

### Không thấy logs trong Docker Desktop

1. **Refresh**: Click nút refresh trong Docker Desktop
2. **Restart container**: 
   ```powershell
   docker-compose restart salesservice
   ```
3. **Kiểm tra container đang chạy**:
   ```powershell
   docker-compose ps
   ```

### Logs quá nhiều, khó tìm

1. **Filter trong Docker Desktop**: Dùng search box
2. **Export logs**: Export ra file và search bằng text editor
3. **Dùng grep**:
   ```powershell
   docker-compose logs salesservice | Select-String "error"
   docker-compose logs salesservice | Select-String "RabbitMQ"
   ```

---

## 💡 Tips

1. **Luôn mở 2-3 terminals**: Một cho logs, một cho commands
2. **Dùng Docker Desktop cho overview**: Xem tất cả containers cùng lúc
3. **Dùng command line cho details**: Khi cần search/filter logs
4. **Export logs quan trọng**: Khi debug issues, export logs để phân tích sau

---

**Bây giờ bạn có thể xem logs dễ dàng! 🎉**

