import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  const menuItems = [
    {
      label: 'My Profile',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      action: () => {
        console.log('Navigate to profile');
        setIsOpen(false);
      }
    },
    {
      label: 'Settings',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      action: () => {
        console.log('Navigate to settings');
        setIsOpen(false);
      }
    },
    {
      label: 'Change Password',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      action: () => {
        console.log('Navigate to change password');
        setIsOpen(false);
      }
    },
    {
      label: 'Help & Support',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: () => {
        console.log('Navigate to help');
        setIsOpen(false);
      }
    }
  ];

  const getInitials = (username) => {
    if (!username) return 'U';
    return username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Doctor':
        return 'bg-blue-500';
      case 'Nurse':
        return 'bg-green-500';
      case 'Admin':
        return 'bg-gray-500';
      case 'Lab':
        return 'bg-red-500';
      case 'Patient':
        return 'bg-indigo-500';
      case 'Pharmacist':
        return 'bg-purple-500';
      case 'Receptionist':
        return 'bg-teal-500';
      case 'Billing':
        return 'bg-yellow-500';
      case 'IT':
        return 'bg-orange-500';
      case 'Accountant':
        return 'bg-pink-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="User menu"
      >
        <div className="text-right hidden sm:block">
          <div className="text-white font-semibold text-sm">
            {user?.username || 'User'}
          </div>
          <div className="text-white/80 text-xs">
            {user?.role || 'Unknown'}
          </div>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getRoleColor(user?.role)}`}>
          {getInitials(user?.username)}
        </div>
        <svg 
          className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 glass-card p-2 z-50 animate-slide-in-from-right">
          {/* User Info Header */}
          <div className="p-3 border-b border-gray-200/50 dark:border-gray-700/50 mb-2">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getRoleColor(user?.role)}`}>
                {getInitials(user?.username)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {user?.username || 'User'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.role || 'Unknown Role'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {user?.email || 'No email provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 text-left group"
              >
                <div className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 my-2"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-all duration-200 text-left group"
          >
            <div className="text-danger-500 group-hover:text-danger-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="text-sm font-medium text-danger-600 group-hover:text-danger-700 dark:text-danger-400 dark:group-hover:text-danger-300">
              Sign Out
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;