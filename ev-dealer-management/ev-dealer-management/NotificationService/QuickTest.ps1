# Quick Test Script for NotificationService
# Test tất cả API endpoints nhanh chóng

param(
    [Parameter(Mandatory=$false)]
    [string]$Email = "test@gmail.com",
    
    [Parameter(Mandatory=$false)]
    [string]$Phone = "+84901234567",
    
    [Parameter(Mandatory=$false)]
    [string]$BaseUrl = "http://localhost:5005"
)

$ErrorActionPreference = "Continue"

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Uri,
        [object]$Body = $null
    )
    
    Write-Host "`n--- Testing: $Name ---" -ForegroundColor Yellow
    Write-Host "URI: $Uri" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Uri
            Method = $Method
        }
        
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json
            Write-Host "Body: $jsonBody" -ForegroundColor DarkGray
            $params.Add("Body", $jsonBody)
            $params.Add("ContentType", "application/json")
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "✓ SUCCESS" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor Cyan
        $response | ConvertTo-Json | Write-Host -ForegroundColor White
        return $true
    }
    catch {
        Write-Host "✗ FAILED" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Banner
Write-Host @"

╔═══════════════════════════════════════════════════╗
║     NotificationService - Quick Test Script       ║
╚═══════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

Write-Host "Base URL: $BaseUrl" -ForegroundColor Gray
Write-Host "Test Email: $Email" -ForegroundColor Gray
Write-Host "Test Phone: $Phone`n" -ForegroundColor Gray

# Counter
$testCount = 0
$passCount = 0

# Test 1: Health Check
$testCount++
if (Test-Endpoint -Name "Health Check" -Method "GET" -Uri "$BaseUrl/health") {
    $passCount++
}

# Test 2: Simple Email
$testCount++
$emailBody = @{
    to = $Email
    subject = "Quick Test - Simple Email"
    htmlContent = "<h1>Hello from NotificationService!</h1><p>This is a quick test email.</p>"
}
if (Test-Endpoint -Name "Send Simple Email" -Method "POST" -Uri "$BaseUrl/api/notification/test-email" -Body $emailBody) {
    $passCount++
}

# Test 3: Order Confirmation
$testCount++
$orderBody = @{
    customerEmail = $Email
    customerName = "Quick Test User"
    vehicleModel = "Tesla Model 3 Long Range"
    totalPrice = 45000.00
    orderId = "QT-$(Get-Random -Minimum 1000 -Maximum 9999)"
}
if (Test-Endpoint -Name "Send Order Confirmation" -Method "POST" -Uri "$BaseUrl/api/notification/order-confirmation" -Body $orderBody) {
    $passCount++
}

# Test 4: Test Drive Confirmation
$testCount++
$testDriveBody = @{
    customerEmail = $Email
    customerName = "Quick Test User"
    vehicleModel = "Tesla Model Y Performance"
    scheduledDate = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss")
}
if (Test-Endpoint -Name "Send Test Drive Confirmation" -Method "POST" -Uri "$BaseUrl/api/notification/test-drive-confirmation" -Body $testDriveBody) {
    $passCount++
}

# Test 5: Simple SMS
$testCount++
$smsBody = @{
    phoneNumber = $Phone
    message = "Quick test SMS from NotificationService"
}
if (Test-Endpoint -Name "Send Simple SMS" -Method "POST" -Uri "$BaseUrl/api/notification/test-sms" -Body $smsBody) {
    $passCount++
}

# Test 6: Reservation Confirmation
$testCount++
$reservationBody = @{
    customerPhone = $Phone
    customerName = "Quick Test User"
    vehicleModel = "Tesla Model S Plaid"
    colorName = "Pearl White Multi-Coat"
}
if (Test-Endpoint -Name "Send Reservation Confirmation" -Method "POST" -Uri "$BaseUrl/api/notification/reservation-confirmation" -Body $reservationBody) {
    $passCount++
}

# Summary
Write-Host "`n`n╔═══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                  TEST SUMMARY                     ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════╝" -ForegroundColor Cyan

$passRate = [math]::Round(($passCount / $testCount) * 100, 2)

Write-Host "`nTotal Tests: $testCount" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $($testCount - $passCount)" -ForegroundColor Red
Write-Host "Pass Rate: $passRate%" -ForegroundColor $(if ($passRate -eq 100) { "Green" } elseif ($passRate -ge 50) { "Yellow" } else { "Red" })

if ($passCount -eq $testCount) {
    Write-Host "`n✓ ALL TESTS PASSED! 🎉" -ForegroundColor Green
} else {
    Write-Host "`n⚠ SOME TESTS FAILED" -ForegroundColor Yellow
}

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Check email inbox: $Email" -ForegroundColor White
Write-Host "2. Check phone for SMS: $Phone" -ForegroundColor White
Write-Host "3. Review logs: .\Logs\notification-service-*.log" -ForegroundColor White
Write-Host "4. View Swagger UI: $BaseUrl/swagger" -ForegroundColor White

Write-Host "`n" -ForegroundColor White

# Usage
<#
.EXAMPLE
.\QuickTest.ps1
Run all tests with default email and phone

.EXAMPLE
.\QuickTest.ps1 -Email "myemail@gmail.com"
Run tests with custom email

.EXAMPLE
.\QuickTest.ps1 -Email "myemail@gmail.com" -Phone "+84987654321"
Run tests with custom email and phone

.EXAMPLE
.\QuickTest.ps1 -BaseUrl "http://localhost:5005"
Run tests against specific service URL
#>
