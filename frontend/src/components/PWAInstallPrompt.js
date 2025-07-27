import React from 'react';
import { usePWA } from '../hooks/usePWA';

const PWAInstallPrompt = () => {
  const { showInstallPrompt, installApp, dismissInstallPrompt, isOnline } = usePWA();

  if (!showInstallPrompt) return null;

  return (
    <>
      {/* Install Prompt */}
      <div className="fixed top-4 right-4 z-50 animate-slide-in-from-right">
        <div className="glass-card p-4 max-w-sm">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M6 6h12l-3 12H9L6 6z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Install HMIS App
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Install our app for faster access and offline capabilities
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={installApp}
                  className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                >
                  Install
                </button>
                <button
                  onClick={dismissInstallPrompt}
                  className="px-3 py-1.5 text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  Later
                </button>
              </div>
            </div>
            <button
              onClick={dismissInstallPrompt}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 animate-slide-in-from-left">
          <div className="flex items-center space-x-2 px-4 py-2 bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-200 rounded-xl border border-warning-200 dark:border-warning-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">You're offline</span>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;