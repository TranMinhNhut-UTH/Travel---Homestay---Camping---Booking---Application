# API Gateway Service

Dịch vụ API Gateway cho hệ thống quản lý đại lý EV sử dụng Ocelot.

## Chức năng

- Route các request đến UserService
- Có thể mở rộng để route đến các services khác

## Cấu hình

- Port: 5036 (HTTP)
- UserService downstream: localhost:5223

## Cách sử dụng

1. Chạy UserService trước
2. Chạy APIGatewayService
3. Gọi API qua gateway: http://localhost:5036/api/users/*

Ví dụ:
- GET http://localhost:5036/api/users/me -> route đến UserService
- POST http://localhost:5036/api/users/auth/register -> route đến UserService
