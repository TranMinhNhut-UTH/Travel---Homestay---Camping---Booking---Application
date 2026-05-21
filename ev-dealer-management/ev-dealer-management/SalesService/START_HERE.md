# 🎯 QUICK START - Test Complete Order Feature

## ⚡ 30-Second Test

### Start Services (4 commands):
```powershell
# Terminal 1: RabbitMQ (if not running)
docker start rabbitmq

# Terminal 2: NotificationService
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\NotificationService; dotnet run

# Terminal 3: SalesService
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\SalesService; dotnet run

# Terminal 4: Frontend
cd D:\Nam_3\ev-dealer-management\ev-dealer-frontend; npm run dev
```

### Test (3 clicks):
1. Open: http://localhost:5173
2. Click: **Sales** → **Xem chi tiết** (any order)
3. Click: Green button **"Hoàn tất đơn hàng"**

### Verify (2 checks):
✅ Toast appears: "Đơn hàng hoàn tất thành công! ... Mã đơn: ORD-..."
✅ Status badge: "Hoàn thành" (green)

---

## 🎨 Visual Guide

### Where to Find the Button:
```
┌─────────────────────────────────────────────────────┐
│ ORDER DETAIL PAGE                                   │
├───────────────────┬─────────────────────────────────┤
│                   │  ← RIGHT SIDEBAR                │
│  Order Info       │  ┌─────────────────────────┐   │
│  Customer Info    │  │  Tóm tắt đơn hàng       │   │
│  Vehicle Info     │  │  ...                    │   │
│  Payment Info     │  └─────────────────────────┘   │
│  Contracts        │                                 │
│                   │  ┌─────────────────────────┐   │
│                   │  │  Thông tin thanh toán   │   │
│                   │  │  ...                    │   │
│                   │  └─────────────────────────┘   │
│                   │                                 │
│                   │  ┌─────────────────────────┐   │
│                   │  │  Thao tác nhanh         │   │
│                   │  │  [In đơn hàng]         │   │
│                   │  │  [Hoàn tất đơn hàng]   │ ← HERE!
│                   │  └─────────────────────────┘   │
└───────────────────┴─────────────────────────────────┘
```

### Button States:
```
BEFORE CLICK:
┌────────────────────────┐
│  ✅ Hoàn tất đơn hàng  │  ← Green, clickable
└────────────────────────┘

DURING API CALL:
┌────────────────────────┐
│  ⏳ Đang xử lý...      │  ← Gray, disabled
└────────────────────────┘

AFTER SUCCESS:
┌────────────────────────┐
│  ✅ Đã hoàn tất        │  ← Gray, disabled
└────────────────────────┘

TOAST NOTIFICATION:
┌──────────────────────────────────────────────────┐
│  ✅ Đơn hàng hoàn tất thành công!               │
│     Email xác nhận đã được gửi đến              │
│     customer@example.com.                       │
│     Mã đơn: ORD-20251122-A1B2C3D4              │
└──────────────────────────────────────────────────┘
```

---

## 🔍 What Happens Behind the Scenes:

```
1. Button Click
   ↓
2. Frontend → SalesService API
   POST http://localhost:5003/api/orders/complete
   ↓
3. SalesService → RabbitMQ
   Publish to queue: "sales.completed"
   ↓
4. RabbitMQ → NotificationService
   Deliver message to consumer
   ↓
5. NotificationService → SendGrid
   Send email via SendGrid API
   ↓
6. SendGrid → Customer Inbox
   Email delivered
   ↓
7. Frontend ← SalesService
   Return OrderId
   ↓
8. Show Success Toast
   ✅ Done!
```

---

## 🚨 Troubleshooting (1 Minute)

### Problem: Button does nothing
**Fix**: Check SalesService is running
```powershell
netstat -ano | findstr :5003
# If nothing, start SalesService:
cd D:\Nam_3\ev-dealer-management\ev-dealer-management\SalesService; dotnet run
```

### Problem: Error toast appears
**Fix**: Check browser console (F12)
```
Look for red error messages
Common: "Failed to fetch" = Service not running
```

### Problem: No email sent
**Fix**: Check NotificationService logs
```
Should see: "Email sent successfully"
If not: Check SendGrid API key in appsettings.json
```

---

## 📋 Quick Checklist

Before testing:
- [ ] Docker running (for RabbitMQ)
- [ ] NotificationService terminal open (port 5051)
- [ ] SalesService terminal open (port 5003)
- [ ] Frontend dev server running

During test:
- [ ] Can navigate to Order Detail page
- [ ] Can see green "Hoàn tất đơn hàng" button
- [ ] Button changes to "Đang xử lý..." when clicked

After test:
- [ ] Success toast appears with OrderId
- [ ] Status badge shows "Hoàn thành" (green)
- [ ] Button shows "Đã hoàn tất" (disabled)
- [ ] SalesService logs: "Published message"
- [ ] NotificationService logs: "Email sent successfully"

---

## 🎓 Key Files Modified

| File | What Changed |
|------|--------------|
| `OrderDetail.jsx` | Added Complete Order button + API integration |
| Lines 1-5 | Import NotificationToast |
| Lines 84-85 | State: notification, completing |
| Lines 171-239 | Handler: handleCompleteOrder (API call) |
| Lines 786-806 | Button: Click → API → Toast |
| Lines 995-1001 | Component: NotificationToast |

---

## 🎉 Success Criteria

✅ All services started  
✅ Button clicked  
✅ Toast shows success  
✅ Order status updated  
✅ Email sent  

**If all ✅ → YOU'RE DONE! 🎊**

---

## 📚 Full Documentation

- `INTEGRATION_COMPLETE.md` - Detailed summary
- `FRONTEND_INTEGRATION.md` - Technical details + flow diagrams
- `QUICK_TEST.md` - Step-by-step testing guide

---

**Need help? Check the logs in all 3 terminals!**

