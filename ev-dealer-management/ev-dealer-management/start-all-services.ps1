$repoRoot = Split-Path -Parent $PSScriptRoot
$backendRoot = Join-Path $repoRoot "ev-dealer-management"
$frontendRoot = Join-Path $repoRoot "ev-dealer-frontend"

$services = @(
    @{ Name = "UserService"; Path = (Join-Path $backendRoot "UserService"); Url = "http://localhost:7001" },
    @{ Name = "SalesService"; Path = (Join-Path $backendRoot "SalesService"); Url = "http://localhost:5003" },
    @{ Name = "VehicleService"; Path = (Join-Path $backendRoot "VehicleService"); Url = "http://localhost:5068" },
    @{ Name = "CustomerService"; Path = (Join-Path $backendRoot "CustomerService"); Url = "http://localhost:5039" },
    @{ Name = "ReportingService"; Path = (Join-Path $backendRoot "ReportingService"); Url = "http://localhost:5208" },
    @{ Name = "APIGatewayService"; Path = (Join-Path $backendRoot "APIGatewayService"); Url = "http://localhost:5036" }
)

$tabs = @()
$startupDir = Join-Path $env:TEMP "ev-dealer-management-startup"
New-Item -ItemType Directory -Force -Path $startupDir | Out-Null

function New-ServiceStartupScript {
    param(
        [string]$Name,
        [string]$WorkingDirectory,
        [string]$Url
    )

    $scriptPath = Join-Path $startupDir "$Name-startup.ps1"
    @"
Set-Location '$WorkingDirectory'
`$env:ASPNETCORE_URLS = '$Url'
dotnet run
"@ | Set-Content -Path $scriptPath -Encoding UTF8
    return $scriptPath
}

function New-WtTabCommand {
    param(
        [string]$Title,
        [string]$WorkingDirectory,
        [string]$ScriptPath
    )

    return "new-tab --title `"$Title`" -d `"$WorkingDirectory`" powershell.exe -NoExit -File `"$ScriptPath`""
}

foreach ($service in $services) {
    $startupScript = New-ServiceStartupScript -Name $service.Name -WorkingDirectory $service.Path -Url $service.Url
    $tabs += New-WtTabCommand -Title $service.Name -WorkingDirectory $service.Path -ScriptPath $startupScript
}

$frontendScript = Join-Path $startupDir "Frontend-startup.ps1"
@"
Set-Location '$frontendRoot'
if (-not (Test-Path node_modules)) { npm install }
npm run dev
"@ | Set-Content -Path $frontendScript -Encoding UTF8

$tabs += New-WtTabCommand -Title 'Frontend' -WorkingDirectory $frontendRoot -ScriptPath $frontendScript

Write-Host "Opening backend services and frontend in Windows Terminal tabs..."
$wtArgs = $tabs -join ' ; '
Start-Process wt -ArgumentList $wtArgs