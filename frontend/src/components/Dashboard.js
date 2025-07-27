import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PatientTimeline from './PatientTimeline';
import DataVisualization from './DataVisualization';
import { fetchPatients } from '../slices/patientSlice';
import { fetchAppointments } from '../slices/appointmentSlice';
import { fetchRecords } from '../slices/recordSlice';
import { fetchBills } from '../slices/billingSlice';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, status: authStatus } = useSelector((state) => state.auth);
  const { patients, status: patientStatus, error: patientError, pages: patientPages } = useSelector((state) => state.patients);
  const { appointments, status: apptStatus, error: appointmentError, pages: appointmentPages } = useSelector((state) => state.appointments);
  const { records, status: recordStatus, error: recordError, pages: recordPages } = useSelector((state) => state.records);
  const { bills, status: billStatus, error: billError, pages: billPages } = useSelector((state) => state.bills);

  const [currentPatientPage, setCurrentPatientPage] = useState(1);
  const [currentAppointmentPage, setCurrentAppointmentPage] = useState(1);
  const [currentRecordPage, setCurrentRecordPage] = useState(1);
  const [currentBillPage, setCurrentBillPage] = useState(1);

  const metrics = {
    appointmentsToday: appointments.length,
    newPatients: patients.filter((p) => new Date(p.dob).getFullYear() === new Date().getFullYear()).length,
    labResultsPending: records.filter((r) => !r.results).length,
    revenue: `KES ${bills.reduce((sum, b) => sum + (b.payment_status === 'Paid' ? parseFloat(b.amount) : 0), 0).toLocaleString()}`,
    availableBeds: 50 - (patients.length % 50), // Mock
    equipmentInUse: Math.floor(Math.random() * 10), // Mock
    lowStockItems: Math.floor(Math.random() * 5), // Mock
  };

  useEffect(() => {
    if (authStatus === 'succeeded' && user) {
      if (['Admin'].includes(user.role)) {
        dispatch(fetchPatients(currentPatientPage));
      }
      if (['Admin', 'Doctor'].includes(user.role)) {
        dispatch(fetchAppointments(currentAppointmentPage));
        dispatch(fetchRecords(currentRecordPage));
      }
      if (['Admin'].includes(user.role)) {
        dispatch(fetchBills(currentBillPage));
      }
    }
  }, [authStatus, user, currentPatientPage, currentAppointmentPage, currentRecordPage, currentBillPage, dispatch]);

  useEffect(() => {
    if (patientError) toast.error(`Failed to load patients: ${patientError}`);
    if (appointmentError) toast.error(`Failed to load appointments: ${appointmentError}`);
    if (recordError) toast.error(`Failed to load records: ${recordError}`);
    if (billError) toast.error(`Failed to load bills: ${billError}`);
  }, [patientError, appointmentError, recordError, billError]);



  // Helper function to format vital signs
  const formatVitalSigns = (vitalSigns) => {
    if (!vitalSigns) return 'N/A';
    if (typeof vitalSigns === 'string') return vitalSigns;
    if (typeof vitalSigns === 'object') {
      const { bp, heart_rate } = vitalSigns;
      return `BP: ${bp || 'N/A'}, HR: ${heart_rate || 'N/A'}`;
    }
    return 'N/A';
  };

  const renderPagination = (currentPage, totalPages, setPage) => {
    return (
      <div className="flex items-center justify-between mt-6 px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing page {currentPage} of {totalPages || 1}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages || 1))}
            disabled={currentPage === (totalPages || 1)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Welcome back, {user?.username || 'User'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {user?.role} Dashboard • {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-success-600 dark:text-success-400">
            <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse-slow"></div>
            <span className="text-sm font-medium">System Online</span>
          </div>
        </div>
      </div>

      {user && (
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Appointments Today */}
            <div className="metric-card group cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300">Appointments</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.appointmentsToday}</p>
                </div>
                <div className="text-primary-500 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* New Patients */}
            <div className="metric-card group cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300">Patients</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.newPatients}</p>
                </div>
                <div className="text-success-500 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="metric-card group cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300">Revenue</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Collected</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.revenue}</p>
                </div>
                <div className="text-warning-500 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bed Occupancy */}
            <div className="metric-card group cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300">Bed Occupancy</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Current</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">85%</p>
                </div>
                <div className="text-secondary-500 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Data Visualization Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DataVisualization 
              type="appointments" 
              title="Appointments Trend" 
              subtitle="Last 30 days"
              trend="up"
            />
            <DataVisualization 
              type="revenue" 
              title="Revenue Growth" 
              subtitle="Monthly progress"
              trend="up"
            />
            <DataVisualization 
              type="beds" 
              title="Bed Occupancy" 
              subtitle="Utilization rate"
              trend="stable"
            />
            <DataVisualization 
              type="patients" 
              title="Patient Volume" 
              subtitle="Daily admissions"
              trend="up"
            />
          </div>

          {/* Additional Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="metric-card">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-danger-500 to-danger-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Lab Results</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.labResultsPending}</p>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Equipment</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">In Use</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.equipmentInUse}</p>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Low Stock</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Items</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.lowStockItems}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h3>
              <div className="w-8 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {user.role === 'Admin' && (
                <>
                  <NavLink to="/patients/new" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 hover:shadow-lg transition-all duration-200 group">
                    <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">Add Patient</span>
                  </NavLink>
                  
                  <NavLink to="/appointments/new" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 hover:shadow-lg transition-all duration-200 group">
                    <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">Book Appointment</span>
                  </NavLink>
                  
                  <NavLink to="/employees" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 hover:shadow-lg transition-all duration-200 group">
                    <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v2h5m-2-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">Manage Staff</span>
                  </NavLink>
                </>
              )}
              
              {(user.role === 'Admin' || user.role === 'Doctor' || user.role === 'Lab Tech') && (
                <>
                  <NavLink to="/lab-orders" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20 hover:shadow-lg transition-all duration-200 group">
                    <div className="w-12 h-12 bg-warning-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">Lab Orders</span>
                  </NavLink>
                  <NavLink to="/lab-samples" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 hover:shadow-lg transition-all duration-200 group">
                    <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h0a4 4 0 014 4v2" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">Record Sample</span>
                  </NavLink>
                </>
              )}
              
              <NavLink to="/radiology" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-danger-50 to-danger-100 dark:from-danger-900/20 dark:to-danger-800/20 hover:shadow-lg transition-all duration-200 group">
                <div className="w-12 h-12 bg-danger-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">Radiology</span>
              </NavLink>
              
              <NavLink to="/reports" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 hover:shadow-lg transition-all duration-200 group">
                <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">Reports</span>
              </NavLink>
              
              <NavLink to="/communications" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 hover:shadow-lg transition-all duration-200 group">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">Messages</span>
              </NavLink>
            </div>
          </div>

          {user.role === 'Admin' && (
            <div className="table-container">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Recent Patients</h4>
                <NavLink to="/patients/new" className="btn-primary text-sm">
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Patient
                </NavLink>
              </div>
              {patientStatus === 'loading' ? (
                <div className="flex items-center justify-center p-12">
                  <div className="loading-spinner h-8 w-8"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Loading patients...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="table-header">
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">DOB</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {patients.slice(0, 5).map((patient) => (
                        <tr key={patient.id} className="table-row">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">#{patient.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-semibold">{patient.name?.charAt(0) || 'P'}</span>
                              </div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{patient.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{patient.dob}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{patient.contact}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="status-online">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {renderPagination(currentPatientPage, patientPages, setCurrentPatientPage)}
            </div>
          )}

          {(user.role === 'Admin' || user.role === 'Doctor') && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-2">Appointments</h4>
              {apptStatus === 'loading' ? (
                <div>Loading appointments...</div>
              ) : (
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">ID</th>
                      <th className="border p-2">Patient ID</th>
                      <th className="border p-2">Time</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="border p-2">{appointment.id}</td>
                        <td className="border p-2">{appointment.patient_id}</td>
                        <td className="border p-2">{appointment.appointment_time}</td>
                        <td className="border p-2">{appointment.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {renderPagination(currentAppointmentPage, appointmentPages, setCurrentAppointmentPage)}
            </div>
          )}

          {(user.role === 'Admin' || user.role === 'Doctor' || user.role === 'Nurse') && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-2">Records</h4>
              {recordStatus === 'loading' ? (
                <div>Loading records...</div>
              ) : (
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">ID</th>
                      <th className="border p-2">Patient ID</th>
                      <th className="border p-2">Diagnosis</th>
                      <th className="border p-2">Vital Signs</th>
                      <th className="border p-2">Prescription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id}>
                        <td className="border p-2">{record.id}</td>
                        <td className="border p-2">{record.patient_id}</td>
                        <td className="border p-2">{record.diagnosis}</td>
                        <td className="border p-2">{formatVitalSigns(record.vital_signs)}</td>
                        <td className="border p-2">{record.prescription}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {renderPagination(currentRecordPage, recordPages, setCurrentRecordPage)}
            </div>
          )}

          {user.role === 'Admin' && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-2">Bills</h4>
              {billStatus === 'loading' ? (
                <div>Loading bills...</div>
              ) : (
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">ID</th>
                      <th className="border p-2">Patient ID</th>
                      <th className="border p-2">Amount</th>
                      <th className="border p-2">Description</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((bill) => (
                      <tr key={bill.id}>
                        <td className="border p-2">{bill.id}</td>
                        <td className="border p-2">{bill.patient_id}</td>
                        <td className="border p-2">{bill.amount}</td>
                        <td className="border p-2">{bill.description}</td>
                        <td className="border p-2">{bill.payment_status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {renderPagination(currentBillPage, billPages, setCurrentBillPage)}
            </div>
          )}

          {/* Patient Timeline Demo Section */}
          {(user.role === 'Admin' || user.role === 'Doctor' || user.role === 'Nurse') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PatientTimeline patientId="demo" />
              
              {/* Recent Activity Summary */}
              <div className="glass-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                  <div className="w-8 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { action: 'New patient registered', time: '5 minutes ago', type: 'patient' },
                    { action: 'Lab results completed', time: '12 minutes ago', type: 'lab' },
                    { action: 'Appointment scheduled', time: '1 hour ago', type: 'appointment' },
                    { action: 'Medication administered', time: '2 hours ago', type: 'medication' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activity.type === 'patient' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' :
                        activity.type === 'lab' ? 'bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400' :
                        activity.type === 'appointment' ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400' :
                        'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;