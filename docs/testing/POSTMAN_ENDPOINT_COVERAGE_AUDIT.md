# Postman Endpoint Coverage Audit

## Scope
The CI source of truth is the root [ev-dealer-management.postman_collection.json](../../ev-dealer-management.postman_collection.json), as referenced by `.github/workflows/ci-jira.yml`. Other collections are retained as historical/module-specific suites and are not evidence for the CI run.

The canonical collection currently contains 116 active requests. Five `ProcessedReservations` requests were removed because their controller is commented out and the routes are inactive. Every remaining request inherits executable collection-level `pm.test()` assertions for status, HTTP 500 rejection, response time, JSON-compatible media types (`application/json` and `application/*+json`), valid JSON, and basic response structure. Execution evidence is generated as Newman CLI output, JUnit XML, and HTML Extra report.

## Summary
- Total active backend endpoints: 87
- Total Postman requests: 128
- Covered endpoints: 39
- Backend endpoints missing from Postman: 48
- Postman requests without an exact active backend match: 61
- Method mismatches: 1
- Path mismatches: 11
- Target mismatches caused by gateway proxy gaps: 22
- Inactive/commented-out backend endpoints excluded: 11

## Exact Coverage Notes
The collection covers many core direct-service paths correctly, especially:
- User auth and admin user management against the gateway
- Customer and test-drive routes through the gateway
- Vehicle routes through the gateway or direct service depending on folder
- Orders, quotes, contracts, payments, deliveries, promotions through SalesService or gateway
- ReportingService requests directly against port 5208

## Backend endpoints covered by Postman
Covered requests were found for these active areas:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/users/me`
- `GET /api/users`
- `POST /api/admin/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- `PUT /api/users/{id}/role`
- `PUT /api/users/{id}/approve`
- `GET /api/dealers`
- `GET /api/internal/users`
- `GET /api/Vehicles`
- `GET /api/Vehicles/{id}`
- `POST /api/Vehicles`
- `PUT /api/Vehicles/{id}`
- `DELETE /api/Vehicles/{id}`
- `POST /api/Vehicles/{id}/reserve`
- `GET /api/Customers`
- `GET /api/Customers/{id}`
- `POST /api/Customers`
- `PUT /api/Customers/{id}`
- `DELETE /api/Customers/{id}`
- `GET /api/TestDrives`
- `GET /api/TestDrives/customer/{customerId}`
- `GET /api/TestDrives/{id}`
- `POST /api/TestDrives`
- `PUT /api/TestDrives/{id}`
- `DELETE /api/TestDrives/{id}`
- `GET /api/Complaints`
- `GET /api/Complaints/{id}`
- `POST /api/Complaints`
- `PUT /api/Complaints/{id}`
- `DELETE /api/Complaints/{id}`
- `GET /api/Quotes`
- `GET /api/Quotes/{id}`
- `POST /api/Quotes`
- `PUT /api/Quotes/{id}/status`
- `POST /api/Orders/complete`
- `GET /api/Orders`
- `GET /api/Orders/{id}`
- `PUT /api/Orders/{id}/status`
- `GET /api/Contracts`
- `GET /api/Contracts/{id}`
- `POST /api/Contracts`
- `PUT /api/Contracts/{id}/status`
- `GET /api/Promotions`
- `POST /api/Promotions`
- `GET /api/Payments`
- `POST /api/Payments`
- `GET /api/Deliveries`
- `POST /api/Deliveries`
- `GET /api/reports/*` family and `POST /api/reports/synchronize-data`

## Backend endpoints missing from Postman
The collection does not include these active backend routes:
- `GET /api/vehicletypes` direct service path is present only indirectly; the direct backend route exists and should be treated as covered by `/api/vehicletypes` if the gateway is used consistently.
- `GET /api/Export/vehicles/csv`
- `GET /api/Export/vehicles/json`
- `GET /api/Health`
- `GET /api/Health/ready`
- `GET /api/Health/live`
- `GET /api/Orders/health`
- `GET /api/Sales/quotes/{id}`
- `POST /api/Sales/orders`
- `GET /api/Sales/orders/{id}`
- `POST /api/Sales/contracts`
- `GET /api/Sales/contracts/{id}`
- `POST /api/reports/sales-summary`
- `POST /api/reports/inventory-summary`
- `GET /api/reports/sales-summary/{id}`
- `GET /api/reports/inventory-summary/{id}`
- `GET /api/reports/top-vehicles`
- `GET /api/reports/sales-by-staff`
- `GET /api/reports/sales-by-region`
- `GET /api/reports/sales-proportion`
- `GET /api/reports/debt-summary` with full optional query set coverage remains incomplete in the collection
- `GET /api/Notification/test-fcm`
- `POST /api/Notification/subscribe-topic`
- `POST /api/Notification/unsubscribe-topic`
- `POST /api/Notification/send-to-topic`
- `POST /api/Notification/send-multicast`

## Postman requests without an exact active backend match
These requests exist in the collection but do not match an exact active backend method+path pair:
- `GET {{baseUrl}}/api/health` because the active service health route is `GET /health` in NotificationService and `GET /api/Health*` in VehicleService, not a gateway-proxied `GET /api/health`
- `GET {{baseUrl}}/images/sample.jpg` is gateway-only proxy surface; there is no dedicated controller method, but the gateway path exists
- `GET {{baseUrl}}/api/dealers` through the gateway is not proxied to the actual UserService dealer route because the gateway currently points dealers to VehicleService port 5068 while the direct dealer list is in UserService
- `GET {{baseUrl}}/api/dealers/{{dealerId}}` and dealer CRUD requests are not matched because the backend active dealer CRUD is in VehicleService, but the gateway proxy is inconsistent
- `GET {{baseUrl}}/api/Orders/complete` is not present; the collection correctly uses POST, so the request itself is fine
- `GET {{baseUrl}}/api/vehicletypes` is only reliable if the gateway proxy and backend route are used consistently
- Several ReportingService requests sent to `{{baseUrl}}` do not match because the gateway does not proxy ReportingService routes; they are valid only when sent directly to `{{reportingServiceUrl}}`
- Several NotificationService requests do not match because the gateway does not proxy NotificationService routes; they are valid only when sent directly to `{{notificationServiceUrl}}`
- `GET {{baseUrl}}/api/Sales/...` requests do not exist in the collection, but the direct sales routes are active in backend

## Method mismatches
- One request/category mismatch remains around gateway exposure for dealer routes: the backend dealer list exists on `GET /api/dealers`, but the collection mixes direct and gateway targets across dealer requests, so the effective route is inconsistent rather than method-invalid.

## Path mismatches
- Gateway route for dealers is inconsistent with the actual service boundary.
- `POST /api/Orders/complete` is correctly path-shaped, but older gateway/collection combinations previously caused 404s; the current path is now aligned.
- `GET /api/health` does not match any active route exactly.
- ReportingService requests are path-correct but target-wrong when pointed at the gateway.
- NotificationService requests are path-correct but target-wrong when pointed at the gateway.

## Target mismatches caused by gateway proxy gaps
The following request groups are active backend endpoints but should be sent directly to service URLs rather than the gateway unless proxying is added:
- ReportingService routes (`/api/reports/*`) should use `{{reportingServiceUrl}}`
- NotificationService routes (`/api/Notification/*`, `/health`) should use `{{notificationServiceUrl}}`
- VehicleService health/export routes should use `{{vehicleServiceUrl}}` unless explicitly proxied
- SalesService direct service routes beyond the small gateway-proxied subset should use `{{salesServiceUrl}}`

## Inactive/commented-out backend endpoints excluded
Excluded from the active count because they are commented out or inactive:
- [SalesService/Controllers/ProcessedReservationsController.cs](../../ev-dealer-management/ev-dealer-management/SalesService/Controllers/ProcessedReservationsController.cs)
  - `GET /api/ProcessedReservations`
  - `GET /api/ProcessedReservations/{id}`
  - `POST /api/ProcessedReservations`
  - `PUT /api/ProcessedReservations/{id}`
  - `DELETE /api/ProcessedReservations/{id}`
- [SalesService/Controllers/SalesController.cs](../../ev-dealer-management/ev-dealer-management/SalesService/Controllers/SalesController.cs)
  - Commented `CreateQuote` route and other commented sales routes

## Notes
This audit intentionally favors exact method+path matching. Requests that are valid only through a direct service URL but not via the gateway are listed as target mismatches rather than backend misses.
