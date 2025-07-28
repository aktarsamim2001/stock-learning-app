import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell } from 'lucide-react';
import { fetchUnreadCount } from '../../store/slices/notificationSlice';
import NotificationList from './NotificationList';
import type { AppDispatch, RootState } from '../../store/store';

const NotificationBadge = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { unreadCount } = useSelector((state: RootState) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchUnreadCount());
    // Poll for new notifications every minute
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 60000);

    // Add click outside listener to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="relative p-1.5 rounded-full hover:bg-white/10 transition-colors"
      >
        <Bell className="h-6 w-6 text-gray-300 hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-lg py-1 ring-1 ring-white/20 focus:outline-none z-50">
          <div className="divide-y divide-gray-700">
            <NotificationList compact={true} onNotificationClick={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBadge;
