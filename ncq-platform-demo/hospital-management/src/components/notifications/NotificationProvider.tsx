import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Snackbar,
  Alert,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
} from '@mui/material';
import {
  Notifications,
  Event,
  LocalHospital,
  Assignment,
  Medication,
  Close,
  MarkEmailRead,
  DeleteOutline,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { clearNotification } from '../../store/slices/notificationSlice';
import { api } from '../../services/api';

interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'test_result' | 'prescription' | 'general';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
  data?: any;
}

interface NotificationContextType {
  notifications: InAppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<InAppNotification, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const globalNotification = useSelector((state: RootState) => state.notifications.current);
  
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // Load initial notifications
    loadNotifications();
    
    // Set up WebSocket or polling for real-time notifications
    const interval = setInterval(loadNotifications, 60000); // Poll every minute
    
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      // In a real implementation, this would fetch from the backend
      // For now, we'll use mock data
      const mockNotifications: InAppNotification[] = [
        {
          id: '1',
          title: 'Appointment Reminder',
          message: 'You have an appointment with Dr. Smith tomorrow at 10:00 AM',
          type: 'appointment',
          priority: 'high',
          read: false,
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          actionUrl: '/appointments'
        },
        {
          id: '2',
          title: 'Test Results Available',
          message: 'Lab results for John Doe are now available',
          type: 'test_result',
          priority: 'medium',
          read: false,
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          actionUrl: '/lab-tests'
        },
        {
          id: '3',
          title: 'Prescription Ready',
          message: 'Prescription #RX-001 is ready for pickup',
          type: 'prescription',
          priority: 'medium',
          read: true,
          timestamp: new Date(Date.now() - 10800000), // 3 hours ago
          actionUrl: '/prescriptions'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    
    // In a real implementation, this would update the backend
    // api.patch(`/notifications/${id}/read`);
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    // In a real implementation, this would update the backend
    // api.patch('/notifications/mark-all-read');
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    // In a real implementation, this would update the backend
    // api.delete(`/notifications/${id}`);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    
    // In a real implementation, this would update the backend
    // api.delete('/notifications');
  };

  const addNotification = (notification: Omit<InAppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: InAppNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: InAppNotification['type']) => {
    switch (type) {
      case 'appointment':
        return <Event />;
      case 'test_result':
        return <Assignment />;
      case 'prescription':
        return <Medication />;
      default:
        return <LocalHospital />;
    }
  };

  const getPriorityColor = (priority: InAppNotification['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: InAppNotification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    handleClose();
  };

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    addNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Notification Bell Icon (to be placed in header) */}
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
          display: { xs: 'none', md: 'inline-flex' }
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      {/* Notifications Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={markAllAsRead}>
                <MarkEmailRead sx={{ mr: 0.5, fontSize: 16 }} />
                Mark All Read
              </Button>
            )}
          </Box>
        </Box>
        
        <Divider />
        
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: notification.read ? 'inherit' : 'action.hover',
                  '&:hover': {
                    backgroundColor: 'action.selected',
                  },
                }}
                onClick={() => handleNotificationClick(notification)}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${getPriorityColor(notification.priority)}.main`,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {React.cloneElement(getNotificationIcon(notification.type), { fontSize: 'small' })}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      fontWeight={notification.read ? 'normal' : 'bold'}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {notification.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Box>
                  }
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
        
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1 }}>
              <Button
                fullWidth
                size="small"
                startIcon={<DeleteOutline />}
                onClick={clearAllNotifications}
              >
                Clear All
              </Button>
            </Box>
          </>
        )}
      </Menu>
      
      {/* Global Snackbar Notifications */}
      {globalNotification && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => dispatch(clearNotification())}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => dispatch(clearNotification())}
            severity={globalNotification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {globalNotification.message}
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;