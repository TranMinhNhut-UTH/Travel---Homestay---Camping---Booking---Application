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

foreach ($service in $services) {
    $tabs += "new-tab --title `"$($service.Name)`" -d `"$($service.Path)`" powershell -NoExit -Command `"Set-Location '$($service.Path)'; $env:ASPNETCORE_URLS='$($service.Url)'; dotnet run`""
}

$frontendCommand = "Set-Location `"$frontendRoot`"; if (-not (Test-Path node_modules)) { npm install }; npm run dev"
$tabs += "new-tab --title `"Frontend`" -d `"$frontendRoot`" powershell -NoExit -Command `"$frontendCommand`""

$wtArgs = ($tabs -join ' ; ')

Write-Host "Opening backend services and frontend in Windows Terminal tabs..."
Start-Process wt -ArgumentList $wtArgs