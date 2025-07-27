import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../slices/themeSlice';

const DarkModeToggle = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.theme);

  // Apply dark mode to document with React 18 best practices
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative inline-flex items-center justify-center w-14 h-7 rounded-full 
        transition-all duration-500 ease-in-out transform hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-primary-500/50
        ${isDarkMode 
          ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/25' 
          : 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 hover:from-gray-400 hover:via-gray-500 hover:to-gray-600 shadow-lg shadow-gray-500/25'
        }
      `}
      aria-label="Toggle Dark Mode"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span
        className={`
          absolute w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-500 ease-in-out
          flex items-center justify-center
          ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}
          ${isDarkMode ? 'rotate-12' : 'rotate-0'}
        `}
      >
        <span className="flex items-center justify-center w-full h-full">
          {isDarkMode ? (
            <svg 
              className="w-4 h-4 text-indigo-600 transition-all duration-300 ease-in-out transform rotate-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg 
              className="w-4 h-4 text-yellow-500 transition-all duration-300 ease-in-out transform rotate-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </span>
      
      {/* Background stars for dark mode */}
      {isDarkMode && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-3 right-3 w-0.5 h-0.5 bg-white rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-2 left-4 w-0.5 h-0.5 bg-white rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      )}
    </button>
  );
};

export default DarkModeToggle;