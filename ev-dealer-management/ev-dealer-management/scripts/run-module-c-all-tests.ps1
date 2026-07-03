$ErrorActionPreference = 'Continue'

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " RUNNING ALL TESTS FOR MODULE C (BLACK-BOX & WHITE-BOX)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Run Black-box tests
Write-Host "`n>>> STARTING BLACK-BOX TESTS (NEWMAN)" -ForegroundColor Yellow
$bbProcess = Start-Process -FilePath "powershell" -ArgumentList "-File .\scripts\run-module-c-blackbox-tests.ps1 -SkipHealthCheck" -NoNewWindow -Wait -PassThru
$bbExitCode = $bbProcess.ExitCode

# 2. Run White-box tests
Write-Host "`n>>> STARTING WHITE-BOX TESTS (XUNIT)" -ForegroundColor Yellow
$wbProcess = Start-Process -FilePath "powershell" -ArgumentList "-File .\scripts\run-module-c-whitebox-tests.ps1" -NoNewWindow -Wait -PassThru
$wbExitCode = $wbProcess.ExitCode

# 3. Final Summary
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host " OVERALL EXECUTION SUMMARY" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

if ($bbExitCode -eq 0) {
    Write-Host "BLACK-BOX TESTS: PASS" -ForegroundColor Green
} else {
    Write-Host "BLACK-BOX TESTS: FAIL (Exit Code: $bbExitCode)" -ForegroundColor Red
}

if ($wbExitCode -eq 0) {
    Write-Host "WHITE-BOX TESTS: PASS" -ForegroundColor Green
} else {
    Write-Host "WHITE-BOX TESTS: FAIL (Exit Code: $wbExitCode)" -ForegroundColor Red
}

$finalExitCode = 0
if ($bbExitCode -ne 0 -or $wbExitCode -ne 0) {
    $finalExitCode = 1
    Write-Host "`nFINAL STATUS: FAILED" -ForegroundColor Red
} else {
    Write-Host "`nFINAL STATUS: ALL PASSED" -ForegroundColor Green
}

Write-Host "`nCheck the 'reports' and 'reports/whitebox' directories for detailed execution logs." -ForegroundColor DarkYellow
Write-Host "============================================================" -ForegroundColor Cyan
exit $finalExitCode
