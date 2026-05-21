# (WEB) EV DEALER MANAGEMENT SYSTEM

A comprehensive microservices-based dealer management system for electric vehicles, featuring real-time notifications via SMS and Email.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Tech Stack](#tech-stack)

---

## Overview

EV Dealer Management System is a full-stack application designed to manage electric vehicle dealerships with automated customer notifications. The system uses event-driven architecture with RabbitMQ for reliable message delivery.

### Key Capabilities:
- **Vehicle Reservation with SMS Notification**
- **Order Completion with Email Confirmation**
- **Real-time Event Processing**
- **Dealer Analytics & Reporting**
- **Customer Management**
- **Role-based Access Control**

---

## Architecture

### Microservices Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                     │
│                    http://localhost:5173                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌────────────────────────────────────────────────────────────┐
│              API Gateway (Ocelot)                          │
│              http://localhost:5036                         │
└───┬────────────┬────────────┬─────────────┬────────────────┘
    │            │            │             │
    ↓            ↓            ↓             ↓
┌─────────┐ ┌──────────┐ ┌─────────┐ ┌────────────────┐
│ User    │ │ Vehicle  │ │ Sales   │ │ Customer       │
│ Service │ │ Service  │ │ Service │ │ Service        │
│ :7001   │ │ :5002    │ │ :5003   │ │ :5039          │
└────┬────┘ └────┬─────┘ └────┬────┘ └───┬────────────┘
     │           │            │           │
     │           └────────────┴───────────┴─────┐
     │                                           │
     ↓                                           ↓
┌──────────┐                              ┌──────────────┐
│ SQL      │                              │ RabbitMQ     │
│ Server   │                              │ :5672, 15672 │
└──────────┘                              └──────┬───────┘
                                                 │
                                                 ↓
                                        ┌──────────────────┐
                                        │ Notification     │
                                        │ Service :5051    │
                                        └────┬────────┬────┘
                                             │        │
                                    ┌────────┘        └─────────┐
                                    ↓                           ↓
                              ┌──────────┐              ┌────────────┐
                              │ SendGrid │              │ Twilio SMS │
                              │ Email    │              │ (Mock)     │
                              └──────────┘              └────────────┘
```

### Event-Driven Communication
```
Vehicle Reserved Event:
User → VehicleService → RabbitMQ → NotificationService → SMS

Order Completed Event:
User → SalesService → RabbitMQ → NotificationService → Email
```

---

## Features

###  Implemented:

#### 1. Vehicle Reservation with SMS
- Reserve vehicles through web interface
- Automatic SMS confirmation (mock mode in development)
- Real-time notification via RabbitMQ
- Customer information capture

#### 2. Order Completion with Email
- Complete orders from Order Detail page
- Email confirmation with order details
- Order ID generation (ORD-YYYYMMDD-GUID format)
- SendGrid integration for reliable delivery

#### 3. Notification Infrastructure
- Multi-channel notification support (Email + SMS)
- RabbitMQ message queuing
- Consumer service with automatic retry
- Mock mode for development testing

#### 4. API Gateway
- Centralized routing with Ocelot
- Service discovery
- Load balancing ready

### In Progress:
- Test Drive Scheduling notifications
- Customer complaint management
- Dealer analytics dashboard

---

## Quick Start

### Prerequisites:
- .NET 8.0 SDK
- Node.js 18+
- Docker (for RabbitMQ)
- Git

### Option 1: Automated Setup (Recommended)

```powershell
# 1. Clone repository
git clone https://github.com/DangTDuy/ev-dealer-management.git
cd ev-dealer-management

# 2. Start all services
cd ev-dealer-management
.\start-all-services.ps1

# Wait 15-20 seconds for services to initialize

# 3. Run tests
.\test-all-flows.ps1

# 4. Open frontend
http://localhost:5173
```

### Option 2: Manual Setup

```powershell
# 1. Start RabbitMQ
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# 2. Start Backend Services (3 separate terminals)
cd ev-dealer-management\NotificationService
dotnet run

cd ev-dealer-management\SalesService
dotnet run

cd ev-dealer-management\VehicleService
dotnet run

# 3. Start Frontend
cd ev-dealer-frontend
npm install
npm run dev
```

### Verify Installation:
```powershell
.\check-health.ps1
```

Expected output:
```
✅ RabbitMQ Running
✅ NotificationService Healthy
✅ SalesService Healthy
✅ VehicleService Healthy
✅ Frontend Running
```

---

##  Documentation

| Document | Description |
|----------|-------------|
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Production deployment instructions |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Comprehensive testing guide |
| [SalesService/README_TEST.md](./ev-dealer-management/SalesService/README_TEST.md) | SalesService API testing |
| [SalesService/COMPLETE.md](./ev-dealer-management/SalesService/COMPLETE.md) | SalesService integration details |
| [NotificationService/README.md](./ev-dealer-management/NotificationService/README.md) | Notification service setup |

---

## Tech Stack

### Backend:
- **Framework**: .NET 8.0
- **API Gateway**: Ocelot
- **Message Broker**: RabbitMQ
- **Database**: SQL Server / SQLite
- **Email**: SendGrid API
- **SMS**: Twilio API

### Frontend:
- **Framework**: React 18
- **UI Library**: Material-UI v5
- **Build Tool**: Vite
- **State Management**: React Hooks
- **HTTP Client**: Axios

### DevOps:
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions (planned)

---

##  Services Overview

| Service | Port | Status | Description |
|---------|------|--------|-------------|
| **APIGatewayService** | 5036 |  Active | Central API gateway with Ocelot routing |
| **UserService** | 7001 |  Ready | Authentication, authorization, user management |
| **CustomerService** | 5039 |  Ready | Customer CRUD, test drives, complaints |
| **VehicleService** | 5002 |  Complete | Vehicle management, reservations, SMS notifications |
| **SalesService** | 5003 |  Complete | Order management, email notifications |
| **NotificationService** | 5051 |  Complete | Multi-channel notifications (Email/SMS) |
| **DealerManagementService** | TBD |  Planned | Dealer management and analytics |
| **ReportingService** | 5004 |  Ready | Sales analytics and reporting |

---

##  Testing

### Run All Tests:
```powershell
.\test-all-flows.ps1
```

### Test Individual Flows:

**Vehicle Reservation (SMS):**
```powershell
$body = @{
    customerName = "Test User"
    customerEmail = "test@example.com"
    customerPhone = "+84912345678"
    vehicleId = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5002/api/vehicles/reserve" `
    -Method Post -Body $body -ContentType "application/json"
```

**Order Completion (Email):**
```powershell
$body = @{
    customerName = "Test Customer"
    customerEmail = "test@example.com"
    vehicleModel = "VinFast VF8"
    totalAmount = 1500000000
    paymentMethod = "Full Payment"
    quantity = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5003/api/orders/complete" `
    -Method Post -Body $body -ContentType "application/json"
```

---

##  Configuration

### Environment Variables:

**NotificationService:**
```env
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
SMS_MOCK_MODE=true
```

**All Services:**
```env
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
```

### Configuration Files:
- `appsettings.json` - Service-specific settings
- `ocelot.json` - API Gateway routing
- `.env` - Environment variables (production)

---

## 📈 Monitoring

### RabbitMQ Management UI:
```
URL: http://localhost:15672
Username: guest
Password: guest
```

### Health Endpoints:
- NotificationService: http://localhost:5051/notifications/health
- SalesService: http://localhost:5003/api/orders/health
- VehicleService: http://localhost:5002/health

### Check All Services:
```powershell
.\check-health.ps1
```

---

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

---

##  Team

- **Development Team**: DangTDuy
- **Project Type**: Educational / Portfolio Project
- **Institution**: University Project

---

##  Support

### Quick Help:
```powershell
# Check service health
.\check-health.ps1

# View logs
# Check terminal windows for each service

# Restart services
.\start-all-services.ps1

# Run tests
.\test-all-flows.ps1
```

### Common Issues:
See [TESTING_GUIDE.md](./TESTING_GUIDE.md#common-issues--solutions)

---

##  Roadmap

### Phase 1:  Complete (Current)
- [x] Vehicle Reservation with SMS
- [x] Order Completion with Email
- [x] RabbitMQ Integration
- [x] Frontend Integration
- [x] API Gateway Routing

### Phase 2: In Progress
- [ ] Test Drive Scheduling
- [ ] CustomerService Notifications
- [ ] Docker Compose Deployment
- [ ] API Gateway Authentication

### Phase 3:  Planned
- [ ] Real-time Dashboard
- [ ] Admin Panel
- [ ] Analytics & Reporting
- [ ] Mobile App Support

---

**Version**: 1.0.0  
**Last Updated**: November 22, 2025  
**Status**:  Production Ready (Core Features)
