# run-module-a-blackbox-tests.ps1
# Blackbox testing - Focus on functional testing without internal knowledge
# Test từ góc độ người dùng cuối, chỉ quan tâm input/output

param(
    [string]$CollectionPath = "Module_A_Test_Suite.json",
    [string]$OutputDir = "Logs",
    [string]$BaseUrl = "http://localhost:5036",
    [switch]$SkipAuthTests
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

Write-Host "🔲 Running Module A BLACKBOX Tests" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Magenta
Write-Host "Timestamp: $timestamp" -ForegroundColor Gray
Write-Host "Base URL: $BaseUrl" -ForegroundColor Gray
Write-Host ""

# Tạo thư mục Logs
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Blackbox test configuration
$blackboxConfig = @{
    "focus" = "Functional testing from user perspective"
    "scope" = @(
        "API endpoints response validation"
        "HTTP status codes"
        "Response time performance"
        "Data format validation"
        "Error handling"
    )
    "excludes" = @(
        "Internal code structure"
        "Database queries"
        "Business logic implementation"
    )
}

Write-Host "📋 Blackbox Test Configuration:" -ForegroundColor Cyan
Write-Host "  Focus: $($blackboxConfig.focus)" -ForegroundColor Gray
Write-Host "  Scope:" -ForegroundColor Gray
foreach ($item in $blackboxConfig.scope) {
    Write-Host "    - $item" -ForegroundColor Gray
}
Write-Host ""

# Chạy Newman với blackbox focus
$newmanArgs = @(
    "run", $CollectionPath,
    "--reporters", "cli,json",
    "--reporter-json-export", "$OutputDir/module-a-blackbox-results.json",
    "--global-var", "baseUrl=$BaseUrl",
    "--delay-request", "100"  # Delay 100ms between requests
)

# Skip auth tests nếu được yêu cầu
if ($SkipAuthTests) {
    Write-Host "⚠️  Skipping authentication tests" -ForegroundColor Yellow
    $newmanArgs += "--folder", "2. User Management Tests"
    $newmanArgs += "--folder", "3. Customer Management Tests"
    $newmanArgs += "--folder", "4. Test Drive Management Tests"
    $newmanArgs += "--folder", "5. Complaint Management Tests"
}

Write-Host "🚀 Starting blackbox test execution..." -ForegroundColor Cyan
Write-Host ""

try {
    newman @newmanArgs
    $exitCode = $LASTEXITCODE
    
    Write-Host ""
    if ($exitCode -eq 0) {
        Write-Host "✅ Blackbox tests PASSED!" -ForegroundColor Green
        Write-Host "📊 All API endpoints are functioning correctly from user perspective" -ForegroundColor Green
    } else {
        Write-Host "❌ Blackbox tests FAILED!" -ForegroundColor Red
        Write-Host "🔍 Some API endpoints are not working as expected" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host " Results saved to:" -ForegroundColor Cyan
    Write-Host "   $OutputDir/module-a-blackbox-results.json" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Exception: $_" -ForegroundColor Red
    $exitCode = 1
}

exit $exitCode