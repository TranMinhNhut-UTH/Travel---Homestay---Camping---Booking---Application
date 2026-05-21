import { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Snackbar, Alert } from '@mui/material';
import AppRoutes from './routes';
import theme from './theme';
import { initializeNotifications, setupNotificationListener, isNotificationSupported } from './firebase/notificationService';

function App() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Initialize Firebase notifications
    const initNotifications = async () => {
      // Check if notifications are supported
      if (!isNotificationSupported()) {
        console.warn('⚠️ Notifications not supported in this browser');
        return;
      }

      // Request permission and get token
      const token = await initializeNotifications();
      
      if (token) {
        console.log('✅ Notifications initialized successfully');
      } else {
        console.log('ℹ️ User did not grant notification permission or error occurred');
      }

      // Setup listener for foreground messages
      const unsubscribe = setupNotificationListener((payload) => {
        console.log('📨 Received notification in foreground:', payload);
        
        // Show in-app notification
        setNotification({
          title: payload.title,
          body: payload.body,
          severity: 'info'
        });
      });

      // Cleanup listener on unmount
      return () => {
        if (unsubscribe) unsubscribe();
      };
    };

    initNotifications();
  }, []);

  // Close notification
  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <AppRoutes />
      
      {/* In-app notification display */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification?.severity || 'info'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          <strong>{notification?.title}</strong>
          <br />
          {notification?.body}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
