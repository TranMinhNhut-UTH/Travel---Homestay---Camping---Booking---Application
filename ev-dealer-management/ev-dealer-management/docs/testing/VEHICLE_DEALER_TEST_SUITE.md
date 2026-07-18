# Vehicle & Dealer Management Test Suite

> **Mục đích**: Thiết kế bộ testcase cho module Vehicle & Dealer Management theo cả tiếp cận hộp đen (black-box) và hộp trắng (white-box).
> **Căn cứ**: Controllers và services thực tế trong VehicleService: VehiclesController, DealersController, VehicleService.

---

## 1. Phạm vi kiểm thử

### 1.1 Functional scope
- Quản lý xe: get/list/create/update/delete/reserve
- Quản lý đại lý: get/list/create/update/delete
- Validation và xử lý lỗi cho input không hợp lệ
- Branch logic trong service layer: search/filter/sort, not-found handling, image/specification/color-variant branches

### 1.2 Environment
- Base URL: http://localhost:5068
- Service: VehicleService
- Endpoint chính:
  - GET /api/vehicles
  - GET /api/vehicles/{id}
  - POST /api/vehicles
  - PUT /api/vehicles/{id}
  - DELETE /api/vehicles/{id}
  - POST /api/vehicles/{id}/reserve
  - GET /api/dealers
  - GET /api/dealers/{id}
  - POST /api/dealers
  - PUT /api/dealers/{id}
  - DELETE /api/dealers/{id}

---

## 2. Black-box Test Cases

### 2.1 Vehicle Management

| ID | Objective | Input | Steps | Expected Result |
|---|---|---|---|---|
| VB-01 | List vehicles successfully | No filter | Call GET /api/vehicles?page=1&pageSize=10 | HTTP 200, response contains items array, pagination fields |
| VB-02 | Filter vehicles by search keyword | Search=VF | Call GET /api/vehicles?search=VF | HTTP 200, only matching vehicle(s) returned |
| VB-03 | Filter vehicles by type | Type=SUV | Call GET /api/vehicles?type=SUV | HTTP 200, all returned vehicles have Type=SUV |
| VB-04 | Get vehicle detail for existing id | id=1 | Call GET /api/vehicles/1 | HTTP 200, vehicle data returned |
| VB-05 | Get vehicle detail for non-existing id | id=99999 | Call GET /api/vehicles/99999 | HTTP 404 with message Vehicle not found |
| VB-06 | Create vehicle with valid payload | Valid CreateVehicleDto | POST /api/vehicles with valid JSON body | HTTP 201, vehicle created and location header present |
| VB-07 | Create vehicle with missing required fields | Missing Model/Type/DealerId | POST /api/vehicles with incomplete body | HTTP 400 or 422 validation error |
| VB-08 | Update vehicle with valid payload | Existing id + valid body | PUT /api/vehicles/{id} | HTTP 200, updated vehicle data returned |
| VB-09 | Update non-existing vehicle | id=99999 | PUT /api/vehicles/99999 | HTTP 404 with Vehicle not found |
| VB-10 | Delete existing vehicle | Existing id | DELETE /api/vehicles/{id} | HTTP 204 No Content |
| VB-11 | Delete non-existing vehicle | id=99999 | DELETE /api/vehicles/99999 | HTTP 404 with Vehicle not found |
| VB-12 | Reserve vehicle successfully | Valid reservation body, stock available | POST /api/vehicles/{id}/reserve | HTTP 200, reservation success message returned |
| VB-13 | Reserve vehicle with insufficient stock | Quantity > stock | POST /api/vehicles/{id}/reserve | HTTP 404 with Vehicle not found or insufficient stock |
| VB-14 | Reserve vehicle with invalid email/phone | Invalid CustomerEmail or CustomerPhone | POST /api/vehicles/{id}/reserve | HTTP 400/422 validation error |

### 2.2 Dealer Management

| ID | Objective | Input | Steps | Expected Result |
|---|---|---|---|---|
| DB-01 | List dealers successfully | No filter | Call GET /api/dealers | HTTP 200, response contains data array |
| DB-02 | Get dealer detail for existing id | id=1 | Call GET /api/dealers/1 | HTTP 200, dealer data returned |
| DB-03 | Get dealer detail for non-existing id | id=99999 | Call GET /api/dealers/99999 | HTTP 404 with Dealer not found |
| DB-04 | Create dealer with valid payload | Valid CreateDealerDto | POST /api/dealers | HTTP 201, new dealer created |
| DB-05 | Create dealer with invalid email | Invalid Email field | POST /api/dealers | HTTP 400/422 validation error |
| DB-06 | Update dealer with valid payload | Existing id + valid body | PUT /api/dealers/{id} | HTTP 200, updated dealer returned |
| DB-07 | Update non-existing dealer | id=99999 | PUT /api/dealers/99999 | HTTP 404 with Dealer not found |
| DB-08 | Delete existing dealer | Existing id | DELETE /api/dealers/{id} | HTTP 204 No Content |
| DB-09 | Delete non-existing dealer | id=99999 | DELETE /api/dealers/99999 | HTTP 404 with Dealer not found |

---

## 3. White-box Test Cases

### 3.1 Service/Controller branch coverage

| ID | Target Logic | Test Scenario | Expected Result |
|---|---|---|---|
| WB-01 | GetVehiclesAsync search branch | Query.Search = "VF" | Query returns filtered vehicles; search term applied to Model/Description |
| WB-02 | GetVehiclesAsync filter branches | Query.Type, DealerId, MinPrice, MaxPrice set | Returned results match all supplied filters |
| WB-03 | GetVehiclesAsync pagination/sort branch | Page=2, PageSize=5, SortBy=price, SortOrder=desc | Correct pagination and ordering |
| WB-04 | GetVehicleByIdAsync exists path | Existing vehicle id | DTO returned with dealer name and related lists |
| WB-05 | GetVehicleByIdAsync null path | Missing vehicle id | Returns null so controller returns 404 |
| WB-06 | CreateVehicleAsync image branch | imageFiles provided and createDto.Images present | Vehicle images created from uploaded files |
| WB-07 | CreateVehicleAsync fallback image branch | No uploaded files but createDto.Images contains URL entries | URL-based images added to vehicle |
| WB-08 | CreateVehicleAsync color/specification branch | ColorVariants and Specifications present | Related color variants/specifications persisted |
| WB-09 | UpdateVehicleAsync missing vehicle branch | id not found | Returns null so controller returns 404 |
| WB-10 | UpdateVehicleAsync spec update branch | Existing vehicle with Specifications and new Specifications payload | Existing specs updated correctly |
| WB-11 | UpdateVehicleAsync spec create/delete branch | Vehicle has no specs or payload has null specs | New specs created or existing specs removed correctly |
| WB-12 | ReserveVehicleAsync stock available branch | Valid vehicle id and quantity <= stock | Returns reservation event object |
| WB-13 | ReserveVehicleAsync stock insufficient/null branch | Vehicle missing or quantity > stock | Returns null so controller returns 404 |
| WB-14 | CreateDealerAsync success path | Valid dealer payload | Dealer inserted and returned with VehicleCount=0 |
| WB-15 | UpdateDealerAsync not-found path | Missing dealer id | Returns null so controller returns 404 |
| WB-16 | DeleteDealerAsync success/failure path | Existing vs non-existing dealer id | Returns true/false accordingly |

---

## 4. Suggested Execution Order

1. Run happy path black-box cases first.
2. Run negative and boundary cases.
3. Run white-box cases to cover internal branches and exception paths.
4. Record status as Pass/Fail/Blocked for each case.

---

## 5. Example Result Template

| TC ID | Status | Actual Result | Notes |
|---|---|---|---|
| VB-01 | Pass | HTTP 200 | Returned valid pagination |
| WB-09 | Pass | Null returned | Branch covered |
