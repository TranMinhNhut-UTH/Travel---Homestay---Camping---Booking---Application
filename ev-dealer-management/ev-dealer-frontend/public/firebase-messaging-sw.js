// Firebase Cloud Messaging Service Worker
// Handles background notifications when app is not in focus

// Import Firebase scripts from CDN
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
// Note: These are PUBLIC values, safe to expose in client-side code
const firebaseConfig = {
  apiKey: "AIzaSyArrL2n6gGWONEb9TdPrKPpeT7tjefRfYs",
  authDomain: "ev-dealer-management-6c620.firebaseapp.com",
  projectId: "ev-dealer-management-6c620",
  storageBucket: "ev-dealer-management-6c620.firebasestorage.app",
  messagingSenderId: "520880625592",
  appId: "1:520880625592:web:1df820e4a127e1b3a9614d",
  measurementId: "G-5XMQ07YBW6"
};

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Background message received:', payload);

  // Extract notification info
  const notificationTitle = payload.notification?.title || 'EV Dealer Management';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/logo.png',
    badge: '/badge.png',
    tag: payload.data?.type || 'notification',
    data: payload.data || {},
    requireInteraction: false,
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'view',
        title: 'Xem chi tiết',
        icon: '/icons/view.png'
      },
      {
        action: 'dismiss',
        title: 'Đóng',
        icon: '/icons/close.png'
      }
    ]
  };

  // Show notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);

  event.notification.close();

  if (event.action === 'view') {
    // Open app when notification clicked
    const urlToOpen = new URL('/', self.location.origin).href;
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          // Check if app is already open
          for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window if app not open
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    console.log('[Service Worker] Notification dismissed');
  } else {
    // Default action - open app
    const urlToOpen = new URL('/', self.location.origin).href;
    event.waitUntil(clients.openWindow(urlToOpen));
  }
});

console.log('[Service Worker] Firebase messaging service worker loaded');
