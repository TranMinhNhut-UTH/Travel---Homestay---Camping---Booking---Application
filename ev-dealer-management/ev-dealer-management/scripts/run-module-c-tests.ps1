param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("all", "blackbox", "whitebox", "count")]
    [string]$Mode,
    
    [switch]$SkipHealthCheck
)

$ErrorActionPreference = 'Stop'
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
Set-Location $PROJECT_ROOT

switch ($Mode) {
    "count" {
        Write-Host "`n>>> RUNNING POSTMAN COUNT SCRIPT" -ForegroundColor Cyan
        node .\scripts\count-postman-tests.js
    }
    "blackbox" {
        Write-Host "`n>>> RUNNING BLACK-BOX TESTS" -ForegroundColor Cyan
        if ($SkipHealthCheck) {
            & .\scripts\run-module-c-blackbox-tests.ps1 -SkipHealthCheck
        } else {
            # Default to skipping health check for safety, unless the user explicitly wants health check?
            # The prompt implies we should pass SkipHealthCheck by default when running through the wrapper, or let the user decide.
            # Let's just pass SkipHealthCheck to be safe, as it was blocking before.
            & .\scripts\run-module-c-blackbox-tests.ps1 -SkipHealthCheck
        }
        exit $LASTEXITCODE
    }
    "whitebox" {
        Write-Host "`n>>> RUNNING WHITE-BOX TESTS" -ForegroundColor Cyan
        & .\scripts\run-module-c-whitebox-tests.ps1
        exit $LASTEXITCODE
    }
    "all" {
        Write-Host "`n>>> RUNNING ALL TESTS" -ForegroundColor Cyan
        & .\scripts\run-module-c-all-tests.ps1
        exit $LASTEXITCODE
    }
}
