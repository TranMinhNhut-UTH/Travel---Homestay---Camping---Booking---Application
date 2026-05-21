import { requestNotificationPermission, onMessageListener, getCurrentToken } from './messaging';

/**
 * Notification Service
 * Handles all Firebase Cloud Messaging operations
 */

const DEVICE_TOKEN_KEY = 'fcm_device_token';

/**
 * Initialize notifications (request permission and save token)
 * Call this when app loads
 */
export const initializeNotifications = async () => {
  try {
    console.log('🔔 Initializing notifications...');
    
    // Check if already have permission
    if (Notification.permission === 'granted') {
      const token = await getCurrentToken();
      if (token) {
        localStorage.setItem(DEVICE_TOKEN_KEY, token);
        console.log('✅ Device token restored from Firebase');
        return token;
      }
    }

    // Request permission and get new token
    const token = await requestNotificationPermission();
    
    if (token) {
      // Save token to localStorage
      localStorage.setItem(DEVICE_TOKEN_KEY, token);
      console.log('✅ Device token saved to localStorage');
      
      // TODO: Optional - Send token to backend to save in database
      // await saveTokenToBackend(token);
      
      return token;
    } else {
      console.warn('⚠️ Failed to get device token');
      return null;
    }
  } catch (error) {
    console.error('❌ Error initializing notifications:', error);
    return null;
  }
};

/**
 * Get device token from localStorage
 */
export const getDeviceToken = () => {
  return localStorage.getItem(DEVICE_TOKEN_KEY);
};

/**
 * Clear device token from localStorage
 */
export const clearDeviceToken = () => {
  localStorage.removeItem(DEVICE_TOKEN_KEY);
};

/**
 * Save notification to localStorage
 */
const saveNotificationToStorage = (notification) => {
  try {
    const STORAGE_KEY = 'firebase_notifications';
    const stored = localStorage.getItem(STORAGE_KEY);
    const notifications = stored ? JSON.parse(stored) : [];
    
    // Add new notification with unique ID
    const newNotification = {
      id: `fcm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: notification.title,
      message: notification.body,
      type: notification.data?.type || 'system',
      isRead: false,
      createdAt: notification.timestamp.toISOString(),
      data: notification.data
    };
    
    // Add to beginning of array (newest first)
    notifications.unshift(newNotification);
    
    // Keep only last 100 notifications
    const trimmed = notifications.slice(0, 100);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    console.log('💾 Notification saved to localStorage:', newNotification);
    
    return newNotification;
  } catch (error) {
    console.error('❌ Error saving notification to localStorage:', error);
    return null;
  }
};

/**
 * Setup foreground message listener
 * @param {Function} onNotification - Callback when notification received
 */
export const setupNotificationListener = (onNotification) => {
  return onMessageListener((payload) => {
    console.log('📬 New notification:', payload);
    
    // Extract notification data
    const notification = {
      title: payload.notification?.title || 'New Notification',
      body: payload.notification?.body || '',
      data: payload.data || {},
      timestamp: new Date()
    };

    // Save to localStorage
    const savedNotification = saveNotificationToStorage(notification);

    // Call callback
    if (onNotification && typeof onNotification === 'function') {
      onNotification(notification);
    }

    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/logo.png',
        badge: '/badge.png',
        tag: notification.data.type || 'default',
        requireInteraction: false,
        vibrate: [200, 100, 200]
      });
    }
    
    // Dispatch custom event for real-time UI updates
    if (savedNotification) {
      window.dispatchEvent(new CustomEvent('firebase-notification-received', { 
        detail: savedNotification 
      }));
    }
  });
};

/**
 * Check if notifications are supported
 */
export const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

/**
 * Check if permission is granted
 */
export const isPermissionGranted = () => {
  return Notification.permission === 'granted';
};

/**
 * Optional: Save token to backend database
 * Uncomment and implement if you want to save tokens on server
 */
// const saveTokenToBackend = async (token) => {
//   try {
//     await fetch('/api/users/device-token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ deviceToken: token })
//     });
//     console.log('✅ Token saved to backend');
//   } catch (error) {
//     console.error('❌ Error saving token to backend:', error);
//   }
// };

export default {
  initializeNotifications,
  getDeviceToken,
  clearDeviceToken,
  setupNotificationListener,
  isNotificationSupported,
  isPermissionGranted
};
