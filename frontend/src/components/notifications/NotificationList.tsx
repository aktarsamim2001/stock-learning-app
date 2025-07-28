import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Check } from 'lucide-react';
import { format } from 'date-fns';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  fetchUnreadCount
} from '../../store/slices/notificationSlice';
import type { AppDispatch, RootState } from '../../store/store';

interface NotificationListProps {
  compact?: boolean;
  onNotificationClick?: () => void;
}

const NotificationList = ({ compact = false, onNotificationClick }: NotificationListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount, loading } = useSelector(
    (state: RootState) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
    // Poll for new notifications every minute
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return compact ? 'bg-gray-800/30' : 'bg-gray-800/50';
    switch (type) {
      case 'enrollment':
        return compact ? 'bg-green-900/30' : 'bg-green-900/50';
      case 'payment':
        return compact ? 'bg-blue-900/30' : 'bg-blue-900/50';
      case 'webinar':
        return compact ? 'bg-purple-900/30' : 'bg-purple-900/50';
      case 'course':
        return compact ? 'bg-indigo-900/30' : 'bg-indigo-900/50';
      default:
        return compact ? 'bg-gray-900/30' : 'bg-gray-900/50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className={compact ? 'p-2' : 'bg-gray-900/50 rounded-lg p-4'}>
      {!compact && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-purple-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h2>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center"
            >
              <Check className="h-4 w-4 mr-1" />
              Mark all as read
            </button>
          )}
        </div>
      )}

      <div className={`space-y-2 ${compact ? 'max-h-96' : 'max-h-[600px]'} overflow-y-auto`}>
        {notifications.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No notifications to display
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`${getNotificationBgColor(
                notification.type,
                notification.isRead
              )} rounded-lg ${compact ? 'p-3' : 'p-4'} transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
              onClick={() => {
                if (!notification.isRead) handleMarkAsRead(notification._id);
                if (onNotificationClick) onNotificationClick();
                window.location.href = '/admin/dashboard?section=notifications';
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm">
                    {notification.title}
                  </h3>
                  <p className={`text-gray-300 ${compact ? 'text-xs' : 'text-sm'} mt-1`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <span>
                      {format(
                        new Date(notification.createdAt),
                        compact ? 'MMM d, HH:mm' : 'MMM d, yyyy h:mm a'
                      )}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{notification.type}</span>
                  </div>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={e => { e.stopPropagation(); handleMarkAsRead(notification._id); }}
                    className="ml-4 text-purple-400 hover:text-purple-300"
                  >
                    <Check className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;
