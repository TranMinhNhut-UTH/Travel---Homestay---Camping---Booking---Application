$ErrorActionPreference = 'Stop'

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " RUNNING WHITE-BOX TESTS FOR MODULE C" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Check dotnet CLI
if (-not (Get-Command "dotnet" -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] dotnet CLI is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# 2. Check test project
$projectPath = "SalesService.Tests\SalesService.Tests.csproj"
if (-not (Test-Path $projectPath)) {
    Write-Host "[ERROR] Test project not found: $projectPath" -ForegroundColor Red
    exit 1
}

# 3. Create reports directory
$reportsDir = "reports\whitebox"
if (-not (Test-Path $reportsDir)) {
    New-Item -ItemType Directory -Path $reportsDir | Out-Null
}

Write-Host "`n[1/3] Running tests with code coverage..." -ForegroundColor Yellow
# Run dotnet test and collect coverage
$process = Start-Process -FilePath "dotnet" -ArgumentList "test $projectPath --collect:""XPlat Code Coverage"" --logger:""trx""" -NoNewWindow -Wait -PassThru
$exitCode = $process.ExitCode

Write-Host "`n[2/3] Processing coverage and test reports..." -ForegroundColor Yellow

# Find latest coverage file
$testResultsDir = "SalesService.Tests\TestResults"
if (Test-Path $testResultsDir) {
    # Find latest cobertura file
    $latestCoverage = Get-ChildItem -Path $testResultsDir -Filter "coverage.cobertura.xml" -Recurse | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($latestCoverage) {
        $destCoverage = Join-Path $reportsDir "module-c-whitebox-coverage.cobertura.xml"
        Copy-Item -Path $latestCoverage.FullName -Destination $destCoverage -Force
        Write-Host "  -> Coverage copied to: $destCoverage" -ForegroundColor Green
    } else {
        Write-Host "  -> No coverage file found." -ForegroundColor DarkYellow
    }

    # Find latest trx file
    $latestTrx = Get-ChildItem -Path $testResultsDir -Filter "*.trx" -Recurse | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($latestTrx) {
        $destTrx = Join-Path $reportsDir "module-c-whitebox-test-results.trx"
        Copy-Item -Path $latestTrx.FullName -Destination $destTrx -Force
        Write-Host "  -> TRX report copied to: $destTrx" -ForegroundColor Green
    }
}

Write-Host "`n[3/3] Execution Summary" -ForegroundColor Yellow
if ($exitCode -eq 0) {
    Write-Host "STATUS: PASS" -ForegroundColor Green
} else {
    Write-Host "STATUS: FAIL (Exit Code: $exitCode)" -ForegroundColor Red
}

Write-Host "============================================================" -ForegroundColor Cyan
exit $exitCode
