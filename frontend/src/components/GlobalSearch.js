import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom'; // For future use

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  // const navigate = useNavigate(); // For future use when routes are implemented

  const { patients } = useSelector((state) => state.patients);
  const { appointments } = useSelector((state) => state.appointments);
  const { records } = useSelector((state) => state.records);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = useCallback((searchQuery) => {
    const searchTerm = searchQuery.toLowerCase();
    let allResults = [];

    // Search patients
    const patientResults = patients
      .filter(patient => 
        patient.name?.toLowerCase().includes(searchTerm) ||
        patient.contact?.includes(searchTerm) ||
        patient.id?.toString().includes(searchTerm)
      )
      .map(patient => ({
        id: patient.id,
        type: 'patient',
        title: patient.name,
        subtitle: `Patient ID: ${patient.id} • ${patient.contact}`,
        icon: 'user',
        path: `/patients/${patient.id}`
      }));

    // Search appointments
    const appointmentResults = appointments
      .filter(appointment => 
        appointment.patient_id?.toString().includes(searchTerm) ||
        appointment.status?.toLowerCase().includes(searchTerm) ||
        appointment.id?.toString().includes(searchTerm)
      )
      .map(appointment => ({
        id: appointment.id,
        type: 'appointment',
        title: `Appointment #${appointment.id}`,
        subtitle: `Patient ID: ${appointment.patient_id} • ${appointment.status}`,
        icon: 'calendar',
        path: `/appointments/${appointment.id}`
      }));

    // Search records
    const recordResults = records
      .filter(record => 
        record.diagnosis?.toLowerCase().includes(searchTerm) ||
        record.patient_id?.toString().includes(searchTerm) ||
        record.id?.toString().includes(searchTerm)
      )
      .map(record => ({
        id: record.id,
        type: 'record',
        title: record.diagnosis || 'Medical Record',
        subtitle: `Patient ID: ${record.patient_id} • Record #${record.id}`,
        icon: 'document',
        path: `/records/${record.id}`
      }));

    allResults = [...patientResults, ...appointmentResults, ...recordResults];
    return allResults.slice(0, 10); // Limit to 10 results
  }, [patients, appointments, records]);

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      const searchResults = performSearch(query);
      setResults(searchResults);
      setLoading(false);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, patients, appointments, records, performSearch]);

  const handleResultClick = (result) => {
    setQuery('');
    setIsOpen(false);
    // For now, we'll just log the navigation since the routes might not exist
    console.log('Navigate to:', result.path);
    // navigate(result.path); // Uncomment when routes are implemented
  };

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'user':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'patient':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200';
      case 'appointment':
        return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-200';
      case 'record':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search patients, appointments, records..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300/50 dark:border-gray-600/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-gray-900 dark:text-gray-100"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="loading-spinner h-4 w-4"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card p-2 max-h-96 overflow-y-auto z-50">
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white flex-shrink-0">
                      {getIcon(result.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {result.title}
                        </h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(result.type)}`}>
                          {result.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {result.subtitle}
                      </p>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try searching for patient names, IDs, or appointment details</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;