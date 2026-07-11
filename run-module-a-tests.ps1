# run-module-a-tests.ps1
# Script cơ bản để chạy Module A test suite

param(
    [string]$CollectionPath = "Module_A_Test_Suite.json",
    [string]$EnvironmentPath = "",
    [string]$OutputDir = "Logs",
    [switch]$Verbose
)

# Kiểm tra Newman đã cài chưa
Write-Host "Checking Newman installation..." -ForegroundColor Cyan
$newmanVersion = newman --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Newman is not installed. Installing..." -ForegroundColor Red
    npm install -g newman
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Newman. Please install manually: npm install -g newman" -ForegroundColor Red
        exit 1
    }
}
Write-Host "Newman version: $newmanVersion" -ForegroundColor Green

# Tạo thư mục Logs nếu chưa có
if (-not (Test-Path $OutputDir)) {
    Write-Host "Creating Logs directory..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Kiểm tra file collection có tồn tại không
if (-not (Test-Path $CollectionPath)) {
    Write-Host "Collection file not found: $CollectionPath" -ForegroundColor Red
    exit 1
}

# Xây dựng command
$newmanCommand = "newman run `"$CollectionPath`""

if ($EnvironmentPath -and (Test-Path $EnvironmentPath)) {
    $newmanCommand += " -e `"$EnvironmentPath`""
}

$newmanCommand += " --reporters cli,json"
$newmanCommand += " --reporter-json-export `"$OutputDir/module-a-results.json`""

if ($Verbose) {
    $newmanCommand += " -r cli,json,htmlextra"
    $newmanCommand += " --reporter-htmlextra-export `"$OutputDir/module-a-report.html`""
}

Write-Host "Running Module A Tests..." -ForegroundColor Cyan
Write-Host "Command: $newmanCommand" -ForegroundColor Gray
Write-Host ""

# Chạy Newman
Invoke-Expression $newmanCommand
$exitCode = $LASTEXITCODE

# Kiểm tra kết quả
Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "Module A Tests PASSED!" -ForegroundColor Green
    Write-Host "Results saved to: $OutputDir/module-a-results.json" -ForegroundColor Green
} else {
    Write-Host "Module A Tests FAILED!" -ForegroundColor Red
    Write-Host "Results saved to: $OutputDir/module-a-results.json" -ForegroundColor Yellow
    Write-Host "Exit code: $exitCode" -ForegroundColor Red
}

exit $exitCode