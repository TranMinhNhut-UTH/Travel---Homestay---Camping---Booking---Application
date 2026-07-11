# run-module-a-all-tests.ps1
# Chạy tất cả Module A tests với đầy đủ logging và reporting

param(
    [string]$CollectionPath = "Module_A_Test_Suite.json",
    [string]$OutputDir = "Logs",
    [switch]$SkipCleanup,
    [switch]$GenerateHTMLReport
)

# Setup
$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "$OutputDir/module-a-all-tests-$timestamp.log"

# Function: Log message
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    $logEntry = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
    Write-Host $logEntry -ForegroundColor $Color
    Add-Content -Path $logFile -Value $logEntry
}

# Initialize
Write-Log "🚀 Starting Module A Full Test Suite" "Cyan"
Write-Log "Timestamp: $timestamp" "Gray"

# Kiểm tra dependencies
Write-Log "🔍 Checking dependencies..." "Cyan"

# Check Newman
try {
    $newmanVersion = newman --version 2>$null
    Write-Log "✅ Newman: $newmanVersion" "Green"
} catch {
    Write-Log "❌ Newman not found. Installing..." "Red"
    npm install -g newman
    if ($LASTEXITCODE -ne 0) {
        Write-Log "❌ Failed to install Newman" "Red"
        exit 1
    }
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Log "✅ Node.js: $nodeVersion" "Green"
} catch {
    Write-Log "❌ Node.js not found" "Red"
    exit 1
}

# Tạo thư mục output
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Log "📁 Created Logs directory" "Cyan"
}

# Cleanup old results
if (-not $SkipCleanup) {
    Write-Log "🧹 Cleaning up old test results..." "Cyan"
    Remove-Item "$OutputDir/module-a-*.json" -ErrorAction SilentlyContinue
    Remove-Item "$OutputDir/module-a-*.html" -ErrorAction SilentlyContinue
}

# Chạy tests
Write-Log "🚀 Running Module A Tests..." "Cyan"
Write-Log "Collection: $CollectionPath" "Gray"

$newmanArgs = @(
    "run", $CollectionPath,
    "--reporters", "cli,json,junit",
    "--reporter-json-export", "$OutputDir/module-a-results.json",
    "--reporter-junit-export", "$OutputDir/module-a-junit.xml",
    "--bail"
)

if ($GenerateHTMLReport) {
    $newmanArgs += "--reporter-htmlextra-export", "$OutputDir/module-a-report.html"
}

try {
    newman @newmanArgs
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Log "✅ All Module A tests PASSED!" "Green"
    } else {
        Write-Log "❌ Module A tests FAILED with exit code: $exitCode" "Red"
    }
} catch {
    Write-Log "❌ Exception occurred: $_" "Red"
    $exitCode = 1
}

# Summary
Write-Log "" "Gray"
Write-Log "📊 Test Summary:" "Cyan"
Write-Log "  - Results JSON: $OutputDir/module-a-results.json" "Gray"
Write-Log "  - JUnit XML: $OutputDir/module-a-junit.xml" "Gray"
if ($GenerateHTMLReport) {
    Write-Log "  - HTML Report: $OutputDir/module-a-report.html" "Gray"
}
Write-Log "  - Log File: $logFile" "Gray"

# Exit
exit $exitCode