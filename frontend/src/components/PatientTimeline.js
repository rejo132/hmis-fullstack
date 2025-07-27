import React from 'react';

const PatientTimeline = ({ patientId, events = [] }) => {
  // Mock data for demonstration - in real app this would come from props or API
  const mockEvents = [
    {
      id: 1,
      type: 'admission',
      title: 'Hospital Admission',
      description: 'Patient admitted for chest pain evaluation',
      date: '2024-01-15',
      time: '09:30',
      status: 'completed',
      doctor: 'Dr. Smith'
    },
    {
      id: 2,
      type: 'test',
      title: 'Blood Test',
      description: 'Complete blood count and metabolic panel',
      date: '2024-01-15',
      time: '11:00',
      status: 'completed',
      results: 'Normal'
    },
    {
      id: 3,
      type: 'medication',
      title: 'Medication Administered',
      description: 'Aspirin 325mg, Metoprolol 50mg',
      date: '2024-01-15',
      time: '14:00',
      status: 'completed',
      nurse: 'Nurse Johnson'
    },
    {
      id: 4,
      type: 'procedure',
      title: 'ECG',
      description: 'Electrocardiogram performed',
      date: '2024-01-16',
      time: '08:00',
      status: 'completed',
      results: 'Normal sinus rhythm'
    },
    {
      id: 5,
      type: 'appointment',
      title: 'Follow-up Appointment',
      description: 'Cardiology consultation scheduled',
      date: '2024-01-20',
      time: '10:00',
      status: 'scheduled',
      doctor: 'Dr. Wilson'
    }
  ];

  const timelineEvents = events.length > 0 ? events : mockEvents;

  const getEventIcon = (type) => {
    switch (type) {
      case 'admission':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'test':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'medication':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'procedure':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
      case 'appointment':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getEventColor = (type, status) => {
    if (status === 'scheduled') {
      return 'bg-warning-100 text-warning-800 border-warning-200 dark:bg-warning-900/30 dark:text-warning-200 dark:border-warning-700';
    }
    
    switch (type) {
      case 'admission':
        return 'bg-primary-100 text-primary-800 border-primary-200 dark:bg-primary-900/30 dark:text-primary-200 dark:border-primary-700';
      case 'test':
        return 'bg-secondary-100 text-secondary-800 border-secondary-200 dark:bg-secondary-900/30 dark:text-secondary-200 dark:border-secondary-700';
      case 'medication':
        return 'bg-success-100 text-success-800 border-success-200 dark:bg-success-900/30 dark:text-success-200 dark:border-success-700';
      case 'procedure':
        return 'bg-warning-100 text-warning-800 border-warning-200 dark:bg-warning-900/30 dark:text-warning-200 dark:border-warning-700';
      case 'appointment':
        return 'bg-danger-100 text-danger-800 border-danger-200 dark:bg-danger-900/30 dark:text-danger-200 dark:border-danger-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-200 dark:border-gray-700';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Patient Timeline</h3>
        <div className="w-8 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-500 opacity-30"></div>

        {/* Timeline Events */}
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative flex items-start space-x-4">
              {/* Timeline Dot */}
              <div className={`relative z-10 w-16 h-16 rounded-xl border-2 flex items-center justify-center ${getEventColor(event.type, event.status)}`}>
                {getEventIcon(event.type)}
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                <div className="glass-card-hover p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {event.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          event.status === 'completed' ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-200' :
                          event.status === 'scheduled' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(event.date)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{event.time}</span>
                        </div>

                        {event.doctor && (
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{event.doctor}</span>
                          </div>
                        )}

                        {event.nurse && (
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{event.nurse}</span>
                          </div>
                        )}

                        {event.results && (
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium text-success-600 dark:text-success-400">{event.results}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {timelineEvents.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Timeline Events</h3>
          <p className="text-gray-500 dark:text-gray-400">Patient timeline will appear here as events are recorded.</p>
        </div>
      )}
    </div>
  );
};

export default PatientTimeline;