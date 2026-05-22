# EV Dealer Management - Jira Plan

## Tong quan
He thong gom 6 nhom chinh:
- `UserService` cho auth, user, dealer seed data.
- `VehicleService` cho xe, dai ly, loai xe, reserve, export.
- `CustomerService` cho customer, test drive, complaint.
- `SalesService` cho quote, order, contract, payment, delivery, promotion.
- `NotificationService` cho FCM test va topic messaging.
- `ReportingService` cho bao cao, forecast, export, sync du lieu.

API Gateway dang proxy mot phan API cong khai, nhung mot so endpoint van chi goi truc tiep vao service. Vi vay backlog can co task dong bo route va chuan hoa base URL.

## Danh muc endpoint

### UserService
| Method | Endpoint | Ghi chu |
|---|---|---|
| POST | `/api/auth/register` | Dang ky user |
| POST | `/api/auth/login` | Dang nhap, tra JWT |
| POST | `/api/auth/forgot-password` | Gui luong reset mat khau |
| POST | `/api/auth/reset-password` | Dat lai mat khau |
| GET | `/api/users/me` | Profile hien tai |
| GET | `/api/users` | Admin lay danh sach user |
| POST | `/api/admin/users` | Admin tao user da duyet |
| GET | `/api/users/{id}` | Chi tiet user |
| PUT | `/api/users/{id}` | Cap nhat user |
| DELETE | `/api/users/{id}` | Xoa user |
| PUT | `/api/users/{id}/role` | Doi role |
| PUT | `/api/users/{id}/approve` | Duyet user |
| GET | `/api/dealers` | Lay danh sach dai ly seed |
| GET | `/api/internal/users` | API noi bo cho reporting |

### VehicleService
| Method | Endpoint | Ghi chu |
|---|---|---|
| GET | `/api/vehicles` | Danh sach xe, co filter/paging |
| GET | `/api/vehicles/{id}` | Chi tiet xe |
| POST | `/api/vehicles` | Tao xe moi |
| PUT | `/api/vehicles/{id}` | Cap nhat xe |
| DELETE | `/api/vehicles/{id}` | Xoa xe |
| POST | `/api/vehicles/{id}/reserve` | Reserve xe + pub event |
| GET | `/api/dealers` | CRUD dai ly |
| GET | `/api/dealers/{id}` | Chi tiet dai ly |
| POST | `/api/dealers` | Tao dai ly |
| PUT | `/api/dealers/{id}` | Cap nhat dai ly |
| DELETE | `/api/dealers/{id}` | Xoa dai ly |
| GET | `/api/vehicletypes` | Danh muc loai xe |
| GET | `/api/export/vehicles/csv` | Export CSV |
| GET | `/api/export/vehicles/json` | Export JSON |
| GET | `/api/health` | Health check service |
| GET | `/health` | Health checks middleware |
| GET | `/images/{file}` | Static images |

### CustomerService
| Method | Endpoint | Ghi chu |
|---|---|---|
| GET | `/api/customers` | Danh sach customer |
| GET | `/api/customers/{id}` | Chi tiet customer |
| POST | `/api/customers` | Tao customer |
| PUT | `/api/customers/{id}` | Cap nhat customer |
| DELETE | `/api/customers/{id}` | Xoa customer |
| GET | `/api/TestDrives` | Danh sach test drive |
| GET | `/api/TestDrives/customer/{customerId}` | Test drive theo customer |
| GET | `/api/TestDrives/{id}` | Chi tiet test drive |
| POST | `/api/TestDrives` | Tao test drive |
| PUT | `/api/TestDrives/{id}` | Cap nhat test drive |
| DELETE | `/api/TestDrives/{id}` | Xoa test drive |
| GET | `/api/Complaints` | Danh sach complaint |
| GET | `/api/Complaints/{id}` | Chi tiet complaint |
| POST | `/api/Complaints` | Tao complaint |
| PUT | `/api/Complaints/{id}` | Cap nhat complaint |
| DELETE | `/api/Complaints/{id}` | Xoa complaint |

### SalesService
#### Current endpoints
| Method | Endpoint | Ghi chu |
|---|---|---|
| GET | `/api/Quotes` | Danh sach quote |
| GET | `/api/Quotes/{id}` | Chi tiet quote |
| POST | `/api/Quotes` | Tao quote |
| PUT | `/api/Quotes/{id}/status` | Cap nhat trang thai quote |
| POST | `/api/Orders/complete` | Hoan tat order + gui event email |
| GET | `/api/Orders` | Danh sach order |
| GET | `/api/Orders/{id}` | Chi tiet order |
| PUT | `/api/Orders/{id}/status` | Cap nhat trang thai order |
| GET | `/api/Orders/health` | Health check |
| GET | `/api/Contracts` | Danh sach contract |
| POST | `/api/Contracts` | Tao contract tu order |
| GET | `/api/Contracts/{id}` | Chi tiet contract |
| PUT | `/api/Contracts/{id}/status` | Cap nhat trang thai contract |
| GET | `/api/Payments` | Danh sach payment |
| POST | `/api/Payments` | Tao payment |
| GET | `/api/Deliveries` | Danh sach delivery |
| POST | `/api/Deliveries` | Tao delivery |
| GET | `/api/Promotions` | Danh sach promotion |
| POST | `/api/Promotions` | Tao promotion |

#### Legacy compatibility endpoints
| Method | Endpoint | Ghi chu |
|---|---|---|
| POST | `/api/Sales/quotes` | Legacy create quote |
| GET | `/api/Sales/quotes/{id}` | Legacy get quote |
| POST | `/api/Sales/orders` | Legacy create order |
| GET | `/api/Sales/orders/{id}` | Legacy get order |
| POST | `/api/Sales/contracts` | Legacy create contract |
| GET | `/api/Sales/contracts/{id}` | Legacy get contract |

### NotificationService
| Method | Endpoint | Ghi chu |
|---|---|---|
| POST | `/api/Notification/test-fcm` | Gui push test |
| POST | `/api/Notification/subscribe-topic` | Subscribe topic |
| POST | `/api/Notification/unsubscribe-topic` | Unsubscribe topic |
| POST | `/api/Notification/send-to-topic` | Broadcast topic |
| POST | `/api/Notification/send-multicast` | Gui multicast |
| GET | `/health` | Health check |

### ReportingService
| Method | Endpoint | Ghi chu |
|---|---|---|
| GET | `/api/reports/demand-forecast` | AI forecast |
| POST | `/api/reports/synchronize-data` | Dong bo du lieu |
| GET | `/api/reports/debt-summary` | Bao cao cong no |
| GET | `/api/reports/debt-report` | Bao cao debt tong hop |
| GET | `/api/reports/sales-by-dealer` | Doanh so theo dai ly |
| GET | `/api/reports/inventory-trends` | Xu huong ton kho |
| GET | `/api/reports/sales-by-staff` | Doanh so theo nhan vien |
| GET | `/api/reports/summary` | Summary report |
| GET | `/api/reports/sales-by-region` | Doanh so theo khu vuc |
| GET | `/api/reports/sales-proportion` | Ty le doanh so |
| GET | `/api/reports/top-vehicles` | Xe ban chay |
| POST | `/api/reports/export` | Export CSV |
| GET | `/api/reports/sales-summary` | Lay sales summary |
| GET | `/api/reports/sales-summary/{id}` | Chi tiet sales summary |
| POST | `/api/reports/sales-summary` | Tao sales summary test |
| GET | `/api/reports/inventory-summary` | Lay inventory summary |
| GET | `/api/reports/inventory-summary/{id}` | Chi tiet inventory summary |
| POST | `/api/reports/inventory-summary` | Tao inventory summary test |
| GET | `/weatherforecast` | Endpoint mau template |

## Jira backlog

### EPIC 1 - Gateway parity va chuan hoa API
| Key | Task | Endpoint lien quan | Priority |
|---|---|---|---|
| EVM-101 | Kiem tra toan bo route dang public va dong bo lai Ocelot | Tat ca route gateway | High |
| EVM-102 | Chuan hoa base URL, port va nguon route cho tung service | Tat ca service | High |
| EVM-103 | Loai bo route trung lap/khong can thiet, dam bao route uu tien dung | `/api/dealers`, `/api/users`, `/api/Orders` | High |
| EVM-104 | Tao smoke test cho gateway sau moi thay doi route | Gateway + Postman | Medium |

### EPIC 2 - Auth va user management
| Key | Task | Endpoint lien quan | Priority |
|---|---|---|---|
| EVM-201 | Hoan thien dang ky, dang nhap, quen/reset mat khau | `/api/auth/register`, `/api/auth/login`, `/api/auth/forgot-password`, `/api/auth/reset-password` | High |
| EVM-202 | Hoan thien profile va CRUD user | `/api/users/me`, `/api/users/{id}` | High |
| EVM-203 | Hoan thien admin user lifecycle | `/api/users`, `/api/admin/users`, `/api/users/{id}/role`, `/api/users/{id}/approve` | High |
| EVM-204 | Dong bo dealer seed va internal users cho bao cao | `/api/dealers`, `/api/internal/users` | Medium |

### EPIC 3 - Vehicle va dealer management
| Key | Task | Endpoint lien quan | Priority |
|---|---|---|---|
| EVM-301 | CRUD xe va validate payload | `/api/vehicles` | High |
| EVM-302 | Reserve xe va pub event sang NotificationService | `/api/vehicles/{id}/reserve` | High |
| EVM-303 | CRUD dai ly va chuan hoa data seed | `/api/dealers` | High |
| EVM-304 | Danh muc loai xe, image static va export | `/api/vehicletypes`, `/images/{file}`, `/api/export/vehicles/csv`, `/api/export/vehicles/json` | Medium |
| EVM-305 | Health check va startup check cho VehicleService | `/api/health`, `/health` | Medium |

### EPIC 4 - Customer operations
| Key | Task | Endpoint lien quan | Priority |
|---|---|---|---|
| EVM-401 | CRUD customer va validate unique email/phone | `/api/customers` | High |
| EVM-402 | CRUD test drive va filter theo customer | `/api/TestDrives`, `/api/TestDrives/customer/{customerId}` | High |
| EVM-403 | CRUD complaint va enrich payload theo customer | `/api/Complaints` | High |
| EVM-404 | Kiem tra event consumer va RabbitMQ flow cua customer module | Customer consumers | Medium |

### EPIC 5 - Sales workflow
| Key | Task | Endpoint lien quan | Priority |
|---|---|---|---|
| EVM-501 | Tao quote va cap nhat trang thai quote | `/api/Quotes`, `/api/Quotes/{id}/status` | High |
| EVM-502 | Hoan tat order va phat event sang NotificationService | `/api/Orders/complete`, `/api/Orders/{id}/status` | High |
| EVM-503 | CRUD contract va xu ly approve/reject | `/api/Contracts`, `/api/Contracts/{id}/status` | High |
| EVM-504 | CRUD payment va delivery | `/api/Payments`, `/api/Deliveries` | High |
| EVM-505 | CRUD promotion va ap dung discount | `/api/Promotions` | Medium |
| EVM-506 | Quyet dinh xem legacy SalesController co con can hay khong | `/api/Sales/*` | Medium |

### EPIC 6 - Notification va messaging
| Key | Task | Endpoint lien quan | Priority |
|---|---|---|---|
| EVM-601 | Kiem tra FCM test endpoint | `/api/Notification/test-fcm` | High |
| EVM-602 | Kiem tra subscribe/unsubscribe topic | `/api/Notification/subscribe-topic`, `/api/Notification/unsubscribe-topic` | High |
| EVM-603 | Kiem tra broadcast va multicast notification | `/api/Notification/send-to-topic`, `/api/Notification/send-multicast` | High |
| EVM-604 | Xac minh consumer RabbitMQ va retry behavior | Notification consumers | Medium |

### EPIC 7 - Reporting va export
| Key | Task | Endpoint lien quan | Priority |
|---|---|---|---|
| EVM-701 | Hoan thien forecast va bao cao data sync | `/api/reports/demand-forecast`, `/api/reports/synchronize-data` | High |
| EVM-702 | Hoan thien debt report va debt summary | `/api/reports/debt-summary`, `/api/reports/debt-report` | High |
| EVM-703 | Hoan thien report theo dai ly, khu vuc, staff | `/api/reports/sales-by-dealer`, `/api/reports/sales-by-region`, `/api/reports/sales-by-staff` | High |
| EVM-704 | Hoan thien inventory/top vehicle/proportion/summary | `/api/reports/inventory-trends`, `/api/reports/sales-proportion`, `/api/reports/top-vehicles`, `/api/reports/summary` | High |
| EVM-705 | Hoan thien export CSV va report CRUD test data | `/api/reports/export`, `/api/reports/sales-summary`, `/api/reports/inventory-summary` | High |

### EPIC 8 - QA, test va tai lieu
| Key | Task | Endpoint lien quan | Priority |
|---|---|---|---|
| EVM-801 | Tao Postman collection cho toan bo API cong khai | Tat ca endpoint | High |
| EVM-802 | Tao smoke test script cho tung service | Tat ca service | High |
| EVM-803 | Cap nhat huong dan chay local va port map | Gateway + services | Medium |
| EVM-804 | Ghi nhan endpoint bi disable/comment va quyet dinh xu ly | `ProcessedReservationsController` | Medium |

## Ghi chu uu tien
- Uu tien 1: dong bo route gateway, auth, quote/order/contract, customer CRUD.
- Uu tien 2: reporting, notification, export va test automation.
- Uu tien 3: legacy endpoint cleanup va tai lieu van hanh.

## GitHub Actions va Jira workflow

### Secret can cau hinh tren GitHub
- `JIRA_BASE_URL`: vi du `https://your-domain.atlassian.net`
- `JIRA_EMAIL`: email dang nhap Jira
- `JIRA_API_TOKEN`: Jira API token
- `JIRA_PROJECT_KEY`: project key neu muon override
- `JIRA_EPIC_LINK_FIELD_ID`: custom field cua Epic Link, mac dinh `customfield_10014`
- `JIRA_TRANSITION_IN_PROGRESS`: ten transition de dua issue sang `In Progress`
- `JIRA_TRANSITION_DONE`: ten transition de dua issue sang `Done`

### Workflow co san
- `CI and Jira Sync`: chay khi push hoac pull request.
- `Create Jira Issues`: chay thu cong qua `workflow_dispatch`, chi can nhap `epic_key` la workflow se tao cac task con vao epic do.

### Branch naming standard
- `main` hoac `develop` cho nhánh chinh.
- `release/x.y.z` cho ban release.
- `feature/ED-101-short-name` cho task moi.
- `fix/ED-202-short-name` cho bug fix.
- `hotfix/ED-303-short-name` cho sua nhanh production.
- `chore/ED-404-short-name` cho cong viec phi chuc nang.

### Cach hoat dong
1. Member push code len branch co chua Jira issue key trong ten branch, commit message, hoac PR title/body.
2. Workflow CI build solution va validate Postman collection.
3. Neu build pass tren push, issue se duoc comment va chuyen sang `In Progress`.
4. Neu PR duoc merge thanh cong, issue se duoc comment va chuyen sang `Done`.
5. Neu build fail, workflow se comment ket qua fail ve Jira de review nhanh.

### Import task vao epic
- Chay workflow `Create Jira Issues`.
- Nhap `epic_key` la key cua epic da tao san.
- Neu khong nhap `issues_json`, workflow se dung template mac dinh tai `.github/jira-templates/default-issues.json`.
- Neu muon tu tao danh sach task, truyen mot JSON array vao `issues_json`.
- Jira se cap key tiep theo cho issue con, vi du `ED-2`, `ED-3`, `ED-4`, neu epic ban nhap la `ED-1`.

### Vi du `issues_json`
```json
[
	{
		"summary": "Setup GitHub Actions CI",
		"description": "Build and validate the solution on every push."
	},
	{
		"summary": "Add Jira status sync",
		"description": "Move Jira issues to In Progress or Done based on CI and merge events."
	}
]
```

### Luu y ve Jira Epic Link
- Workflow se tu dong thu tim `Epic Link` field tu Jira API neu ban khong set `JIRA_EPIC_LINK_FIELD_ID`.
- Neu Jira khong tra ve field nay, issue van tao duoc nhung khong noi vao epic; khi do ban can set secret `JIRA_EPIC_LINK_FIELD_ID` hoac chuyen sang cach map field phu hop voi project type.

### Postman collection
- File collection da duoc luu trong repo tai `ev-dealer-management.postman_collection.json`.
- CI se validate JSON collection nay de tranh merge file loi.
