$ErrorActionPreference = "Continue"

Write-Host "============================================================"
Write-Host "  RUNNING ALL MODULE C TESTS (BLACKBOX + WHITEBOX)"
Write-Host "============================================================"

Write-Host "`n[1/2] RUNNING BLACKBOX TESTS (Newman)..."
.\scripts\run-module-c-blackbox-tests.ps1 -SkipHealthCheck

Write-Host "`n[2/2] RUNNING WHITEBOX TESTS (dotnet test)..."
dotnet test SalesService.Tests/SalesService.Tests.csproj --logger "trx" --collect:"XPlat Code Coverage"

Write-Host "`n============================================================"
Write-Host "  ALL TESTS COMPLETED"
Write-Host "============================================================"
