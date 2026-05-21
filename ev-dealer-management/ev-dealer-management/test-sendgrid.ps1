# Test SendGrid API Key
$apiKey = "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"
$fromEmail = "huynhdang1872005@gmail.com"
$toEmail = "huynhdang1872005@gmail.com"

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

$body = @{
    personalizations = @(
        @{
            to = @(
                @{
                    email = $toEmail
                    name = "Test User"
                }
            )
            subject = "Test Email from EV Dealer - Test Drive"
        }
    )
    from = @{
        email = $fromEmail
        name = "EV Dealer Management"
    }
    content = @(
        @{
            type = "text/html"
            value = "<h2>Test Email</h2><p>This is a test email from EV Dealer Management System</p><p>If you receive this, SendGrid is working correctly!</p>"
        }
    )
} | ConvertTo-Json -Depth 10

try {
    Write-Host "Testing SendGrid API Key..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "https://api.sendgrid.com/v3/mail/send" `
        -Method POST `
        -Headers $headers `
        -Body $body
    
    Write-Host "[SUCCESS] Email sent successfully!" -ForegroundColor Green
    Write-Host "Check inbox: $toEmail" -ForegroundColor Cyan
} catch {
    Write-Host "[FAILED] SendGrid API Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. API Key expired or invalid"
    Write-Host "2. SendGrid account suspended"
    Write-Host "3. Sender email not verified in SendGrid"
    Write-Host "4. Need to create new API Key at: https://app.sendgrid.com/settings/api_keys"
}
