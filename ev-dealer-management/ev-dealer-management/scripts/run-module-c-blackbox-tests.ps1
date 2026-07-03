<#
.SYNOPSIS
    Module C Black-Box Test Runner — Newman CLI automation
.DESCRIPTION
    Chạy toàn bộ test cases Module C (ED-23 + ED-30) từ Postman collection
    sử dụng Newman CLI. Xuất report JSON + JUnit XML.
.NOTES
    Dự án: EV Dealer Management System
    Yêu cầu: Node.js 18+, Newman 6+
#>

param(
    [switch]$SkipHealthCheck,
    [switch]$Verbose,
    [string]$ReportDir = "reports"
)

$ErrorActionPreference = "Stop"

# ============================================================
# 1. CONSTANTS
# ============================================================
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
$COLLECTION_FILE = Join-Path $PROJECT_ROOT "EV Dealer Management API.postman_collection.json"
$ENVIRONMENT_FILE = Join-Path (Join-Path $PROJECT_ROOT "postman") "Module_C_Local.postman_environment.json"
$REPORT_DIR = Join-Path $PROJECT_ROOT $ReportDir
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"

# Module C folders trong Postman collection
$MODULE_C_FOLDERS = @(
    "Module C - Quotes",
    "Module C - Orders",
    "Module C - Contracts",
    "Module C - Payments",
    "Module C - Deliveries & Promotions",
    "Module C - Sales Composite API",
    "Module C - Reporting API",
    "Module C - Notification & E2E Flow"
)

# Service health check endpoints
$SERVICES = @(
    @{ Name = "SalesService";        Port = 5003; Endpoint = "http://localhost:5003/api/Quotes" },
    @{ Name = "ReportingService";    Port = 5208; Endpoint = "http://localhost:5208/api/reports/summary" },
    @{ Name = "NotificationService"; Port = 5051; Endpoint = "http://localhost:5051/api/Notification" }
)

# ============================================================
# 2. HELPER FUNCTIONS
# ============================================================
function Write-Step {
    param([string]$Step, [string]$Message)
    Write-Host "`n[$Step] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "  ✅ $Message" -ForegroundColor Green
}

function Write-Fail {
    param([string]$Message)
    Write-Host "  ❌ $Message" -ForegroundColor Red
}

function Write-Warn {
    param([string]$Message)
    Write-Host "  ⚠️  $Message" -ForegroundColor Yellow
}

# ============================================================
# 3. PRE-FLIGHT CHECKS
# ============================================================
Write-Host ("=" * 60) -ForegroundColor DarkGray
Write-Host "  Module C Black-Box Test Runner" -ForegroundColor White
Write-Host "  EV Dealer Management System" -ForegroundColor DarkGray
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor DarkGray
Write-Host ("=" * 60) -ForegroundColor DarkGray

# 3.1 Check Newman
Write-Step "1/5" "Kiểm tra Newman CLI..."
$newmanVersion = $null
try {
    $newmanVersion = & newman --version 2>&1
    Write-Success "Newman v$newmanVersion"
} catch {
    Write-Fail "Newman chưa cài đặt. Chạy: npm install -g newman"
    exit 1
}

# 3.2 Check collection file
Write-Step "2/5" "Kiểm tra Postman collection..."
if (Test-Path $COLLECTION_FILE) {
    $fileSize = (Get-Item $COLLECTION_FILE).Length
    Write-Success "Collection found ($([math]::Round($fileSize/1KB, 1)) KB)"
} else {
    Write-Fail "Không tìm thấy collection: $COLLECTION_FILE"
    exit 1
}

# 3.3 Check environment file (optional)
Write-Step "3/5" "Kiểm tra environment file..."
$useEnvironment = $false
if (Test-Path $ENVIRONMENT_FILE) {
    Write-Success "Environment found: $ENVIRONMENT_FILE"
    $useEnvironment = $true
} else {
    Write-Warn "Không tìm thấy environment file. Chạy với default URLs."
}

# 3.4 Health check services
if (-not $SkipHealthCheck) {
    Write-Step "4/5" "Health check services..."
    $allHealthy = $true
    foreach ($svc in $SERVICES) {
        try {
            $response = Invoke-WebRequest -Uri $svc.Endpoint -Method GET -TimeoutSec 5 -ErrorAction Stop
            Write-Success "$($svc.Name) :$($svc.Port) — HTTP $($response.StatusCode)"
        } catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            if ($statusCode -and $statusCode -lt 500) {
                Write-Warn "$($svc.Name) :$($svc.Port) — HTTP $statusCode (có thể OK)"
            } else {
                Write-Fail "$($svc.Name) :$($svc.Port) — KHÔNG PHẢN HỒI"
                $allHealthy = $false
            }
        }
    }
    if (-not $allHealthy) {
        Write-Warn "Một số services không phản hồi. Test có thể FAIL."
        $continue = Read-Host "Tiếp tục? (y/N)"
        if ($continue -ne "y") {
            Write-Host "Đã hủy." -ForegroundColor Yellow
            exit 0
        }
    }
} else {
    Write-Step "4/5" "Bỏ qua health check (SkipHealthCheck)."
}

# 3.5 Create report directory
Write-Step "5/5" "Tạo thư mục report..."
if (-not (Test-Path $REPORT_DIR)) {
    New-Item -ItemType Directory -Path $REPORT_DIR -Force | Out-Null
}
Write-Success "Report dir: $REPORT_DIR"

# ============================================================
# 4. RUN NEWMAN
# ============================================================
Write-Host ("`n" + ("=" * 60)) -ForegroundColor DarkGray
Write-Host "  RUNNING MODULE C TESTS" -ForegroundColor White
Write-Host ("=" * 60) -ForegroundColor DarkGray

# Build Newman arguments
$newmanArgs = @(
    "run",
    "`"$COLLECTION_FILE`""
)

# Add environment if available
if ($useEnvironment) {
    $newmanArgs += @("--environment", "`"$ENVIRONMENT_FILE`"")
}

# Add Module C folders
foreach ($folder in $MODULE_C_FOLDERS) {
    $newmanArgs += @("--folder", "`"$folder`"")
}

# Add reporters
$jsonReport = Join-Path $REPORT_DIR "module-c-newman-report_$TIMESTAMP.json"
$junitReport = Join-Path $REPORT_DIR "module-c-newman-report_$TIMESTAMP.xml"
$latestJsonReport = Join-Path $REPORT_DIR "module-c-newman-report.json"
$latestJunitReport = Join-Path $REPORT_DIR "module-c-newman-report.xml"

$newmanArgs += @(
    "--reporters", "`"cli,json,junit`"",
    "--reporter-json-export", "`"$jsonReport`"",
    "--reporter-junit-export", "`"$junitReport`""
)

# Add verbose flag if requested
if ($Verbose) {
    $newmanArgs += "--verbose"
}

# Execute
$newmanCommand = "newman " + ($newmanArgs -join " ")
Write-Host "`nCommand:" -ForegroundColor DarkGray
Write-Host $newmanCommand -ForegroundColor DarkGray
Write-Host ""

$startTime = Get-Date
$exitCode = 0

try {
    # Sử dụng Invoke-Expression vì newman args phức tạp
    Invoke-Expression $newmanCommand
    $exitCode = $LASTEXITCODE
} catch {
    Write-Fail "Newman execution error: $_"
    $exitCode = 1
}

$endTime = Get-Date
$duration = $endTime - $startTime

# ============================================================
# 5. COPY LATEST REPORTS
# ============================================================
if (Test-Path $jsonReport) {
    Copy-Item $jsonReport $latestJsonReport -Force
}
if (Test-Path $junitReport) {
    Copy-Item $junitReport $latestJunitReport -Force
}

# ============================================================
# 6. SUMMARY
# ============================================================
Write-Host ("`n" + ("=" * 60)) -ForegroundColor DarkGray
Write-Host "  TEST EXECUTION SUMMARY" -ForegroundColor White
Write-Host ("=" * 60) -ForegroundColor DarkGray

Write-Host "  Duration    : $($duration.ToString('mm\:ss\.fff'))"
Write-Host "  Exit Code   : $exitCode"
Write-Host "  JSON Report : $jsonReport"
Write-Host "  JUnit Report: $junitReport"

if ($exitCode -eq 0) {
    Write-Host "`n  🎉 ALL TESTS PASSED" -ForegroundColor Green
} else {
    Write-Host "`n  ❌ SOME TESTS FAILED — Check report for details" -ForegroundColor Red
}

# Parse JSON report for quick stats (if available)
if (Test-Path $latestJsonReport) {
    try {
        $report = Get-Content $latestJsonReport -Raw | ConvertFrom-Json
        $stats = $report.run.stats
        Write-Host "`n  Quick Stats:" -ForegroundColor Cyan
        Write-Host "    Requests   : $($stats.requests.total) total, $($stats.requests.failed) failed"
        Write-Host "    Assertions : $($stats.assertions.total) total, $($stats.assertions.failed) failed"
        Write-Host "    Scripts    : $($stats.testScripts.total) total, $($stats.testScripts.failed) failed"
    } catch {
        Write-Warn "Không parse được JSON report."
    }
}

Write-Host ("`n" + ("=" * 60)) -ForegroundColor DarkGray

exit $exitCode
