import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
let messaging = null;

try {
  // Check if browser supports service workers and notifications
  if ('serviceWorker' in navigator && 'Notification' in window) {
    messaging = getMessaging(app);
    console.log('✅ Firebase Messaging initialized successfully');
  } else {
    console.warn('⚠️ Browser does not support notifications or service workers');
  }
} catch (error) {
  console.error('❌ Error initializing Firebase Messaging:', error);
}

/**
 * Request notification permission and get device token
 * @returns {Promise<string|null>} Device token or null if failed
 */
export const requestNotificationPermission = async () => {
  try {
    if (!messaging) {
      throw new Error('Firebase Messaging not initialized');
    }

    // Check current permission
    const currentPermission = Notification.permission;
    console.log('📋 Current notification permission:', currentPermission);

    if (currentPermission === 'denied') {
      console.error('❌ Notification permission denied by user');
      return null;
    }

    // Request permission if not granted
    if (currentPermission !== 'granted') {
      const permission = await Notification.requestPermission();
      console.log('🔔 Permission result:', permission);
      
      if (permission !== 'granted') {
        console.warn('⚠️ User did not grant notification permission');
        return null;
      }
    }

    // Get FCM token
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      throw new Error('VAPID key not configured in environment variables');
    }

    const token = await getToken(messaging, { vapidKey });
    
    if (token) {
      console.log('✅ FCM Device Token obtained:', token.substring(0, 20) + '...');
      return token;
    } else {
      console.warn('⚠️ No registration token available');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting notification permission/token:', error);
    return null;
  }
};

/**
 * Listen for foreground messages (when app is open)
 * @param {Function} callback - Callback function to handle message
 */
export const onMessageListener = (callback) => {
  if (!messaging) {
    console.warn('⚠️ Cannot listen for messages: Firebase Messaging not initialized');
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log('📨 Foreground message received:', payload);
    callback(payload);
  });
};

/**
 * Get current FCM token (without requesting permission)
 * @returns {Promise<string|null>}
 */
export const getCurrentToken = async () => {
  try {
    if (!messaging) return null;
    
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) return null;

    const token = await getToken(messaging, { vapidKey });
    return token || null;
  } catch (error) {
    console.error('Error getting current token:', error);
    return null;
  }
};

export { messaging };
