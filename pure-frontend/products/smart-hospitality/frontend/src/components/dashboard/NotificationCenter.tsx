'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, useDateFormat } from '@/hooks/useLanguage';
import { useNotifications } from '@/hooks/useSocket';
import { apiClient } from '@/lib/api';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck,
  Info,
  AlertCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotificationCenter() {
  const { t } = useLanguage();
  const { formatDateTime } = useDateFormat();
  const [isOpen, setIsOpen] = useState(false);
  
  // Use socket notifications hook for real-time updates
  const { notifications: socketNotifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Fetch initial notifications
  const { data: apiNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiClient.getNotifications(),
  });

  // Combine socket and API notifications (socket takes priority for real-time)
  const allNotifications = socketNotifications.length > 0 
    ? socketNotifications 
    : apiNotifications?.data || [];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    markAsRead(notificationId);
    try {
      await apiClient.markNotificationRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    markAllAsRead();
    try {
      await apiClient.markAllNotificationsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <>
      {/* Notification Bell - Fixed Position */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 lg:hidden p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center text-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {t('nav.notifications')}
                    </h2>
                    {unreadCount > 0 && (
                      <p className="text-sm text-gray-500">
                        {unreadCount} unread
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Actions */}
                {allNotifications.length > 0 && (
                  <div className="mt-3 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      leftIcon={<CheckCheck className="h-4 w-4" />}
                    >
                      {t('notifications.mark_all_read')}
                    </Button>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {allNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <Bell className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t('notifications.no_notifications')}
                    </h3>
                    <p className="text-gray-500 text-center px-4">
                      We'll notify you when there's something new to see.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {allNotifications.map((notification, index) => {
                      const Icon = getNotificationIcon(notification.type);
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                              <Icon className="h-4 w-4" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className={`text-sm font-medium ${
                                    !notification.read ? 'text-gray-900' : 'text-gray-700'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  <p className={`text-sm mt-1 ${
                                    !notification.read ? 'text-gray-700' : 'text-gray-500'
                                  }`}>
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-2">
                                    {formatDateTime(notification.createdAt)}
                                  </p>
                                </div>

                                {/* Mark as read button */}
                                {!notification.read && (
                                  <button
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    title={t('notifications.mark_read')}
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                )}
                              </div>

                              {/* Action button if available */}
                              {notification.actionUrl && (
                                <div className="mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      // Handle action navigation
                                      window.location.href = notification.actionUrl!;
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              )}

                              {/* New indicator */}
                              {!notification.read && (
                                <div className="absolute right-2 top-4">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications for new real-time notifications */}
      <AnimatePresence>
        {socketNotifications.slice(0, 3).map((notification) => (
          !notification.read && (
            <motion.div
              key={`toast-${notification.id}`}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed top-20 right-4 z-40 max-w-sm w-full"
            >
              <div className={`p-4 rounded-lg shadow-lg border ${getNotificationColor(notification.type)} backdrop-blur-sm`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {(() => {
                      const Icon = getNotificationIcon(notification.type);
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm mt-1">{notification.message}</p>
                  </div>
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </>
  );
}