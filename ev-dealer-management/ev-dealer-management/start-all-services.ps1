$repoRoot = Split-Path -Parent $PSScriptRoot
$backendRoot = Join-Path $repoRoot "ev-dealer-management"
$frontendRoot = Join-Path $repoRoot "ev-dealer-frontend"

$services = @(
    @{ Name = "UserService"; Path = (Join-Path $backendRoot "UserService") },
    @{ Name = "SalesService"; Path = (Join-Path $backendRoot "SalesService") },
    @{ Name = "VehicleService"; Path = (Join-Path $backendRoot "VehicleService") },
    @{ Name = "CustomerService"; Path = (Join-Path $backendRoot "CustomerService") },
    @{ Name = "ReportingService"; Path = (Join-Path $backendRoot "ReportingService") },
    @{ Name = "APIGatewayService"; Path = (Join-Path $backendRoot "APIGatewayService") }
)

$tabs = @()

foreach ($service in $services) {
    $tabs += "new-tab --title `"$($service.Name)`" -d `"$($service.Path)`" powershell -NoExit -Command `"dotnet run`""
}

$frontendCommand = "Set-Location `"$frontendRoot`"; if (-not (Test-Path node_modules)) { npm install }; npm run dev"
$tabs += "new-tab --title `"Frontend`" -d `"$frontendRoot`" powershell -NoExit -Command `"$frontendCommand`""

$wtArgs = ($tabs -join ' ; ')

Write-Host "Opening backend services and frontend in Windows Terminal tabs..."
Start-Process wt -ArgumentList $wtArgs