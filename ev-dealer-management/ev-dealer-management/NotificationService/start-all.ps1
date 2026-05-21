# 🚀 Start All Services - Test Notification
# Chạy file này để start tất cả services cùng lúc

Write-Host "🚀 Starting EV Dealer Management System..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Start RabbitMQ
Write-Host "1️⃣ Starting RabbitMQ..." -ForegroundColor Yellow
try {
    $rabbitmqStatus = docker ps --filter "name=rabbitmq" --format "{{.Status}}"
    if ($rabbitmqStatus) {
        Write-Host "   ✅ RabbitMQ already running" -ForegroundColor Green
    } else {
        docker start rabbitmq 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ RabbitMQ started" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Creating new RabbitMQ container..." -ForegroundColor Yellow
            docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
            Write-Host "   ✅ RabbitMQ created and started" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "   ❌ Error with RabbitMQ: $_" -ForegroundColor Red
}

Start-Sleep -Seconds 2
Write-Host ""

# 2. Start NotificationService
Write-Host "2️⃣ Starting NotificationService..." -ForegroundColor Yellow
$notificationPath = "D:\Nam_3\ev-dealer-management\ev-dealer-management\NotificationService"
if (Test-Path $notificationPath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$notificationPath'; Write-Host '🔔 NotificationService' -ForegroundColor Cyan; dotnet run"
    Write-Host "   ✅ NotificationService terminal opened (Port 5005)" -ForegroundColor Green
} else {
    Write-Host "   ❌ NotificationService path not found" -ForegroundColor Red
}

Start-Sleep -Seconds 1
Write-Host ""

# 3. Start VehicleService
Write-Host "3️⃣ Starting VehicleService..." -ForegroundColor Yellow
$vehiclePath = "D:\Nam_3\ev-dealer-management\ev-dealer-management\VehicleService"
if (Test-Path $vehiclePath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$vehiclePath'; Write-Host '🚗 VehicleService' -ForegroundColor Cyan; dotnet run"
    Write-Host "   ✅ VehicleService terminal opened (Port 5002)" -ForegroundColor Green
} else {
    Write-Host "   ❌ VehicleService path not found" -ForegroundColor Red
}

Start-Sleep -Seconds 1
Write-Host ""

# 4. Start Frontend
Write-Host "4️⃣ Starting Frontend (React + Vite)..." -ForegroundColor Yellow
$frontendPath = "D:\Nam_3\ev-dealer-management\ev-dealer-frontend"
if (Test-Path $frontendPath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🌐 Frontend' -ForegroundColor Cyan; npm run dev"
    Write-Host "   ✅ Frontend terminal opened (Port 5173)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend path not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Service URLs:" -ForegroundColor Cyan
Write-Host "   🌐 Frontend:           http://localhost:5173" -ForegroundColor White
Write-Host "   🚗 VehicleService:     http://localhost:5002" -ForegroundColor White
Write-Host "   🔔 NotificationService: http://localhost:5005" -ForegroundColor White
Write-Host "   🐰 RabbitMQ Management: http://localhost:15672 (guest/guest)" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Wait 30 seconds for all services to start" -ForegroundColor White
Write-Host "   2. Open browser: http://localhost:5173/vehicles" -ForegroundColor White
Write-Host "   3. Click on a vehicle → Reserve → See notification!" -ForegroundColor White
Write-Host ""
Write-Host "📝 Test Guide: See DEMO_2_PHUT.md or TEST_FRONTEND.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
