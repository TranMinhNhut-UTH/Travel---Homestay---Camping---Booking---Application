import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar,
  InputBase,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Chip,
  Popper,
  Fade,
  ClickAwayListener,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  ShoppingCart as OrdersIcon,
  LocalShipping as DeliveriesIcon,
  Payment as PaymentsIcon,
  Settings as SystemIcon,
  Campaign as PromotionsIcon,
  Done as MarkAsReadIcon,
  Clear as ClearIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material'

import notificationService from '../../services/notificationService'

const Topbar = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState([])
  const [notificationStats, setNotificationStats] = useState({ total: 0, unread: 0 })
  const [anchorEl, setAnchorEl] = useState(null)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load notifications on mount
  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const [notificationsResponse, statsResponse] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getNotificationStats()
      ])

      setNotifications(notificationsResponse.data.slice(0, 5)) // Show only first 5
      setNotificationStats(statsResponse.data)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null)
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId)
      loadNotifications() // Reload to update counts
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      loadNotifications()
      handleNotificationClose()
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId)
      loadNotifications()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'orders':
        return <OrdersIcon />
      case 'deliveries':
        return <DeliveriesIcon />
      case 'payments':
        return <PaymentsIcon />
      case 'system':
        return <SystemIcon />
      case 'promotions':
        return <PromotionsIcon />
      default:
        return <NotificationsIcon />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'orders':
        return '#1976d2'
      case 'deliveries':
        return '#388e3c'
      case 'payments':
        return '#f57c00'
      case 'system':
        return '#d32f2f'
      case 'promotions':
        return '#7b1fa2'
      default:
        return '#757575'
    }
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Left Section - Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: 400 }}>
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              borderRadius: 3,
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.08)',
              '&:hover': {
                background: 'rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.12)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <IconButton type="submit" sx={{ p: '10px', color: '#666' }}>
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: '0.95rem' }}
              placeholder="Tìm kiếm xe, khách hàng, đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Paper>
        </Box>

        {/* Right Section - Notifications & User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notification Bell */}
          <IconButton
            onClick={handleNotificationClick}
            sx={{
              position: 'relative',
              '&:hover': {
                background: 'rgba(25, 118, 210, 0.08)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Badge
              badgeContent={notificationStats.unread}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  background: 'linear-gradient(45deg, #f44336, #e53935)',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)'
                }
              }}
            >
              <NotificationsIcon sx={{ color: '#666', fontSize: 28 }} />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <IconButton
            onClick={handleUserMenuClick}
            sx={{
              ml: 1,
              '&:hover': {
                background: 'rgba(25, 118, 210, 0.08)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)'
              }}
            >
              <PersonIcon />
            </Avatar>
          </IconButton>
        </Box>

        {/* Notification Dropdown */}
        <Popper
          open={Boolean(notificationAnchorEl)}
          anchorEl={notificationAnchorEl}
          role={undefined}
          placement="bottom-end"
          transition
          disablePortal
          sx={{ zIndex: 1300 }}
        >
          {({ TransitionProps, placement }) => (
            <ClickAwayListener onClickAway={handleNotificationClose}>
              <Fade
                {...TransitionProps}
                timeout={350}
                style={{
                  transformOrigin: placement === 'bottom-end' ? 'right top' : 'right bottom',
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    mt: 1.5,
                    width: 380,
                    maxHeight: 500,
                    overflow: 'auto',
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                  }}
                >
                  {/* Header */}
                  <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Thông báo
                      </Typography>
                      <Chip
                        label={`${notificationStats.unread} chưa đọc`}
                        size="small"
                        color="error"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    {notificationStats.unread > 0 && (
                      <Button
                        size="small"
                        startIcon={<MarkAsReadIcon />}
                        onClick={handleMarkAllAsRead}
                        sx={{
                          mt: 1,
                          textTransform: 'none',
                          fontSize: '0.85rem',
                          color: '#1976d2',
                          '&:hover': { background: 'rgba(25, 118, 210, 0.08)' }
                        }}
                      >
                        Đánh dấu tất cả đã đọc
                      </Button>
                    )}
                  </Box>

                  {/* Notifications List */}
                  <List sx={{ py: 0 }}>
                    {notifications.length === 0 ? (
                      <Box sx={{ p: 4, textAlign: 'center' }}>
                        <NotificationsIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                        <Typography color="text.secondary">
                          Không có thông báo nào
                        </Typography>
                      </Box>
                    ) : (
                      notifications.map((notification, index) => (
                        <ListItem
                          key={notification.id}
                          sx={{
                            borderBottom: index < notifications.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                            '&:hover': { background: 'rgba(0,0,0,0.04)' },
                            position: 'relative'
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 50 }}>
                            <Avatar
                              sx={{
                                bgcolor: getNotificationColor(notification.type),
                                width: 40,
                                height: 40
                              }}
                            >
                              {getNotificationIcon(notification.type)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {notification.title}
                                </Typography>
                                {!notification.isRead && (
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      bgcolor: '#1976d2',
                                      flexShrink: 0
                                    }}
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {notification.message}
                              </Typography>
                            }
                          />
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleMarkAsRead(notification.id)}
                              sx={{ p: 0.5 }}
                            >
                              <MarkAsReadIcon sx={{ fontSize: 16, color: '#666' }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteNotification(notification.id)}
                              sx={{ p: 0.5 }}
                            >
                              <ClearIcon sx={{ fontSize: 16, color: '#666' }} />
                            </IconButton>
                          </Box>
                        </ListItem>
                      ))
                    )}
                  </List>

                  {/* Footer */}
                  <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    <Button
                      fullWidth
                      onClick={() => {
                        navigate('/notifications')
                        handleNotificationClose()
                      }}
                      endIcon={<NavigateNextIcon />}
                      sx={{
                        textTransform: 'none',
                        color: '#1976d2',
                        '&:hover': { background: 'rgba(25, 118, 210, 0.08)' }
                      }}
                    >
                      Xem tất cả thông báo
                    </Button>
                  </Box>
                </Paper>
              </Fade>
            </ClickAwayListener>
          )}
        </Popper>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleUserMenuClose}
          PaperProps={{
            elevation: 8,
            sx: {
              borderRadius: 3,
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              minWidth: 200,
              mt: 1
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Nguyễn Văn A
            </Typography>
            <Typography variant="body2" color="text.secondary">
              admin@evdealer.com
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              navigate('/settings')
              handleUserMenuClose()
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Cài đặt" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/notifications/preferences')
              handleUserMenuClose()
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              <NotificationsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Tùy chọn thông báo" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5, color: '#d32f2f' }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: '#d32f2f' }} />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar

