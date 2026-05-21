$baseUrl = "http://localhost:5208/api/reports"

Write-Host "`n=== Importing Test Data for All Regions ===" -ForegroundColor Green

# Test data với đầy đủ 3 khu vực
$testData = @(
    # Miền Bắc
    @{
        date = "2025-01-15T00:00:00Z"
        dealerId = "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d"
        dealerName = "Dealer Hà Nội"
        region = "Miền Bắc"
        salespersonId = "11111111-2222-3333-4444-555555555551"
        salespersonName = "Nguyễn Văn A"
        totalOrders = 10
        totalRevenue = 3000000000
    },
    # Miền Nam
    @{
        date = "2025-01-20T00:00:00Z"
        dealerId = "b2c3d4e5-f6a7-4b5c-9d0e-2f3a4b5c6d7e"
        dealerName = "Dealer TP.HCM"
        region = "Miền Nam"
        salespersonId = "22222222-3333-4444-5555-666666666661"
        salespersonName = "Lê Văn C"
        totalOrders = 15
        totalRevenue = 4500000000
    },
    # Miền Trung
    @{
        date = "2025-01-12T00:00:00Z"
        dealerId = "c3d4e5f6-a7b8-4c5d-0e1f-3a4b5c6d7e8f"
        dealerName = "Dealer Đà Nẵng"
        region = "Miền Trung"
        salespersonId = "33333333-4444-5555-6666-777777777771"
        salespersonName = "Hoàng Văn E"
        totalOrders = 8
        totalRevenue = 2400000000
    }
)

$success = 0
$failed = 0

foreach ($item in $testData) {
    try {
        $json = $item | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/sales-summary" -Method Post -Body $json -ContentType "application/json" -ErrorAction Stop
        if ($response.success) {
            $success++
            Write-Host "  OK: $($item.region) - $($item.dealerName) - $($item.totalOrders) orders" -ForegroundColor Green
        } else {
            $failed++
            Write-Host "  Failed: $($item.region)" -ForegroundColor Red
        }
    } catch {
        $failed++
        Write-Host "  Error: $($item.region) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== Test Results ===" -ForegroundColor Cyan
Write-Host "Success: $success" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })

# Test endpoints sau khi import
Write-Host "`n=== Testing Endpoints ===" -ForegroundColor Cyan

try {
    Write-Host "`n1. Testing /sales-by-region..." -ForegroundColor Yellow
    $regions = Invoke-RestMethod -Uri "$baseUrl/sales-by-region" -Method Get
    $regions | ConvertTo-Json -Depth 5
} catch {
    Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    Write-Host "`n2. Testing /sales-proportion..." -ForegroundColor Yellow
    $proportion = Invoke-RestMethod -Uri "$baseUrl/sales-proportion" -Method Get
    $proportion | ConvertTo-Json -Depth 5
} catch {
    Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

