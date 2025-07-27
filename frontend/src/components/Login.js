// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../slices/authSlice';
import toast from 'react-hot-toast';
import Register from './Register';

// Typewriter Effect Component
const Typewriter = ({ text, speed = 100, className = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  // Reset typewriter when text changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <h1 className={`${className} typewriter-text`}>
      {displayText}
      <span className="animate-blink">|</span>
    </h1>
  );
};

// Live Clock component
const LiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const pad = (n) => n.toString().padStart(2, '0');
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const date = now.toLocaleDateString();
  return (
    <div className="text-right text-xs text-white/80 dark:text-gray-300/80 font-mono mb-2 select-none">
      <span>{date} </span>
      <span className="animate-blink">{hours}:{minutes}</span>
      <span>:{seconds}</span>
    </div>
  );
};

// Role selector pills/icons
const ROLES = [
  { label: 'Admin', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 .896 2 2zm0 0c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 .896 2 2zm0 0c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 .896 2 2z"/></svg> },
  { label: 'Nurse', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7"/></svg> },
  { label: 'Lab Tech', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"/></svg> },
  { label: 'Doctor', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7"/></svg> },
  { label: 'Patient', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0113 0"/></svg> },
  { label: 'Receptionist', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17v-1a4 4 0 014-4h0a4 4 0 014 4v1"/></svg> },
  { label: 'Billing', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg> },
  { label: 'IT', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg> },
  { label: 'Accountant', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg> },
  { label: 'Pharmacist', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg> },
];

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await dispatch(login(formData)).unwrap();
      toast.success('Login successful');
      
      // Role-based redirect
      const role = result.user.role;
      if (role === 'Admin') {
        navigate('/dashboard');
      } else if (role === 'Patient') {
        navigate('/patient-portal');
      } else if (role === 'Doctor') {
        navigate('/doctor-portal');
      } else if (role === 'Nurse') {
        navigate('/vitals');
      } else if (role === 'Lab Tech') {
        navigate('/lab-orders');
      } else if (role === 'Receptionist') {
        navigate('/reception');
      } else if (role === 'Billing') {
        navigate('/billing');
      } else if (role === 'IT') {
        navigate('/users/roles');
      } else if (role === 'Accountant') {
        navigate('/finance');
      } else if (role === 'Pharmacist') {
        navigate('/inventory');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const role = user.role;
      if (role === 'Admin') {
        navigate('/dashboard');
      } else if (role === 'Patient') {
        navigate('/patient-portal');
      } else if (role === 'Doctor') {
        navigate('/doctor-portal');
      } else if (role === 'Nurse') {
        navigate('/vitals');
      } else if (role === 'Lab Tech') {
        navigate('/lab-orders');
      } else if (role === 'Receptionist') {
        navigate('/reception');
      } else if (role === 'Billing') {
        navigate('/billing');
      } else if (role === 'IT') {
        navigate('/users/roles');
      } else if (role === 'Accountant') {
        navigate('/finance');
      } else if (role === 'Pharmacist') {
        navigate('/inventory');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen animated-gradient-bg flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-warning-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      <style>{`
        .animated-gradient-bg {
          background: linear-gradient(270deg, #1e3a8a, #2563eb, #9333ea, #f59e42, #1e3a8a);
          background-size: 1200% 1200%;
          animation: gradientMove 16s ease infinite;
        }
        
        .dark .animated-gradient-bg {
          background: linear-gradient(270deg, #0f172a, #1e293b, #334155, #475569, #0f172a);
          background-size: 1200% 1200%;
          animation: gradientMove 16s ease infinite;
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-blink { 
          animation: blink 1s steps(2, start) infinite; 
        }
        
        @keyframes blink { 
          to { visibility: hidden; } 
        }
        
        .typewriter-text {
          overflow: hidden;
          border-right: 2px solid transparent;
          white-space: nowrap;
          margin: 0 auto;
        }
        
        .dark .typewriter-text {
          border-right-color: rgba(255, 255, 255, 0.75);
        }
        
        .glass-card {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        
        .dark .glass-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .dark .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
      {/* Main Content: Responsive Two-Column Layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left Side - Branding, Welcome, Hero Animation */}
        <div className="flex-1 text-center lg:text-left space-y-8 mb-10 lg:mb-0 flex flex-col items-center lg:items-start">
          <div className="flex flex-col items-center lg:items-start space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
                {/* Padlock icon for security */}
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17a2 2 0 002-2v-2a2 2 0 00-4 0v2a2 2 0 002 2zm6-6V9a6 6 0 10-12 0v2a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2z" />
                  </svg>
                {/* MediCure logo/name */}
              </div>
              <span className="text-3xl font-bold text-white tracking-wide">MediCure</span>
            </div>
            <span className="text-green-200 text-xs flex items-center space-x-1 mt-1">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17a2 2 0 002-2v-2a2 2 0 00-4 0v2a2 2 0 002 2zm6-6V9a6 6 0 10-12 0v2a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2z" /></svg>
              <span>Your data is secure</span>
                </span>
          </div>
          {/* Typing effect for welcome message */}
          <Typewriter text="Welcome to MediCure" speed={50} className="text-4xl lg:text-5xl font-bold text-white leading-tight mt-4" />
          {/* Hero Animation (SVG or Lottie) */}
          <div className="w-48 h-48 mx-auto lg:mx-0">
            {/* Example: animated heartbeat SVG */}
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <polyline points="0,60 40,60 50,20 70,80 90,40 110,80 130,20 150,60 200,60" fill="none" stroke="#fff" strokeWidth="4" strokeDasharray="8" >
                <animate attributeName="stroke-dashoffset" values="16;0;16" dur="2s" repeatCount="indefinite" />
              </polyline>
            </svg>
          </div>
          <p className="text-lg text-white/80 max-w-lg mx-auto lg:mx-0">
                Advanced healthcare management platform designed to streamline hospital operations and enhance patient care.
              </p>
            </div>
        {/* Right Side - Card with Live Clock, Role Selector, Login/Register Tabs */}
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto">
          <LiveClock />
          <div className="glass-card p-8 space-y-6 shadow-2xl rounded-2xl border border-white/20 backdrop-blur-lg bg-white/20 dark:bg-gray-900/30 w-full">
            {/* Role Selector */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {ROLES.map(role => (
                <button
                  key={role.label}
                  type="button"
                  className={`flex items-center px-3 py-1 rounded-full border transition-all text-xs font-semibold ${
                    selectedRole === role.label 
                      ? 'bg-primary-600 text-white shadow-lg dark:bg-primary-500 dark:shadow-primary-500/25' 
                      : 'bg-white/30 dark:bg-gray-800/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/50'
                  }`}
                  onClick={() => setSelectedRole(role.label)}
                >
                  {role.icon}
                  <span className="ml-1">{role.label}</span>
                </button>
              ))}
            </div>
            {/* Tabs for Login/Register */}
            <div className="flex justify-center mb-6">
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold focus:outline-none transition-all ${
                  !showRegister 
                    ? 'bg-primary-600 text-white shadow-lg dark:bg-primary-500 dark:shadow-primary-500/25' 
                    : 'bg-white/30 dark:bg-gray-800/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50'
                }`}
                onClick={() => setShowRegister(false)}
              >
                Login
              </button>
              <button
                className={`px-6 py-2 rounded-t-lg font-semibold focus:outline-none transition-all ${
                  showRegister 
                    ? 'bg-primary-600 text-white shadow-lg dark:bg-primary-500 dark:shadow-primary-500/25' 
                    : 'bg-white/30 dark:bg-gray-800/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50'
                }`}
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </div>
            {/* Login Form */}
            {!showRegister && (
              <>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</h2>
                  <p className="text-gray-600 dark:text-gray-400">Sign in to continue to your dashboard</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {selectedRole && <input type="hidden" name="role" value={selectedRole} />}
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Username</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter your username"
                        required
                        aria-label="Username"
                      />
                    </div>
                  </div>
                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter your password"
                        required
                        aria-label="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                      Forgot password?
                    </button>
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 dark:from-primary-500 dark:to-secondary-500 dark:hover:from-primary-600 dark:hover:to-secondary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 shadow-lg dark:shadow-primary-500/25"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>
                {/* Demo Credentials - visually distinct */}
                <details className="mt-6 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-inner backdrop-blur-sm" open>
                  <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Demo Credentials</summary>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <div className="space-y-1">
                      <p className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        <span className="font-medium">Admin:</span> admin/admin123
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        <span className="font-medium">Doctor:</span> doctor/doctor123
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        <span className="font-medium">Nurse:</span> nurse/nurse123
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        <span className="font-medium">Patient:</span> patient/patient123
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        <span className="font-medium">Lab:</span> lab/lab123
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        <span className="font-medium">Billing:</span> billing/billing123
                      </p>
                    </div>
                  </div>
                </details>
              </>
            )}
            {/* Register Form - styled to match login card */}
            {showRegister && <div className="w-full"><Register /></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
