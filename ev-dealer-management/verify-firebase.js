# Quick Verification Script
# Chạy trong Browser Console (F12)

console.log("=== Firebase Notification Check ===");

// 1. Check Notification Permission
console.log("1. Permission:", Notification.permission);
if (Notification.permission !== "granted") {
    console.error("❌ Permission not granted!");
    console.log("Fix: Click lock icon in address bar → Notifications → Allow");
}

// 2. Check Service Worker
navigator.serviceWorker.getRegistrations().then(regs => {
    console.log(`2. Service Workers: ${regs.length} found`);
    regs.forEach((reg, i) => {
        console.log(`   SW ${i+1}:`, reg.scope);
        console.log(`   Active:`, reg.active?.state);
    });
    if (regs.length === 0) {
        console.error("❌ No service worker registered!");
    }
});

// 3. Check Device Token
const token = localStorage.getItem('fcm_device_token');
console.log("3. Device Token:", token ? "✅ EXISTS" : "❌ MISSING");
if (token) {
    console.log("   Token preview:", token.substring(0, 50) + "...");
} else {
    console.error("❌ No device token! Notifications will not work.");
}

// 4. Test Local Notification
if (Notification.permission === "granted") {
    console.log("4. Testing local notification...");
    new Notification("✅ Test Success", {
        body: "If you see this, notifications are working!",
        icon: "/favicon.ico"
    });
} else {
    console.log("4. Cannot test - permission denied");
}

console.log("=== Check Complete ===");
