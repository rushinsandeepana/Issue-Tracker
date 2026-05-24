import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { fetchUnreadCount } from '../../store/slices/notificationSlice';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle';
import { 
  FiLogOut, 
  FiBell, 
  FiLayout, 
  FiList,
  FiUser,
  FiMenu,
  FiX
} from 'react-icons/fi';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchUnreadCount()).catch((error) => {
        console.log('Notification fetch failed but continuing:', error);
      });
      
      const interval = setInterval(() => {
        if (isAuthenticated && user?.id) {
          dispatch(fetchUnreadCount()).catch(() => {});
        }
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [dispatch, isAuthenticated, user?.id]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNotificationClick = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiLayout className="w-4 h-4" /> },
    { path: '/issues', label: 'View Issues', icon: <FiList className="w-4 h-4" /> },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isNotificationsPage = location.pathname === '/notifications';

  return (
    <>
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="h-10 w-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">IT</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-500">
                  Issue Tracker
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Track and manage issues efficiently</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                      ${location.pathname === item.path 
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
                
                <div className="relative">
                  <button
                    onClick={handleNotificationClick}
                    className={`notification-button flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 relative
                      ${notificationDropdownOpen || isNotificationsPage
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <FiBell className="w-4 h-4" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  <NotificationDropdown 
                    isOpen={notificationDropdownOpen}
                    onClose={() => setNotificationDropdownOpen(false)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                <ThemeToggle />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <FiUser className="w-3 h-3" />
                    {user?.name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden xl:block">{user?.email || ''}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 relative"
            >
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed top-[73px] left-0 right-0 bg-white dark:bg-gray-900 shadow-xl rounded-b-2xl z-50 animate-slide-down" onClick={e => e.stopPropagation()}>
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                    ${location.pathname === item.path 
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/notifications');
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                  ${isNotificationsPage 
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <FiBell className="w-4 h-4" />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                <div className="px-4 py-2">
                  <ThemeToggle />
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || ''}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default TopBar;