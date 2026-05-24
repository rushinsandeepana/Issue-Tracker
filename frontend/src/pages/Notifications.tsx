import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../store/slices/notificationSlice';
import TopBar from '../components/common/TopBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiBell, FiCheckCircle, FiAlertCircle, FiInfo, FiTrash2, FiInbox } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Notifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications, loading, pagination, unreadCount } = useAppSelector((state) => state.notifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchNotifications({ page: currentPage, filter }));
  }, [dispatch, currentPage, filter]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />;
      case 'warning':
        return <FiAlertCircle className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />;
      default:
        return <FiInfo className="w-6 h-6 text-blue-500 dark:text-blue-400" />;
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await dispatch(markAsRead(id)).unwrap();
      toast.success('Marked as read');
      // No need to refresh - Redux will update the state
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead()).unwrap();
      toast.success('All notifications marked as read');
      dispatch(fetchNotifications({ page: currentPage, filter }));
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteNotification(id)).unwrap();
      toast.success('Notification deleted');
      dispatch(fetchNotifications({ page: currentPage, filter }));
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TopBar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFilter('all');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setFilter('unread');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filter === 'unread'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => {
                  setFilter('read');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filter === 'read'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                Read
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <FiInbox className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No notifications</h3>
            <p className="text-gray-500 dark:text-gray-400">You're all caught up!</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={`${notification.id}-${notification.read}`} // Add read status to key to force re-render
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
                    notification.read 
                      ? 'border-gray-200 dark:border-gray-700' 
                      : 'border-primary-200 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-900/20'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div className="flex-1">
                            <h3 className={`font-semibold ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                              {formatDate(notification.created_at)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs px-3 py-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded transition-all duration-200"
                              >
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300"
                >
                  Previous
                </button>
                <span className="text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;