import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../store/slices/notificationSlice';
import { FiBell, FiCheckCircle, FiAlertCircle, FiInfo, FiTrash2, FiInbox, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { notifications, loading, unreadCount } = useAppSelector((state) => state.notifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications({ page: 1, filter }));
    }
  }, [dispatch, isOpen, filter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.notification-dropdown') && !target.closest('.notification-button')) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />;
      case 'warning':
        return <FiAlertCircle className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />;
      default:
        return <FiInfo className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
    }
  };

  const handleMarkAsRead = async (id: number) => {
    await dispatch(markAsRead(id));
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllAsRead());
    toast.success('All notifications marked as read');
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteNotification(id));
    toast.success('Notification deleted');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="notification-dropdown absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-slide-down overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-white dark:from-gray-800 dark:to-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs px-2 py-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded transition-all duration-200"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'unread'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 bg-white dark:bg-gray-800'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 bg-white dark:bg-gray-800'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                <FiInbox className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
                    !notification.read ? 'bg-primary-50/20 dark:bg-primary-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs px-2 py-0.5 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded transition-all duration-200"
                            >
                              Read
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={() => {
              onClose();
              window.location.href = '/notifications';
            }}
            className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;