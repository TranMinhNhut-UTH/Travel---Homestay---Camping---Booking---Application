import React, { useState, useEffect, useMemo } from 'react';
import { Badge, Dropdown, List, Spin, ConfigProvider } from 'antd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';

const StyledBell = styled(motion.div)`
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const NotificationItem = styled(motion.div)`
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const NotificationBell = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      handleNewNotification(newNotification);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Failed to connect to notifications service');
    };

    return () => {
      ws.close();
    };
  }, []);

  // Fetch initial notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
      updateUnreadCount(data);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize filtered notifications
  const recentNotifications = useMemo(() => {
    return notifications
      .slice(0, 5)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notifications]);

  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Notification sound
    new Audio('/notification-sound.mp3').play().catch(e => console.log('Audio play failed:', e));
    
    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/notification-icon.png'
      });
    }
  };

  const updateUnreadCount = (notifs) => {
    setUnreadCount(notifs.filter(n => !n.read).length);
  };

  const handleNotificationClick = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      updateUnreadCount(notifications);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const notificationsList = (
    <List
      className="notification-dropdown"
      dataSource={recentNotifications}
      loading={isLoading}
      locale={{ emptyText: 'No notifications' }}
      renderItem={(item) => (
        <NotificationItem
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={() => handleNotificationClick(item.id)}
          role="button"
          tabIndex={0}
          aria-label={`Notification: ${item.title}`}
        >
          <List.Item.Meta
            title={item.title}
            description={item.message}
            className={!item.read ? 'unread' : ''}
          />
          <small>{new Date(item.createdAt).toLocaleDateString()}</small>
        </NotificationItem>
      )}
      footer={
        <div style={{ textAlign: 'center' }}>
          <a
            href="/Notifications"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              setDropdownVisible(false);
              // Navigate to the capitalized route per user's preference
              navigate('/Notifications');
            }}
          >
            View All Notifications
          </a>
        </div>
      }
    />
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Badge: {
            dotSize: 8,
            color: '#f5222d',
          },
        },
      }}
    >
      <Dropdown
        overlay={notificationsList}
        trigger={['hover']}
        placement="bottomRight"
        arrow
        open={dropdownVisible}
        onOpenChange={setDropdownVisible}
      >
        <StyledBell
          className="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit MuiIconButton-sizeMedium css-h7cjts-MuiButtonBase-root-MuiIconButton-root"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          role="button"
          aria-label={`Notifications - ${unreadCount} unread`}
          onClick={(e) => {
            e.stopPropagation();
            setDropdownVisible(false);
            // Navigate to the capitalized route per user's preference
            navigate('/Notifications');
          }}
        >
          <Badge count={unreadCount} overflowCount={99}>
            <NotificationsIcon 
              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              data-testid="NotificationsIcon"
            />
          </Badge>
        </StyledBell>
      </Dropdown>
    </ConfigProvider>
  );
};

export default NotificationBell;