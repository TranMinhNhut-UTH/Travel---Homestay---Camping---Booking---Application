# Black-box Test Cases

## Auth & Users

### BB-U-001
- Test Case ID: BB-U-001
- Service: UserService
- Endpoint: `/api/auth/login`
- Method: POST
- Function/Feature: Login
- Technique: Happy
- Precondition: Existing valid user account
- Input: Valid username and password
- Test procedure: Send login request with valid credentials
- Expected result: `200 OK` with token/user payload
- Actual result: TBD
- Status: TBD

### BB-U-002
- Test Case ID: BB-U-002
- Service: UserService
- Endpoint: `/api/auth/login`
- Method: POST
- Function/Feature: Login validation
- Technique: Unhappy
- Precondition: None
- Input: Missing password or invalid password
- Test procedure: Send login request with incomplete/invalid credentials
- Expected result: `400 Bad Request`
- Actual result: TBD
- Status: TBD

### BB-U-003
- Test Case ID: BB-U-003
- Service: UserService
- Endpoint: `/api/users/{id}`
- Method: GET
- Function/Feature: Get current user or user detail
- Technique: Equivalent Partitioning
- Precondition: Valid JWT token
- Input: id = valid existing id / non-existing id / unauthorized user
- Test procedure: Request user detail for allowed and disallowed identities
- Expected result: `200 OK` for allowed access, `404/403` for missing or forbidden access
- Actual result: TBD
- Status: TBD

### BB-U-004
- Test Case ID: BB-U-004
- Service: UserService
- Endpoint: `/api/users/{id}`
- Method: PUT
- Function/Feature: Update user profile
- Technique: BVA
- Precondition: Valid JWT token, editable user exists
- Input: Empty email, valid email, overlong name, boundary-length payloads
- Test procedure: Submit update with boundary values on `Email` and `FullName`
- Expected result: Validation error for invalid data; `200 OK` or success payload for valid boundary values
- Actual result: TBD
- Status: TBD

### BB-U-005
- Test Case ID: BB-U-005
- Service: UserService
- Endpoint: `/api/admin/users`
- Method: POST
- Function/Feature: Create approved admin user
- Technique: Happy
- Precondition: Admin JWT token
- Input: Valid registration body
- Test procedure: Create approved user as admin
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-U-006
- Test Case ID: BB-U-006
- Service: UserService
- Endpoint: `/api/auth/register`
- Method: POST
- Function/Feature: Register new user
- Technique: Happy
- Precondition: None
- Input: `{"username":"sales01","email":"sales01@example.com","fullName":"Sales User","password":"P@ssw0rd!","role":"Sales","dealerId":1}`
- Test procedure: Submit registration body with valid data
- Expected result: `201 Created` with created user payload
- Actual result: TBD
- Status: TBD

### BB-U-007
- Test Case ID: BB-U-007
- Service: UserService
- Endpoint: `/api/auth/register`
- Method: POST
- Function/Feature: Register validation
- Technique: Equivalent Partitioning
- Precondition: None
- Input: `email=valid@example.com` / `email=abc` / `email=abc@` / `email=@mail.com` / `email=""`; `password=P@ssw0rd!` / `password=""`; `username=sales02`
- Test procedure: Submit multiple registration payloads with valid and invalid email/password partitions
- Expected result: Valid email/password accepted; invalid email or empty password rejected with `400 Bad Request`
- Actual result: TBD
- Status: TBD

### BB-U-008
- Test Case ID: BB-U-008
- Service: UserService
- Endpoint: `/api/auth/reset-password`
- Method: POST
- Function/Feature: Reset password
- Technique: BVA
- Precondition: Reset token exists or token can be simulated
- Input: `token="reset-token"`, `newPassword="NewP@ssw0rd!"`; invalid boundaries: `token=""`, `newPassword=""`, `newPassword` length 1, `newPassword` very long string
- Test procedure: Submit reset request with valid and boundary invalid token/password values
- Expected result: Valid token/password accepted; empty or malformed values rejected with `400 Bad Request`
- Actual result: TBD
- Status: TBD

## Vehicles & Dealers

### BB-V-001
- Test Case ID: BB-V-001
- Service: VehicleService
- Endpoint: `/api/Vehicles`
- Method: GET
- Function/Feature: List vehicles with pagination
- Technique: Happy
- Precondition: At least one vehicle exists
- Input: Default query or valid pagination query
- Test procedure: Request vehicle list
- Expected result: `200 OK` with paginated payload
- Actual result: TBD
- Status: TBD

### BB-V-002
- Test Case ID: BB-V-002
- Service: VehicleService
- Endpoint: `/api/Vehicles`
- Method: GET
- Function/Feature: Search/filter validation
- Technique: Equivalent Partitioning
- Precondition: Vehicles exist with different prices/types
- Input: `MinPrice`, `MaxPrice`, `DealerId`, `Type`, `Search`
- Test procedure: Query using valid and invalid filter combinations
- Expected result: Matching filtered results or empty list when no match
- Actual result: TBD
- Status: TBD

### BB-V-003
- Test Case ID: BB-V-003
- Service: VehicleService
- Endpoint: `/api/Vehicles`
- Method: POST
- Function/Feature: Create vehicle
- Technique: Happy
- Precondition: Valid dealer exists
- Input: Vehicle payload with valid `Model`, `Type`, `Price`, `BatteryCapacity`, `Range`, `StockQuantity`, `DealerId`
- Test procedure: Create a vehicle using JSON or multipart form-data
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-V-004
- Test Case ID: BB-V-004
- Service: VehicleService
- Endpoint: `/api/Vehicles`
- Method: POST
- Function/Feature: Vehicle creation validation
- Technique: Unhappy
- Precondition: None
- Input: Missing required field or negative numeric value
- Test procedure: Submit invalid vehicle payload
- Expected result: Validation error or `400 Bad Request`
- Actual result: TBD
- Status: TBD

### BB-V-005
- Test Case ID: BB-V-005
- Service: VehicleService
- Endpoint: `/api/Vehicles/{id}/reserve`
- Method: POST
- Function/Feature: Reserve vehicle
- Technique: Happy
- Precondition: Vehicle exists and stock available
- Input: Valid reservation body
- Test procedure: Reserve an available vehicle
- Expected result: `200 OK` with reservation payload
- Actual result: TBD
- Status: TBD

### BB-V-006
- Test Case ID: BB-V-006
- Service: VehicleService
- Endpoint: `/api/Vehicles/{id}/reserve`
- Method: POST
- Function/Feature: Reservation boundary check
- Technique: BVA
- Precondition: Vehicle exists
- Input: `Quantity` at 1, 100, 0, 101
- Test procedure: Submit boundary quantities
- Expected result: `1` and `100` accepted if stock allows; `0` and `101` rejected
- Actual result: TBD
- Status: TBD

### BB-V-007
- Test Case ID: BB-V-007
- Service: VehicleService
- Endpoint: `/api/Dealers`
- Method: POST
- Function/Feature: Create dealer
- Technique: Happy
- Precondition: None
- Input: Valid dealer payload
- Test procedure: Create dealer
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-V-008
- Test Case ID: BB-V-008
- Service: VehicleService
- Endpoint: `/api/Dealers/{id}`
- Method: PUT
- Function/Feature: Update dealer
- Technique: Unhappy
- Precondition: Dealer missing or invalid input
- Input: Invalid email or overlong fields
- Test procedure: Update dealer with invalid data
- Expected result: Validation failure or `404 Not Found` if dealer does not exist
- Actual result: TBD
- Status: TBD

### BB-V-009
- Test Case ID: BB-V-009
- Service: VehicleService
- Endpoint: `/api/Vehicles`
- Method: POST
- Function/Feature: Create vehicle
- Technique: Equivalent Partitioning
- Precondition: Dealer exists
- Input: Valid `Model=VinFast VF 8`, `Type=SUV`, `Price=1200000000`, `BatteryCapacity=87.7`, `Range=420`, `StockQuantity=5`, `DealerId=1`; invalid partitions: empty model, empty type, negative price, negative range, negative stock
- Test procedure: Submit one valid payload and multiple invalid payloads for each partition
- Expected result: Valid payload returns `201 Created`; invalid partitions return validation error or `400 Bad Request`
- Actual result: TBD
- Status: TBD

### BB-V-010
- Test Case ID: BB-V-010
- Service: VehicleService
- Endpoint: `/api/Vehicles/{id}/reserve`
- Method: POST
- Function/Feature: Reserve vehicle
- Technique: Equivalent Partitioning
- Precondition: Vehicle exists and stock available
- Input: `CustomerName=Nguyen Van A`, `CustomerEmail=customer@example.com`, `CustomerPhone=+84912345678`, `ColorVariantId=1`, `Notes=Reserve for demo`, `Quantity=1`
- Test procedure: Reserve with valid values and then with invalid email/phone partitions such as `customer@example`, `abc`, and empty name
- Expected result: Valid partition returns `200 OK`; invalid email/phone/name partitions rejected
- Actual result: TBD
- Status: TBD

### BB-V-011
- Test Case ID: BB-V-011
- Service: VehicleService
- Endpoint: `/api/Vehicles/{id}/reserve`
- Method: POST
- Function/Feature: Reserve quantity boundary
- Technique: BVA
- Precondition: Vehicle exists
- Input: `Quantity=0`, `Quantity=1`, `Quantity=100`, `Quantity=101`
- Test procedure: Submit reserve requests at quantity boundaries
- Expected result: `1` and `100` accepted if stock allows; `0` and `101` rejected with validation or business error
- Actual result: TBD
- Status: TBD

### BB-V-012
- Test Case ID: BB-V-012
- Service: VehicleService
- Endpoint: `/api/Dealers`
- Method: POST
- Function/Feature: Create dealer
- Technique: Happy
- Precondition: None
- Input: `{"name":"VinFast Ha Noi","region":"Ha Noi","contact":"0900000000","email":"dealer@example.com","address":"123 Demo Street"}`
- Test procedure: Submit valid dealer body
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-V-013
- Test Case ID: BB-V-013
- Service: VehicleService
- Endpoint: `/api/Dealers/{id}`
- Method: PUT
- Function/Feature: Update dealer validation
- Technique: Equivalent Partitioning
- Precondition: Dealer exists
- Input: Valid `email=dealer.updated@example.com`; invalid partitions: `email=abc`, `email=abc@`, `email=@mail.com`, empty `name`, overlong `contact`
- Test procedure: Update dealer with one valid payload and invalid field partitions
- Expected result: Valid update returns `200 OK`; invalid partitions return validation error or `400 Bad Request`
- Actual result: TBD
- Status: TBD

## Customers & Test Drives

### BB-C-001
- Test Case ID: BB-C-001
- Service: CustomerService
- Endpoint: `/api/Customers`
- Method: POST
- Function/Feature: Create customer
- Technique: Happy
- Precondition: Valid dealer exists
- Input: Valid name, email, dealerId, phone
- Test procedure: Submit create customer request
- Expected result: `200 OK`
- Actual result: TBD
- Status: TBD

### BB-C-002
- Test Case ID: BB-C-002
- Service: CustomerService
- Endpoint: `/api/Customers`
- Method: POST
- Function/Feature: Customer validation
- Technique: Unhappy
- Precondition: None
- Input: Missing required name/email/dealerId
- Test procedure: Submit invalid payload
- Expected result: `400 Bad Request` or `409 Conflict` for duplicate email
- Actual result: TBD
- Status: TBD

### BB-C-003
- Test Case ID: BB-C-003
- Service: CustomerService
- Endpoint: `/api/Customers/{id}`
- Method: GET
- Function/Feature: Get customer by id
- Technique: Equivalent Partitioning
- Precondition: Existing and non-existing customer ids
- Input: valid id / invalid id / missing id
- Test procedure: Query customer detail for each partition
- Expected result: `200 OK` for valid existing id, `404 Not Found` otherwise
- Actual result: TBD
- Status: TBD

### BB-C-004
- Test Case ID: BB-C-004
- Service: CustomerService
- Endpoint: `/api/TestDrives`
- Method: POST
- Function/Feature: Create test drive
- Technique: Happy
- Precondition: Existing customer, vehicle, dealer
- Input: Valid `CustomerId`, `VehicleId`, `DealerId`, `AppointmentDate`
- Test procedure: Create test drive
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-C-005
- Test Case ID: BB-C-005
- Service: CustomerService
- Endpoint: `/api/TestDrives`
- Method: POST
- Function/Feature: Appointment date boundary
- Technique: BVA
- Precondition: Existing customer, vehicle, dealer
- Input: Appointment date just before/after expected scheduling boundary
- Test procedure: Submit dates in the past and future edge cases
- Expected result: Past date handling depends on backend; valid future date accepted, invalid date rejected if validation exists
- Actual result: TBD
- Status: TBD

### BB-C-006
- Test Case ID: BB-C-006
- Service: CustomerService
- Endpoint: `/api/Complaints`
- Method: POST
- Function/Feature: Create complaint
- Technique: Happy
- Precondition: Existing customer
- Input: Valid customer id, type, title, description, optional related ids
- Test procedure: Create complaint
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-C-007
- Test Case ID: BB-C-007
- Service: CustomerService
- Endpoint: `/api/Complaints`
- Method: POST
- Function/Feature: Complaint validation
- Technique: Unhappy
- Precondition: None
- Input: Non-existing customer id or missing description
- Test procedure: Submit invalid complaint payload
- Expected result: `400 Bad Request`
- Actual result: TBD
- Status: TBD

### BB-C-008
- Test Case ID: BB-C-008
- Service: CustomerService
- Endpoint: `/api/Customers`
- Method: POST
- Function/Feature: Create customer
- Technique: Happy
- Precondition: Valid dealer exists
- Input: `{"name":"Nguyen Van B","email":"customer@example.com","phone":"+84923456789","address":"Ha Noi","dealerId":1,"status":"active"}`
- Test procedure: Submit valid customer create request
- Expected result: `200 OK`
- Actual result: TBD
- Status: TBD

### BB-C-009
- Test Case ID: BB-C-009
- Service: CustomerService
- Endpoint: `/api/Customers`
- Method: POST
- Function/Feature: Customer equivalent partitioning
- Technique: Equivalent Partitioning
- Precondition: None
- Input: `name=Nguyen Van B` / `name=""`; `email=customer@example.com` / `email=abc` / `email=abc@` / `email=@mail.com`; `dealerId=1` / `dealerId=0`; `phone=+84923456789` / `phone=abc`
- Test procedure: Submit customer payloads across valid and invalid partitions
- Expected result: Valid partition accepted; invalid partitions rejected with `400 Bad Request` or `409 Conflict` for duplicate email
- Actual result: TBD
- Status: TBD

### BB-C-010
- Test Case ID: BB-C-010
- Service: CustomerService
- Endpoint: `/api/Customers/{id}`
- Method: PUT
- Function/Feature: Update customer
- Technique: Happy
- Precondition: Customer exists
- Input: `{"name":"Nguyen Van B Updated","email":"customer.updated@example.com","phone":"+84923456780","address":"Hai Phong","dealerId":1,"status":"active"}`
- Test procedure: Update customer with valid data
- Expected result: `204 No Content`
- Actual result: TBD
- Status: TBD

### BB-C-011
- Test Case ID: BB-C-011
- Service: CustomerService
- Endpoint: `/api/TestDrives`
- Method: POST
- Function/Feature: Create test drive
- Technique: Happy
- Precondition: Existing customer, vehicle, dealer
- Input: `{"customerId":1,"vehicleId":1,"dealerId":1,"appointmentDate":"2026-06-01T09:00:00Z","notes":"Morning slot","status":"Scheduled"}`
- Test procedure: Create test drive with valid future appointment
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-C-012
- Test Case ID: BB-C-012
- Service: CustomerService
- Endpoint: `/api/TestDrives`
- Method: POST
- Function/Feature: Appointment date equivalence
- Technique: Equivalent Partitioning
- Precondition: Existing customer, vehicle, dealer
- Input: `appointmentDate=2026-06-01T09:00:00Z` valid future date; invalid partitions: empty date, malformed date, past date `2020-01-01T00:00:00Z`
- Test procedure: Submit valid and invalid appointment date partitions
- Expected result: Valid date accepted; invalid partitions rejected with `400 Bad Request` or business error
- Actual result: TBD
- Status: TBD

### BB-C-013
- Test Case ID: BB-C-013
- Service: CustomerService
- Endpoint: `/api/TestDrives/{id}`
- Method: PUT
- Function/Feature: Update test drive
- Technique: Happy
- Precondition: Test drive exists
- Input: `{"appointmentDate":"2026-06-02T10:00:00Z","status":"Completed","notes":"Completed demo"}`
- Test procedure: Update test drive with valid body
- Expected result: `204 No Content`
- Actual result: TBD
- Status: TBD

### BB-C-014
- Test Case ID: BB-C-014
- Service: CustomerService
- Endpoint: `/api/TestDrives/{id}`
- Method: PUT
- Function/Feature: Update test drive status boundary
- Technique: BVA
- Precondition: Test drive exists
- Input: `status="Scheduled"`, `status="Completed"`, `status=""`, `status` longer than 50 characters
- Test procedure: Update status with boundary and invalid length values
- Expected result: Valid status accepted; empty or overlong status rejected
- Actual result: TBD
- Status: TBD

### BB-C-015
- Test Case ID: BB-C-015
- Service: CustomerService
- Endpoint: `/api/Complaints`
- Method: POST
- Function/Feature: Create complaint
- Technique: Happy
- Precondition: Existing customer
- Input: `{"customerId":1,"type":"Bao hanh","title":"Remote not working","description":"Customer reports a broken remote","assignedToStaffID":10,"priority":"High","relatedOrderID":1,"relatedVehicleID":1}`
- Test procedure: Create complaint with valid body
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-C-016
- Test Case ID: BB-C-016
- Service: CustomerService
- Endpoint: `/api/Complaints/{id}`
- Method: PUT
- Function/Feature: Update complaint
- Technique: Equivalent Partitioning
- Precondition: Complaint exists
- Input: Valid `status=In Progress`; invalid partitions: empty `title`, overlong `title`, empty `description`, `type` longer than 50 characters
- Test procedure: Update complaint with valid and invalid partitions
- Expected result: Valid update returns `204 No Content`; invalid partitions rejected or result in validation error
- Actual result: TBD
- Status: TBD

## Sales Core

### BB-S-001
- Test Case ID: BB-S-001
- Service: SalesService
- Endpoint: `/api/Quotes`
- Method: GET
- Function/Feature: List quotes
- Technique: Happy
- Precondition: Quotes exist
- Input: None
- Test procedure: Request all quotes
- Expected result: `200 OK` with collection payload
- Actual result: TBD
- Status: TBD

### BB-S-002
- Test Case ID: BB-S-002
- Service: SalesService
- Endpoint: `/api/Quotes`
- Method: POST
- Function/Feature: Create quote
- Technique: Happy
- Precondition: Related customer, dealer, vehicle exist
- Input: Valid query parameters for `CreateQuoteDto`
- Test procedure: Submit quote creation request
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-S-003
- Test Case ID: BB-S-003
- Service: SalesService
- Endpoint: `/api/Quotes`
- Method: POST
- Function/Feature: Quote boundary validation
- Technique: BVA
- Precondition: Valid related entities exist
- Input: `Quantity` = 1, 100, 0, 101
- Test procedure: Submit quote creation requests at boundaries
- Expected result: Quantity 1 and 100 accepted; 0 and 101 rejected
- Actual result: TBD
- Status: TBD

### BB-S-004
- Test Case ID: BB-S-004
- Service: SalesService
- Endpoint: `/api/Orders/complete`
- Method: POST
- Function/Feature: Complete order
- Technique: Happy
- Precondition: Valid quote exists, customer and dealer data available
- Input: Valid `CreateOrderRequest`
- Test procedure: Submit full order completion body
- Expected result: `200 OK` with success payload and order number
- Actual result: TBD
- Status: TBD

### BB-S-005
- Test Case ID: BB-S-005
- Service: SalesService
- Endpoint: `/api/Orders/complete`
- Method: POST
- Function/Feature: Order validation
- Technique: Unhappy
- Precondition: None
- Input: Missing `CustomerEmail` or `CustomerName`, or zero/negative total price scenario
- Test procedure: Submit invalid order body
- Expected result: `400 Bad Request`
- Actual result: TBD
- Status: TBD

### BB-S-006
- Test Case ID: BB-S-006
- Service: SalesService
- Endpoint: `/api/Orders/{id}/status`
- Method: PUT
- Function/Feature: Update order status
- Technique: Equivalent Partitioning
- Precondition: Existing order exists
- Input: Valid status values and invalid status string
- Test procedure: Update order status with allowed and malformed values
- Expected result: Valid status accepted; invalid status handled according to backend logic
- Actual result: TBD
- Status: TBD

### BB-S-007
- Test Case ID: BB-S-007
- Service: SalesService
- Endpoint: `/api/Contracts`
- Method: POST
- Function/Feature: Create contract
- Technique: Happy
- Precondition: Existing order exists and contract not yet created
- Input: Valid order/customer/salesperson/date payload
- Test procedure: Create contract
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-S-008
- Test Case ID: BB-S-008
- Service: SalesService
- Endpoint: `/api/Contracts/{id}/status`
- Method: PUT
- Function/Feature: Update contract status
- Technique: Unhappy
- Precondition: Existing or missing contract depending on branch
- Input: Status `Approved`, `Rejected`, or invalid value
- Test procedure: Update contract status for each partition
- Expected result: Approved updates linked order; Rejected removes contract/order; missing contract returns `404`
- Actual result: TBD
- Status: TBD

### BB-S-009
- Test Case ID: BB-S-009
- Service: SalesService
- Endpoint: `/api/Promotions`
- Method: POST
- Function/Feature: Create promotion
- Technique: Happy
- Precondition: None
- Input: Valid promotion payload
- Test procedure: Create promotion
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-S-010
- Test Case ID: BB-S-010
- Service: SalesService
- Endpoint: `/api/Payments`
- Method: POST
- Function/Feature: Create payment
- Technique: Happy
- Precondition: Existing order id
- Input: Valid order id, amount, payment method, date, status
- Test procedure: Create payment
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-S-011
- Test Case ID: BB-S-011
- Service: SalesService
- Endpoint: `/api/Deliveries`
- Method: POST
- Function/Feature: Create delivery
- Technique: Happy
- Precondition: Existing order id
- Input: Valid delivery payload
- Test procedure: Create delivery
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-S-012
- Test Case ID: BB-S-012
- Service: SalesService
- Endpoint: `/api/Quotes`
- Method: POST
- Function/Feature: Create quote
- Technique: Equivalent Partitioning
- Precondition: Related customer, dealer, and vehicle exist
- Input: Valid `CustomerId=1`, `DealerId=1`, `SalespersonId=1`, `VehicleId=1`, `ColorId=1`, `Quantity=1`, `UnitPrice=1200000000`, `TotalPrice=1200000000`, `Status=Active`, `Notes=Demo quote`; invalid partitions: missing customer/dealer id, `Status=""`, `Quantity=0`, `Quantity=101`
- Test procedure: Submit one valid quote and invalid partitions for required fields and quantity
- Expected result: Valid payload returns `201 Created`; invalid partitions rejected with validation error
- Actual result: TBD
- Status: TBD

### BB-S-013
- Test Case ID: BB-S-013
- Service: SalesService
- Endpoint: `/api/Quotes/{id}/status`
- Method: PUT
- Function/Feature: Update quote status
- Technique: Happy
- Precondition: Quote exists
- Input: `{"status":"ConvertedToOrder"}`
- Test procedure: Update quote status to a valid terminal state
- Expected result: `204 No Content`
- Actual result: TBD
- Status: TBD

### BB-S-014
- Test Case ID: BB-S-014
- Service: SalesService
- Endpoint: `/api/Quotes/{id}/status`
- Method: PUT
- Function/Feature: Quote status validation
- Technique: Equivalent Partitioning
- Precondition: Quote exists
- Input: `status=Active`, `status=Cancelled`, `status=ConvertedToOrder`; invalid: `status=""`, `status` over 50 chars
- Test procedure: Update quote status with valid and invalid partitions
- Expected result: Valid status accepted; invalid status rejected with validation error or `400 Bad Request`
- Actual result: TBD
- Status: TBD

### BB-S-015
- Test Case ID: BB-S-015
- Service: SalesService
- Endpoint: `/api/Orders/complete`
- Method: POST
- Function/Feature: Complete order
- Technique: Happy
- Precondition: Valid quote exists and the referenced customer/dealer/vehicle data is present
- Input: `QuoteId=1`, `CustomerId=1`, `CustomerEmail=customer@example.com`, `CustomerName=Nguyen Van B`, `DealerId=1`, `SalespersonId=1`, `PaymentMethod=Cash`, `DeliveryDate=2026-06-10T09:00:00Z`, `EstimatedDeliveryDate=2026-06-15T09:00:00Z`, `VehicleId=1`, `VehicleVariantId=1`, `ColorId=1`, `Quantity=1`, `UnitPrice=1200000000`, `DiscountAmount=0`, `DiscountPercent=0`
- Test procedure: Submit full order completion body
- Expected result: `200 OK` with success=true and generated order number
- Actual result: TBD
- Status: TBD

### BB-S-016
- Test Case ID: BB-S-016
- Service: SalesService
- Endpoint: `/api/Orders/complete`
- Method: POST
- Function/Feature: Order completion validation
- Technique: Equivalent Partitioning
- Precondition: None
- Input: valid `CustomerEmail` and `CustomerName`; invalid partitions: empty `CustomerEmail`, empty `CustomerName`, `QuoteId=0`, `UnitPrice=0`, `TotalPrice=0`, discount making total negative
- Test procedure: Submit separate invalid payloads for each partition
- Expected result: `400 Bad Request` for missing name/email or zero/negative total price
- Actual result: TBD
- Status: TBD

### BB-S-017
- Test Case ID: BB-S-017
- Service: SalesService
- Endpoint: `/api/Orders/{id}/status`
- Method: PUT
- Function/Feature: Update order status
- Technique: Happy
- Precondition: Order exists
- Input: `{"status":"ReadyForDelivery"}`
- Test procedure: Update order status using a valid status
- Expected result: `200 OK` with message
- Actual result: TBD
- Status: TBD

### BB-S-018
- Test Case ID: BB-S-018
- Service: SalesService
- Endpoint: `/api/Orders/{id}/status`
- Method: PUT
- Function/Feature: Order status equivalence
- Technique: Equivalent Partitioning
- Precondition: Order exists
- Input: `status=Pending`, `status=ReadyForDelivery`, `status=Completed`; invalid: `status=""`, `status=UnknownValue`
- Test procedure: Update order status with allowed and invalid partitions
- Expected result: Allowed statuses processed; invalid status handled per backend logic and should not corrupt order state
- Actual result: TBD
- Status: TBD

### BB-S-019
- Test Case ID: BB-S-019
- Service: SalesService
- Endpoint: `/api/Contracts`
- Method: POST
- Function/Feature: Create contract
- Technique: Happy
- Precondition: Existing order exists and no contract has been created for it
- Input: `{"orderId":1,"customerId":1,"salespersonId":"1","contractDate":"2026-06-10T09:00:00Z","depositAmountReceived":true,"termsAndConditions":"Demo contract"}`
- Test procedure: Create contract using a valid order id
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-S-020
- Test Case ID: BB-S-020
- Service: SalesService
- Endpoint: `/api/Contracts`
- Method: POST
- Function/Feature: Contract create validation
- Technique: Equivalent Partitioning
- Precondition: Order exists
- Input: valid `SalespersonId="1"`; invalid partitions: `SalespersonId="abc"`, missing `OrderId`, missing `ContractDate`, duplicate `OrderId`
- Test procedure: Submit valid and invalid contract payloads
- Expected result: Valid payload accepted; invalid salesperson id or missing required data rejected with `400 Bad Request`; duplicate order rejected
- Actual result: TBD
- Status: TBD

### BB-S-021
- Test Case ID: BB-S-021
- Service: SalesService
- Endpoint: `/api/Contracts/{id}/status`
- Method: PUT
- Function/Feature: Update contract status
- Technique: Happy
- Precondition: Contract exists
- Input: `{"status":"Approved"}`
- Test procedure: Approve the contract
- Expected result: `200 OK` and linked order status updated appropriately
- Actual result: TBD
- Status: TBD

### BB-S-022
- Test Case ID: BB-S-022
- Service: SalesService
- Endpoint: `/api/Contracts/{id}/status`
- Method: PUT
- Function/Feature: Contract status branching
- Technique: Unhappy
- Precondition: Contract exists or is missing
- Input: `{"status":"Rejected"}` for rejection branch; invalid `status=""`; missing contract id
- Test procedure: Update status with rejection and invalid inputs
- Expected result: Rejected case removes contract/order and returns success message; invalid/missing cases return validation error or `404 Not Found`
- Actual result: TBD
- Status: TBD

### BB-S-023
- Test Case ID: BB-S-023
- Service: SalesService
- Endpoint: `/api/Payments`
- Method: POST
- Function/Feature: Create payment
- Technique: Happy
- Precondition: Existing order id
- Input: `{"orderId":"11111111-1111-1111-1111-111111111111","amount":1200000000,"paymentDate":"2026-06-10T09:00:00Z","paymentMethod":"Cash","status":"Completed","transactionId":"TXN-001","notes":"Demo payment"}`
- Test procedure: Create payment using a valid body
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-S-024
- Test Case ID: BB-S-024
- Service: SalesService
- Endpoint: `/api/Payments`
- Method: POST
- Function/Feature: Payment amount boundary
- Technique: BVA
- Precondition: Existing order id
- Input: `Amount=0.01`, `Amount=10000000000`, `Amount=0`, `Amount=-1`
- Test procedure: Submit payment requests at lower/upper valid boundaries and invalid boundaries
- Expected result: `0.01` and `10000000000` accepted; `0` and negative amount rejected
- Actual result: TBD
- Status: TBD

### BB-S-025
- Test Case ID: BB-S-025
- Service: SalesService
- Endpoint: `/api/Deliveries`
- Method: POST
- Function/Feature: Create delivery
- Technique: Happy
- Precondition: Existing order id
- Input: `{"orderId":"11111111-1111-1111-1111-111111111111","estimatedDeliveryDate":"2026-06-15T09:00:00Z","status":"Scheduled","notes":"Demo delivery"}`
- Test procedure: Create delivery with valid body
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-S-026
- Test Case ID: BB-S-026
- Service: SalesService
- Endpoint: `/api/Deliveries`
- Method: POST
- Function/Feature: Delivery validation
- Technique: Equivalent Partitioning
- Precondition: Existing order id
- Input: valid `TrackingNumber` not used in current model; invalid partitions: missing order id, missing estimated delivery date, empty status, status longer than 50 chars
- Test procedure: Submit valid and invalid delivery payloads
- Expected result: Valid payload accepted; invalid partitions rejected with `400 Bad Request`
- Actual result: TBD
- Status: TBD

### BB-S-027
- Test Case ID: BB-S-027
- Service: SalesService
- Endpoint: `/api/Promotions`
- Method: POST
- Function/Feature: Create promotion
- Technique: Happy
- Precondition: None
- Input: `{"name":"SUMMER2026","description":"Summer promotion","discountType":"Percent","discountValue":10,"startDate":"2026-06-01T00:00:00Z","endDate":"2026-08-31T23:59:59Z"}`
- Test procedure: Create promotion with valid body
- Expected result: `201 Created`
- Actual result: TBD
- Status: TBD

### BB-S-028
- Test Case ID: BB-S-028
- Service: SalesService
- Endpoint: `/api/Promotions`
- Method: POST
- Function/Feature: Promotion discount boundary
- Technique: BVA
- Precondition: None
- Input: `DiscountValue=0.01`, `DiscountValue=1000000000`, `DiscountValue=0`, `DiscountValue=1000000000.01`
- Test procedure: Submit promotion payloads at min/max and out-of-range discount values
- Expected result: `0.01` and `1000000000` accepted; `0` and over max rejected
- Actual result: TBD
- Status: TBD

## Reports

### BB-R-001
- Test Case ID: BB-R-001
- Service: ReportingService
- Endpoint: `/api/reports/demand-forecast`
- Method: GET
- Function/Feature: Demand forecast report
- Technique: Happy
- Precondition: ReportingService running and data synchronized
- Input: Valid `from` and `to` dates
- Test procedure: Request report with date range
- Expected result: `200 OK` with forecast payload
- Actual result: TBD
- Status: TBD

### BB-R-002
- Test Case ID: BB-R-002
- Service: ReportingService
- Endpoint: `/api/reports/synchronize-data`
- Method: POST
- Function/Feature: Synchronize reporting data
- Technique: Happy
- Precondition: Reporting data source reachable
- Input: None
- Test procedure: Trigger synchronization
- Expected result: `200 OK`
- Actual result: TBD
- Status: TBD

### BB-R-003
- Test Case ID: BB-R-003
- Service: ReportingService
- Endpoint: `/api/reports/debt-summary`
- Method: GET
- Function/Feature: Debt summary report
- Technique: Equivalent Partitioning
- Precondition: Data exists
- Input: `dealerId`, `customerId`, `status`, date range combinations
- Test procedure: Query with and without optional filters
- Expected result: `200 OK` with filtered results
- Actual result: TBD
- Status: TBD

### BB-R-004
- Test Case ID: BB-R-004
- Service: ReportingService
- Endpoint: `/api/reports/top-vehicles`
- Method: GET
- Function/Feature: Top vehicles report
- Technique: BVA
- Precondition: Data exists
- Input: `limit` = 1, 10, 0, negative value
- Test procedure: Request top vehicles report with boundary values
- Expected result: Valid positive limits accepted; invalid limits handled per backend logic
- Actual result: TBD
- Status: TBD

### BB-R-005
- Test Case ID: BB-R-005
- Service: ReportingService
- Endpoint: `/api/reports/export`
- Method: POST
- Function/Feature: Export report
- Technique: Happy
- Precondition: Reporting data exists
- Input: Valid export payload
- Test procedure: Export report
- Expected result: `200 OK` with export response
- Actual result: TBD
- Status: TBD

### BB-R-006
- Test Case ID: BB-R-006
- Service: ReportingService
- Endpoint: `/api/reports/demand-forecast`
- Method: GET
- Function/Feature: Demand forecast date validation
- Technique: Equivalent Partitioning
- Precondition: ReportingService running
- Input: valid `from=2026-01-01`, `to=2026-12-31`; invalid partitions: `from=abc`, `to=abc`, empty date values
- Test procedure: Request demand forecast with valid and invalid date partitions
- Expected result: Valid date range accepted; invalid dates rejected or handled with validation error
- Actual result: TBD
- Status: TBD

### BB-R-007
- Test Case ID: BB-R-007
- Service: ReportingService
- Endpoint: `/api/reports/top-vehicles`
- Method: GET
- Function/Feature: Top vehicles limit boundary
- Technique: BVA
- Precondition: Reporting data exists
- Input: `limit=1`, `limit=10`, `limit=0`, `limit=-1`
- Test procedure: Request top vehicles report with boundary limits
- Expected result: Positive limits accepted; zero or negative limit rejected or handled as invalid
- Actual result: TBD
- Status: TBD

### BB-R-008
- Test Case ID: BB-R-008
- Service: ReportingService
- Endpoint: `/api/reports/export`
- Method: POST
- Function/Feature: Export report input equivalence
- Technique: Equivalent Partitioning
- Precondition: Reporting data exists
- Input: valid body `{type:"sales",from:"2026-01-01",to:"2026-12-31"}`; invalid partitions: empty `type`, malformed JSON, `from=abc`, `to=abc`
- Test procedure: Submit valid and invalid export payloads
- Expected result: Valid export request accepted; invalid payloads rejected or return a clear error response
- Actual result: TBD
- Status: TBD

### BB-R-009
- Test Case ID: BB-R-009
- Service: ReportingService
- Endpoint: `/api/reports/sales-summary`
- Method: GET
- Function/Feature: Sales summary filter validation
- Technique: Equivalent Partitioning
- Precondition: Reporting data exists
- Input: valid `dealerId=1`, `fromDate=2026-01-01`, `toDate=2026-12-31`; invalid partitions: missing dates, malformed dates, missing dealer id when required by scenario
- Test procedure: Request sales summary with valid and invalid filter partitions
- Expected result: Valid filters accepted; invalid filters rejected or handled gracefully
- Actual result: TBD
- Status: TBD

### BB-R-010
- Test Case ID: BB-R-010
- Service: ReportingService
- Endpoint: `/api/reports/inventory-summary`
- Method: GET
- Function/Feature: Inventory summary filter validation
- Technique: Equivalent Partitioning
- Precondition: Reporting data exists
- Input: valid `dealerId=1`, `vehicleId=1`; invalid partitions: `dealerId=0`, `vehicleId=0`, missing ids
- Test procedure: Request inventory summary with valid and invalid partitions
- Expected result: Valid ids accepted; invalid ids rejected or return empty/clear result per backend behavior
- Actual result: TBD
- Status: TBD

## Gateway / Routing Checks

### BB-G-001
- Test Case ID: BB-G-001
- Service: APIGatewayService
- Endpoint: `/api/Orders/complete`
- Method: POST
- Function/Feature: Gateway forwards order completion
- Technique: Happy
- Precondition: SalesService and gateway running
- Input: Valid order completion payload
- Test procedure: Call through gateway base URL
- Expected result: `200 OK` routed to SalesService
- Actual result: TBD
- Status: TBD

### BB-G-002
- Test Case ID: BB-G-002
- Service: APIGatewayService
- Endpoint: `/api/reports/demand-forecast`
- Method: GET
- Function/Feature: Gateway target validation
- Technique: Unhappy
- Precondition: Gateway running
- Input: Valid report query parameters
- Test procedure: Call report through gateway URL
- Expected result: Route should be unavailable or documented as direct-service only if not proxied
- Actual result: TBD
- Status: TBD
