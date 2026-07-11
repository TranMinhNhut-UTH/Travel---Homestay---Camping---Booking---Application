# run-module-a-whitebox-tests.ps1
# Whitebox testing - Focus on internal validation and code coverage
# Test với kiến thức về internal structure, validation logic

param(
    [string]$CollectionPath = "Module_A_Test_Suite.json",
    [string]$OutputDir = "Logs",
    [string]$BaseUrl = "http://localhost:5036",
    [switch]$ValidateInternalLogic,
    [switch]$CheckDataIntegrity
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

Write-Host "⬜ Running Module A WHITEBOX Tests" -ForegroundColor Blue
Write-Host "====================================" -ForegroundColor Blue
Write-Host "Timestamp: $timestamp" -ForegroundColor Gray
Write-Host "Base URL: $BaseUrl" -ForegroundColor Gray
Write-Host ""

# Tạo thư mục Logs
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Whitebox test configuration
$whiteboxConfig = @{
    "focus" = "Internal validation and code coverage"
    "scope" = @(
        "Input validation logic"
        "Business rule enforcement"
        "Data integrity checks"
        "Error handling paths"
        "Edge cases and boundary values"
        "Internal state validation"
    )
    "additional_checks" = @(
        "Response schema validation"
        "Data type consistency"
        "Required field presence"
        "Business logic constraints"
    )
}

Write-Host "📋 Whitebox Test Configuration:" -ForegroundColor Cyan
Write-Host "  Focus: $($whiteboxConfig.focus)" -ForegroundColor Gray
Write-Host "  Scope:" -ForegroundColor Gray
foreach ($item in $whiteboxConfig.scope) {
    Write-Host "    - $item" -ForegroundColor Gray
}
Write-Host ""

# Tạo environment file cho whitebox tests
$envContent = @{
    "name" = "Module A Whitebox Environment"
    "values" = @(
        @{ "key" = "baseUrl"; "value" = $BaseUrl; "enabled" = $true },
        @{ "key" = "validateSchema" = "true"; "enabled" = $true },
        @{ "key" = "checkDataTypes" = "true"; "enabled" = $true }
    )
} | ConvertTo-Json -Depth 10

$envFile = "$OutputDir/module-a-whitebox-env.json"
$envContent | Out-File -FilePath $envFile -Encoding UTF8

Write-Host "🔧 Created whitebox environment: $envFile" -ForegroundColor Gray
Write-Host ""

# Chạy Newman với whitebox focus
$newmanArgs = @(
    "run", $CollectionPath,
    "-e", $envFile,
    "--reporters", "cli,json",
    "--reporter-json-export", "$OutputDir/module-a-whitebox-results.json",
    "--global-var", "baseUrl=$BaseUrl",
    "--delay-request", "50"
)

# Thêm validation flags
if ($ValidateInternalLogic) {
    Write-Host "✅ Internal logic validation enabled" -ForegroundColor Green
    $newmanArgs += "--global-var", "validateInternalLogic=true"
}

if ($CheckDataIntegrity) {
    Write-Host "✅ Data integrity checks enabled" -ForegroundColor Green
    $newmanArgs += "--global-var", "checkDataIntegrity=true"
}

Write-Host " Starting whitebox test execution..." -ForegroundColor Cyan
Write-Host ""

try {
    newman @newmanArgs
    $exitCode = $LASTEXITCODE
    
    Write-Host ""
    if ($exitCode -eq 0) {
        Write-Host "✅ Whitebox tests PASSED!" -ForegroundColor Green
        Write-Host " Internal validation and code coverage checks completed" -ForegroundColor Green
    } else {
        Write-Host "❌ Whitebox tests FAILED!" -ForegroundColor Red
        Write-Host "🐛 Internal logic or data integrity issues detected" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "📁 Results saved to:" -ForegroundColor Cyan
    Write-Host "   $OutputDir/module-a-whitebox-results.json" -ForegroundColor Gray
    Write-Host "   $envFile" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Exception: $_" -ForegroundColor Red
    $exitCode = 1
}

# Cleanup temp files
if (Test-Path $envFile) {
    Remove-Item $envFile -Force
    Write-Host "🧹 Cleaned up temporary environment file" -ForegroundColor Gray
}

exit $exitCode