# Backend Endpoint Inventory

## Scope
Active backend routes only. Commented-out/inactive controllers and route handlers are excluded.

## UserService
Source: [UserService/Program.cs](../../ev-dealer-management/ev-dealer-management/UserService/Program.cs)

| Service | Method | Endpoint | Controller/action or mapping | Request body/query/path params | Auth | Validation / notes |
|---|---|---|---|---|---|---|
| UserService | POST | `/api/auth/register` | minimal API lambda | Body: `RegisterRequest` | None | `Username`, `Email`, `FullName`, `Password`, `Role`, `DealerId?` in record; no visible data annotations |
| UserService | POST | `/api/auth/login` | minimal API lambda | Body: `LoginRequest` | None | `Username`, `Password` |
| UserService | POST | `/api/auth/forgot-password` | minimal API lambda | Body: `ForgotPasswordRequest` | None | `email` JSON property |
| UserService | POST | `/api/auth/reset-password` | minimal API lambda | Body: `ResetPasswordRequest` | None | `token`, `newPassword` JSON properties |
| UserService | GET | `/api/users/me` | minimal API lambda | No body; reads current JWT claim `id` | Required | Rejects if claim missing or not an integer |
| UserService | GET | `/api/users` | minimal API lambda | No body | Required, role `Admin` | Admin-only |
| UserService | POST | `/api/admin/users` | minimal API lambda | Body: `RegisterRequest` | Required, role `Admin` | Creates approved user |
| UserService | GET | `/api/users/{id:int}` | minimal API lambda | Path `id` | Required | Only Admin or same user id |
| UserService | PUT | `/api/users/{id:int}` | minimal API lambda | Path `id`, body: `UpdateUserRequest` | Required | Only Admin or same user id |
| UserService | DELETE | `/api/users/{id:int}` | minimal API lambda | Path `id` | Required, role `Admin` | Admin-only |
| UserService | PUT | `/api/users/{id:int}/role` | minimal API lambda | Path `id`, body: `ChangeRoleRequest` | Required, role `Admin` | Admin-only |
| UserService | PUT | `/api/users/{id:int}/approve` | minimal API lambda | Path `id` | Required, role `Admin` | Admin-only |
| UserService | GET | `/api/dealers` | minimal API lambda | No params | None visible | Returns seeded dealers from User DB |
| UserService | GET | `/api/internal/users` | minimal API lambda | No params | None visible | Internal projection route |

## CustomerService
Sources: [CustomersController.cs](../../ev-dealer-management/ev-dealer-management/CustomerService/Controllers/CustomersController.cs), [TestDrivesController.cs](../../ev-dealer-management/ev-dealer-management/CustomerService/Controllers/TestDrivesController.cs), [ComplaintsController.cs](../../ev-dealer-management/ev-dealer-management/CustomerService/Controllers/ComplaintsController.cs), [Program.cs](../../ev-dealer-management/ev-dealer-management/CustomerService/Program.cs)

| Service | Method | Endpoint | Controller/action or mapping | Request body/query/path params | Auth | Validation / notes |
|---|---|---|---|---|---|---|
| CustomerService | GET | `/api/Customers` | `CustomersController.GetCustomers` | None | None visible |  |
| CustomerService | GET | `/api/Customers/{id}` | `CustomersController.GetCustomer(int id)` | Path `id` | None visible |  |
| CustomerService | POST | `/api/Customers` | `CustomersController.PostCustomer(CreateCustomerRequest)` | Body | None visible | `Name` required max 100; `Email` required email; `DealerId` required; `Phone` optional phone |
| CustomerService | PUT | `/api/Customers/{id}` | `CustomersController.PutCustomer(int id, UpdateCustomerRequest)` | Path `id`, body | None visible | `Name` max 100; `Email` email; `Phone` phone; `DealerId` optional; `Status` optional |
| CustomerService | DELETE | `/api/Customers/{id}` | `CustomersController.DeleteCustomer(int id)` | Path `id` | None visible |  |
| CustomerService | GET | `/api/TestDrives` | `TestDrivesController.GetTestDrives` | None | None visible |  |
| CustomerService | GET | `/api/TestDrives/customer/{customerId}` | `TestDrivesController.GetTestDrivesByCustomerId(int customerId)` | Path `customerId` | None visible |  |
| CustomerService | GET | `/api/TestDrives/{id}` | `TestDrivesController.GetTestDrive(int id)` | Path `id` | None visible |  |
| CustomerService | POST | `/api/TestDrives` | `TestDrivesController.PostTestDrive(CreateTestDriveRequest)` | Body | None visible | `CustomerId`, `VehicleId`, `DealerId`, `AppointmentDate` required; `Notes`, `Status` optional |
| CustomerService | PUT | `/api/TestDrives/{id}` | `TestDrivesController.PutTestDrive(int id, UpdateTestDriveRequest)` | Path `id`, body | None visible | `Status` max 50; `AppointmentDate`, `Notes` optional |
| CustomerService | DELETE | `/api/TestDrives/{id}` | `TestDrivesController.DeleteTestDrive(int id)` | Path `id` | None visible |  |
| CustomerService | GET | `/api/Complaints` | `ComplaintsController.GetComplaints` | None | None visible |  |
| CustomerService | GET | `/api/Complaints/{id}` | `ComplaintsController.GetComplaint(int id)` | Path `id` | None visible |  |
| CustomerService | POST | `/api/Complaints` | `ComplaintsController.PostComplaint(CreateComplaintRequest)` | Body | None visible | `CustomerId` required; `Type` max 50; `Title` max 200; `Description` required; optional `AssignedToStaffID`, `Priority`, `RelatedOrderID`, `RelatedVehicleID` |
| CustomerService | PUT | `/api/Complaints/{id}` | `ComplaintsController.PutComplaint(int id, UpdateComplaintRequest)` | Path `id`, body | None visible | `Type` max 50; `Title` max 200; other fields optional |
| CustomerService | DELETE | `/api/Complaints/{id}` | `ComplaintsController.DeleteComplaint(int id)` | Path `id` | None visible |  |
| CustomerService | GET | `/weatherforecast` | template utility route | None | None visible | Non-domain utility route |

## VehicleService
Sources: [VehiclesController.cs](../../ev-dealer-management/ev-dealer-management/VehicleService/Controllers/VehiclesController.cs), [DealersController.cs](../../ev-dealer-management/ev-dealer-management/VehicleService/Controllers/DealersController.cs), [VehicleTypesController.cs](../../ev-dealer-management/ev-dealer-management/VehicleService/Controllers/VehicleTypesController.cs), [ExportController.cs](../../ev-dealer-management/ev-dealer-management/VehicleService/Controllers/ExportController.cs), [HealthController.cs](../../ev-dealer-management/ev-dealer-management/VehicleService/Controllers/HealthController.cs)

| Service | Method | Endpoint | Controller/action or mapping | Request body/query/path params | Auth | Validation / notes |
|---|---|---|---|---|---|---|
| VehicleService | GET | `/api/Vehicles` | `VehiclesController.GetVehicles([FromQuery] VehicleQueryDto)` | Query: `Search`, `Type`, `DealerId`, `MinPrice`, `MaxPrice`, `Page`, `PageSize`, `SortBy`, `SortOrder` | None visible | `Page` default 1; `PageSize` default 10 |
| VehicleService | GET | `/api/Vehicles/{id}` | `VehiclesController.GetVehicle(int id)` | Path `id` | None visible |  |
| VehicleService | POST | `/api/Vehicles` | `VehiclesController.CreateVehicle()` | Body JSON or multipart form-data | None visible | `Model` required max 200; `Type` required max 50; `Price` and `BatteryCapacity` required non-negative; `Range` and `StockQuantity` required non-negative; `Description` max 1000; `DealerId` required; nested color/specification constraints apply |
| VehicleService | PUT | `/api/Vehicles/{id}` | `VehiclesController.UpdateVehicle(int id)` | Path `id`, body JSON or form-data | None visible | Same validation shape as create |
| VehicleService | DELETE | `/api/Vehicles/{id}` | `VehiclesController.DeleteVehicle(int id)` | Path `id` | None visible |  |
| VehicleService | POST | `/api/Vehicles/{id}/reserve` | `VehiclesController.ReserveVehicle(int id, ReservationRequestDto)` | Path `id`, body | None visible | `CustomerName` required; `CustomerEmail` email; `CustomerPhone` phone; `Quantity` range 1 to 100; optional `ColorVariantId`, `Notes`, `DeviceToken` |
| VehicleService | GET | `/api/Dealers` | `DealersController.GetDealers` | None | None visible |  |
| VehicleService | GET | `/api/Dealers/{id}` | `DealersController.GetDealer(int id)` | Path `id` | None visible |  |
| VehicleService | POST | `/api/Dealers` | `DealersController.CreateDealer(CreateDealerDto)` | Body | None visible | `Name` required max 200; `Region` required max 100; `Contact` required max 20; `Email` required email max 200; `Address` required max 500 |
| VehicleService | PUT | `/api/Dealers/{id}` | `DealersController.UpdateDealer(int id, UpdateDealerDto)` | Path `id`, body | None visible | Same required/length/email constraints as create |
| VehicleService | DELETE | `/api/Dealers/{id}` | `DealersController.DeleteDealer(int id)` | Path `id` | None visible |  |
| VehicleService | GET | `/api/VehicleTypes` | `VehicleTypesController.GetVehicleTypes` | None | None visible |  |
| VehicleService | GET | `/api/Export/vehicles/csv` | `ExportController.ExportVehiclesToCsv` | None | None visible |  |
| VehicleService | GET | `/api/Export/vehicles/json` | `ExportController.ExportVehiclesToJson` | None | None visible |  |
| VehicleService | GET | `/api/Health` | `HealthController.GetHealth` | None | None visible |  |
| VehicleService | GET | `/api/Health/ready` | `HealthController.GetReady` | None | None visible |  |
| VehicleService | GET | `/api/Health/live` | `HealthController.GetLive` | None | None visible |  |

## SalesService
Sources: [OrdersController.cs](../../ev-dealer-management/ev-dealer-management/SalesService/Controllers/OrdersController.cs), [QuotesController.cs](../../ev-dealer-management/ev-dealer-management/SalesService/Controllers/QuotesController.cs), [ContractsController.cs](../../ev-dealer-management/ev-dealer-management/SalesService/Controllers/ContractsController.cs), [PromotionsController.cs](../../ev-dealer-management/ev-dealer-management/SalesService/Controllers/PromotionsController.cs), [PaymentsController.cs](../../ev-dealer-management/ev-dealer-management/SalesService/Controllers/PaymentsController.cs), [DeliveriesController.cs](../../ev-dealer-management/ev-dealer-management/SalesService/Controllers/DeliveriesController.cs), [SalesController.cs](../../ev-dealer-management/ev-dealer-management/SalesService/Controllers/SalesController.cs)

| Service | Method | Endpoint | Controller/action or mapping | Request body/query/path params | Auth | Validation / notes |
|---|---|---|---|---|---|---|
| SalesService | GET | `/api/Quotes` | `QuotesController.GetAllQuotes` | None | None visible |  |
| SalesService | GET | `/api/Quotes/{id}` | `QuotesController.GetQuoteById(int id)` | Path `id` | None visible |  |
| SalesService | POST | `/api/Quotes` | `QuotesController.CreateQuote([FromQuery] CreateQuoteDto)` | Query DTO | None visible | `CustomerId`, `DealerId`, `SalespersonId`, `VehicleId`, `ColorId`, `UnitPrice`, `TotalPrice`, `Status` required; `Quantity` range 1 to 100; `Notes` max 1000 |
| SalesService | PUT | `/api/Quotes/{id}/status` | `QuotesController.UpdateQuoteStatus(int id, UpdateQuoteStatusDto)` | Path `id`, body | None visible | `Status` required max 50 |
| SalesService | POST | `/api/Orders/complete` | `OrdersController.CompleteOrder(CreateOrderRequest)` | Body | None visible | `CustomerEmail` and `CustomerName` checked for non-empty in code; fields visible in request DTO include `QuoteId`, `CustomerId`, `DealerId`, `SalespersonId`, `VehicleId`, `VehicleVariantId`, `ColorId`, `Quantity`, `UnitPrice`, payment/delivery/discount fields |
| SalesService | GET | `/api/Orders` | `OrdersController.GetAllOrders` | None | None visible |  |
| SalesService | GET | `/api/Orders/{id}` | `OrdersController.GetOrderById(int id)` | Path `id` | None visible |  |
| SalesService | PUT | `/api/Orders/{id}/status` | `OrdersController.UpdateOrderStatus(int id, UpdateStatusRequest)` | Path `id`, body | None visible | `Status` field used directly; no visible annotation |
| SalesService | GET | `/api/Orders/health` | `OrdersController.Health` | None | None visible |  |
| SalesService | GET | `/api/Contracts` | `ContractsController.GetAllContracts` | None | None visible |  |
| SalesService | POST | `/api/Contracts` | `ContractsController.CreateContract(CreateContractRequest)` | Body | None visible | `OrderId`, `CustomerId`, `SalespersonId`, `ContractDate` required; `TermsAndConditions` optional; `DepositAmountReceived` boolean |
| SalesService | GET | `/api/Contracts/{id}` | `ContractsController.GetContractById(int id)` | Path `id` | None visible |  |
| SalesService | PUT | `/api/Contracts/{id}/status` | `ContractsController.UpdateContractStatus(int id, UpdateStatusRequest)` | Path `id`, body | None visible |  |
| SalesService | GET | `/api/Promotions` | `PromotionsController.GetPromotions` | None | None visible |  |
| SalesService | POST | `/api/Promotions` | `PromotionsController.CreatePromotion(CreatePromotionDto)` | Body | None visible | `Name` required max 200; `Description` max 1000; `StartDate` required; `EndDate` required; `DiscountValue` required range 0.01 to 1,000,000,000; `DiscountType` required max 50; `ApplicableTo` max 50; `VehicleId` optional |
| SalesService | GET | `/api/Payments` | `PaymentsController.GetPayments` | None | None visible |  |
| SalesService | POST | `/api/Payments` | `PaymentsController.CreatePayment(CreatePaymentDto)` | Body | None visible | `OrderId` required Guid; `Amount` range 0.01 to 10,000,000,000; `PaymentDate` required; `PaymentMethod` required max 50; `Status` required max 50; `TransactionId` max 200; `Notes` max 1000 |
| SalesService | GET | `/api/Deliveries` | `DeliveriesController.GetDeliveries` | None | None visible |  |
| SalesService | POST | `/api/Deliveries` | `DeliveriesController.CreateDelivery(CreateDeliveryDto)` | Body | None visible | `OrderId` required Guid; `TrackingNumber` required max 100; `EstimatedDeliveryDate` required; `Status` required max 50; `Notes` max 1000; `ActualDeliveryDate` optional |
| SalesService | GET | `/api/Sales/quotes/{id}` | `SalesController.GetQuoteById(int id)` | Path `id` | None visible | Commented section in same file is excluded |
| SalesService | POST | `/api/Sales/orders` | `SalesController.CreateOrder(CreateOrderDto)` | Body | None visible | `QuoteId`, `CustomerId`, `DealerId`, `SalespersonId`, `VehicleId`, `VariantId`, `ColorId`, `UnitPrice`, `PaymentMethod`, `PaymentForm`, `DeliveryPreferredDate`, `DeliveryExpectedDate` required; `Quantity` range 1 to 100; `Notes` max 1000 |
| SalesService | GET | `/api/Sales/orders/{id}` | `SalesController.GetOrderById(int id)` | Path `id` | None visible |  |
| SalesService | POST | `/api/Sales/contracts` | `SalesController.CreateContract(CreateContractDto)` | Body | None visible | `OrderId`, `CustomerId`, `DealerId`, `SalespersonId`, `TotalAmount` required |
| SalesService | GET | `/api/Sales/contracts/{id}` | `SalesController.GetContractById(int id)` | Path `id` | None visible |  |

## ReportingService
Source: [ReportingService/Program.cs](../../ev-dealer-management/ev-dealer-management/ReportingService/Program.cs)

| Service | Method | Endpoint | Controller/action or mapping | Request body/query/path params | Auth | Validation / notes |
|---|---|---|---|---|---|---|
| ReportingService | GET | `/api/reports/demand-forecast` | minimal API lambda | Query `from`, `to` | None visible | `from`/`to` parsed as dates if present |
| ReportingService | POST | `/api/reports/synchronize-data` | minimal API lambda | None | None visible | Triggers data sync |
| ReportingService | GET | `/api/reports/debt-summary` | minimal API lambda | Query `dealerId`, `customerId`, `debtType`, `status`, `from`, `to` | None visible | `from`/`to` parsed as dates if present |
| ReportingService | GET | `/api/reports/debt-report` | minimal API lambda | Query `dealerId`, `from`, `to` | None visible | `from`/`to` parsed as dates if present |
| ReportingService | GET | `/api/reports/sales-by-dealer` | minimal API lambda | Query `dealerId`, `period`, `fromDate`, `toDate` | None visible | `period` defaults to `month` |
| ReportingService | GET | `/api/reports/inventory-trends` | minimal API lambda | None | None visible |  |
| ReportingService | GET | `/api/reports/sales-by-staff` | minimal API lambda | Query `from`, `to` | None visible | `from`/`to` parsed as dates if present |
| ReportingService | GET | `/api/reports/summary` | minimal API lambda | Query `type`, `from`, `to` | None visible | `from`/`to` parsed as dates if present |
| ReportingService | GET | `/api/reports/sales-by-region` | minimal API lambda | Query `from`, `to` | None visible | `from`/`to` parsed as dates if present |
| ReportingService | GET | `/api/reports/sales-proportion` | minimal API lambda | Query `from`, `to` | None visible | `from`/`to` parsed as dates if present |
| ReportingService | GET | `/api/reports/top-vehicles` | minimal API lambda | Query `limit` | None visible |  |
| ReportingService | POST | `/api/reports/export` | minimal API lambda | Body JSON | None visible | Body is read as raw JSON |
| ReportingService | GET | `/api/reports/sales-summary` | minimal API lambda | Query `fromDate`, `toDate`, `dealerId` | None visible |  |
| ReportingService | GET | `/api/reports/sales-summary/{id}` | minimal API lambda | Path `id` as `Guid` | None visible |  |
| ReportingService | GET | `/api/reports/inventory-summary` | minimal API lambda | Query `dealerId`, `vehicleId` | None visible |  |
| ReportingService | GET | `/api/reports/inventory-summary/{id}` | minimal API lambda | Path `id` as `Guid` | None visible |  |
| ReportingService | POST | `/api/reports/sales-summary` | minimal API lambda | Body `SalesSummary` | None visible | Runtime requires non-empty `DealerName`, `SalespersonName`, `Region` |
| ReportingService | POST | `/api/reports/inventory-summary` | minimal API lambda | Body `InventorySummary` | None visible | Runtime requires non-empty `VehicleName`, `DealerName`, `Region` |
| ReportingService | GET | `/weatherforecast` | utility route | None | None visible | Non-domain utility route |

## NotificationService
Sources: [NotificationController.cs](../../ev-dealer-management/ev-dealer-management/NotificationService/Controllers/NotificationController.cs), [Program.cs](../../ev-dealer-management/ev-dealer-management/NotificationService/Program.cs)

| Service | Method | Endpoint | Controller/action or mapping | Request body/query/path params | Auth | Validation / notes |
|---|---|---|---|---|---|---|
| NotificationService | POST | `/api/Notification/test-fcm` | `NotificationController.TestFcm(TestFcmRequest)` | Body | None visible | Plain string properties; no visible annotations |
| NotificationService | POST | `/api/Notification/subscribe-topic` | `NotificationController.SubscribeToTopic(SubscribeTopicRequest)` | Body | None visible | Plain string properties; no visible annotations |
| NotificationService | POST | `/api/Notification/unsubscribe-topic` | `NotificationController.UnsubscribeFromTopic(SubscribeTopicRequest)` | Body | None visible | Same shape as subscribe |
| NotificationService | POST | `/api/Notification/send-to-topic` | `NotificationController.SendToTopic(SendToTopicRequest)` | Body | None visible | Plain string properties; optional `Data` |
| NotificationService | POST | `/api/Notification/send-multicast` | `NotificationController.SendMulticast(SendMulticastRequest)` | Body | None visible | `DeviceTokens` list, `Title`, `Body`, optional `Data` |
| NotificationService | GET | `/health` | minimal API lambda | None | None visible | Service health endpoint |
