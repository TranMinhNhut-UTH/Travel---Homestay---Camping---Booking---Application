# Test Procedures

## 1. Prepare the environment
1. Make sure the backend database files are available and not locked by another process.
2. Install Node.js dependencies for Postman/Newman if needed.
3. Ensure .NET 8 SDK is installed.
4. Verify local ports are free:
   - UserService: `7001`
   - SalesService: `5003`
   - VehicleService: `5068`
   - CustomerService: `5039`
   - ReportingService: `5208`
   - NotificationService: `5051`
   - API Gateway: `5036`

## 2. Run backend services
Use the repository launcher script:
- [start-all-services.ps1](../../ev-dealer-management/ev-dealer-management/start-all-services.ps1)

If running manually, start each service from its project folder with the expected `ASPNETCORE_URLS` value.

## 3. Import Postman environment
1. Open Postman.
2. Import [ev-dealer-management.postman_environment.json](../../postman/ev-dealer-management.postman_environment.json).
3. Confirm variables such as `baseUrl`, `salesServiceUrl`, `customerServiceUrl`, `vehicleServiceUrl`, `reportingServiceUrl`, and `notificationServiceUrl` are populated.
4. Use `baseUrl = http://localhost:5036` for gateway-based routes and direct service URLs for routes not proxied by the gateway.

## 4. Run requests manually by group
### Auth & Users
- Run login and registration first.
- Use admin token for admin-only routes.
- Check `401` for unauthorized access and `403` for forbidden access.

### Vehicles & Dealers
- Verify `GET /api/vehicles` first.
- Test vehicle creation with JSON and multipart form-data.
- Test dealer CRUD and reserve flow.

### Customers & Test Drives
- Create customer first.
- Create test drive after customer exists.
- Run complaint create/update/delete flows with valid customer ids.

### Complaints
- Use existing customer and optional related order/vehicle ids.
- Verify `GET`, `POST`, `PUT`, and `DELETE` flows separately.

### Sales Core
- Create quote before order.
- Run `POST /api/Orders/complete` before contract creation.
- Run contract status updates after a contract exists.
- Payments and deliveries should use a valid order id.

### Reports
- Use direct `{{reportingServiceUrl}}` requests for report endpoints.
- Provide valid date ranges where applicable.

## 5. Record Actual Result
For every request or test case:
- Compare the actual HTTP status code to the expected one.
- Inspect the response body for required fields.
- If the response is an error, capture the returned message and any validation details.
- Fill in `Actual result` in the test case file.
- Mark `Status` as `PASS` or `FAIL` only after verification.

## 6. PASS / FAIL rules
- `PASS`: status code, response body, and response time all match the expected result.
- `FAIL`: any assertion fails, an endpoint returns the wrong status, or the response body does not match the documented contract.
- If an endpoint is not reachable through the gateway but works directly, mark it as a routing issue rather than an application functional failure.

## 7. Export report
### Postman
- Use Postman collection runner or Newman.
- Export run results if needed for evidence.

### Newman example
```bash
newman run "ev-dealer-management.postman_collection.json" \
  --environment "postman/ev-dealer-management.postman_environment.json" \
  --reporters cli,junit
```

The GitHub Actions workflow uses the canonical root collection instead:

```bash
mkdir -p test-results
newman run ./ev-dealer-management.postman_collection.json \
  -e ./postman/ev-dealer-management.postman_environment.json \
  --reporters cli,junit,htmlextra \
  --reporter-junit-export ./test-results/newman-results.xml \
  --reporter-htmlextra-export ./test-results/newman-report.html
```

The collection-level test script is inherited by every request. It asserts the expected status for the named happy/negative case, rejects every HTTP 500 response, checks response time, validates JSON content type/body, and records created resource IDs when available. Any failed assertion makes Newman and CI exit non-zero. GitHub Actions uploads `newman.log`, JUnit XML, and the HTML report with `if: always()`.

Evidence levels must not be mixed:

- Markdown/Excel: test-case design only.
- Postman `pm.test()` scripts: executable black-box tests.
- Newman CLI/JUnit/HTML and GitHub Actions logs: execution evidence.

### Suggested evidence to keep
- Console output from Newman
- Screenshots of failed requests in Postman
- Saved response bodies for failures
