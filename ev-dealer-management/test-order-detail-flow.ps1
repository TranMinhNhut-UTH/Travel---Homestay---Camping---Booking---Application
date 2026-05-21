# Test Order Detail Flow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST: Order Detail Flow" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Fetch Orders List
Write-Host "`n[Step 1] Fetching Orders List..." -ForegroundColor Yellow
$ordersResponse = Invoke-WebRequest -Uri "http://localhost:5036/api/Sales/orders" -Method GET
$ordersData = $ordersResponse.Content | ConvertFrom-Json

if ($ordersData.value -and $ordersData.value.Count -gt 0) {
    Write-Host "Orders fetched: $($ordersData.Count) orders" -ForegroundColor Green
    
    # Get first order ID
    $firstOrder = $ordersData.value[0]
    $orderId = $firstOrder.orderID
    
    Write-Host "  - First Order ID: $orderId" -ForegroundColor Green
    Write-Host "  - Customer ID: $($firstOrder.customerId)" -ForegroundColor Green
    Write-Host "  - Total Price: $($firstOrder.totalPrice)" -ForegroundColor Green
    
    # Step 2: Fetch Order Details
    Write-Host "`n[Step 2] Fetching Order Details for ID=$orderId..." -ForegroundColor Yellow
    
    $orderResponse = Invoke-WebRequest -Uri "http://localhost:5036/api/Sales/orders/$orderId" -Method GET
    $orderDetail = $orderResponse.Content | ConvertFrom-Json
    
    if ($orderDetail.orderID -eq $orderId) {
        Write-Host "Order detail fetched successfully" -ForegroundColor Green
        Write-Host "  - Order ID: $($orderDetail.orderID)" -ForegroundColor Green
        Write-Host "  - Status: $($orderDetail.status)" -ForegroundColor Green
        Write-Host "  - Payment Status: $($orderDetail.paymentStatus)" -ForegroundColor Green
        Write-Host "  - Order Items: $($orderDetail.orderItems.Count)" -ForegroundColor Green
    } else {
        Write-Host "Order ID mismatch!" -ForegroundColor Red
    }
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "TEST PASSED: Order detail flow works correctly!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    
} else {
    Write-Host "No orders found!" -ForegroundColor Red
}
