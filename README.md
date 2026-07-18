# Travel - Homestay - Camping - Booking Application

## Module B: Vehicle & Dealer Management Test Commands

### 1. Start the VehicleService
```powershell
cd "d:\Git\Travel---Homestay---Camping---Booking---Application\ev-dealer-management\ev-dealer-management"
dotnet run --project "VehicleService\VehicleService.csproj"
```

### 2. Run black-box tests with Postman/Newman
```powershell
cd "d:\Git\Travel---Homestay---Camping---Booking---Application"
newman run ".\Module_B_Test_Suite.json" --env-var "base_url=http://localhost:5068"
```

### 3. Run white-box tests
```powershell
cd "d:\Git\Travel---Homestay---Camping---Booking---Application\ev-dealer-management\ev-dealer-management"
dotnet test "VehicleService.Tests\VehicleService.Tests.csproj"
```

### 4. Optional: run with CLI reporter for a detailed summary
```powershell
cd "d:\Git\Travel---Homestay---Camping---Booking---Application"
newman run ".\Module_B_Test_Suite.json" --env-var "base_url=http://localhost:5068" --reporters cli
```

> Verified commands for the current workspace. The black-box suite expects the VehicleService to be running on port 5068.
