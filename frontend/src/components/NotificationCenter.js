import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useSelector((state) => state.auth);

  // Mock notifications - in real app these would come from WebSocket/API
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'emergency',
        title: 'Emergency Alert',
        message: 'Code Blue - Room 301',
        time: '2 min ago',
        isRead: false,
        icon: 'emergency',
        priority: 'high'
      },
      {
        id: 2,
        type: 'lab',
        title: 'Lab Results Ready',
        message: 'Blood work for Patient #12345 is ready',
        time: '15 min ago',
        isRead: false,
        icon: 'lab',
        priority: 'medium'
      },
      {
        id: 3,
        type: 'inventory',
        title: 'Low Stock Alert',
        message: 'Surgical masks running low (5 units left)',
        time: '1 hour ago',
        isRead: true,
        icon: 'warning',
        priority: 'medium'
      },
      {
        id: 4,
        type: 'appointment',
        title: 'Appointment Reminder',
        message: 'Patient consultation in 30 minutes',
        time: '25 min ago',
        isRead: false,
        icon: 'calendar',
        priority: 'low'
      },
      {
        id: 5,
        type: 'system',
        title: 'System Update',
        message: 'HMIS will undergo maintenance at 2 AM',
        time: '3 hours ago',
        isRead: true,
        icon: 'info',
        priority: 'low'
      }
    ];

    // Filter notifications based on user role
    const roleBasedNotifications = mockNotifications.filter(notification => {
      if (user?.role === 'Doctor') {
        return ['emergency', 'lab', 'appointment'].includes(notification.type);
      } else if (user?.role === 'Nurse') {
        return ['emergency', 'lab', 'inventory'].includes(notification.type);
      } else if (user?.role === 'Admin') {
        return true; // Admin sees all notifications
      } else if (user?.role === 'Lab') {
        return ['lab', 'system'].includes(notification.type);
      }
      return ['appointment', 'system'].includes(notification.type);
    });

    setNotifications(roleBasedNotifications);
    setUnreadCount(roleBasedNotifications.filter(n => !n.isRead).length);
  }, [user?.role]);

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (iconType) => {
    switch (iconType) {
      case 'emergency':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'lab':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getPriorityColor = (priority, type) => {
    if (priority === 'high' || type === 'emergency') {
      return 'bg-danger-100 text-danger-800 border-danger-200 dark:bg-danger-900/30 dark:text-danger-200 dark:border-danger-700';
    } else if (priority === 'medium') {
      return 'bg-warning-100 text-warning-800 border-warning-200 dark:bg-warning-900/30 dark:text-warning-200 dark:border-warning-700';
    }
    return 'bg-primary-100 text-primary-800 border-primary-200 dark:bg-primary-900/30 dark:text-primary-200 dark:border-primary-700';
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 glass-card p-4 max-h-96 overflow-y-auto z-50 animate-slide-in-from-right">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    notification.isRead
                      ? 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50'
                      : getPriorityColor(notification.priority, notification.type)
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      notification.type === 'emergency' ? 'bg-danger-500 text-white' :
                      notification.type === 'lab' ? 'bg-secondary-500 text-white' :
                      notification.type === 'inventory' ? 'bg-warning-500 text-white' :
                      notification.type === 'appointment' ? 'bg-primary-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {getNotificationIcon(notification.icon)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-danger-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.time}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          notification.priority === 'high' ? 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-200' :
                          notification.priority === 'medium' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
                        }`}>
                          {notification.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;