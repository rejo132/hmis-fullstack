import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchPatients } from '../slices/patientSlice';
import { fetchAppointments } from '../slices/appointmentSlice';
import { fetchRecords } from '../slices/recordSlice';
import axios from 'axios';

const DoctorPortal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { error: patientError } = useSelector((state) => state.patients);
  const { appointments, error: appointmentError } = useSelector((state) => state.appointments);
  const { error: recordError } = useSelector((state) => state.records);
  
  const [patientVisits, setPatientVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [consultationForm, setConsultationForm] = useState({
    diagnosis: '',
    prescription: '',
    labTests: '',
    notes: '',
    followUp: '',
  });
  const [showConsultationForm, setShowConsultationForm] = useState(false);

  useEffect(() => {
    if (user && (user.role === 'Admin' || user.role === 'Doctor')) {
      dispatch(fetchPatients(1));
      dispatch(fetchAppointments(1));
      dispatch(fetchRecords(1));
      fetchPatientVisits();
    } else {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (patientError) toast.error(`Failed to load patients: ${patientError}`);
    if (appointmentError) toast.error(`Failed to load appointments: ${appointmentError}`);
    if (recordError) toast.error(`Failed to load records: ${recordError}`);
  }, [patientError, appointmentError, recordError]);

  const fetchPatientVisits = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      const res = await axios.get(`${API_BASE}/api/patient-visits`, { headers: { Authorization: `Bearer ${token}` } });
      setPatientVisits(res.data.visits || []);
    } catch (err) {
      // handle error
    }
  };

  const handleVisitSelect = (visit) => {
    setSelectedVisit(visit);
    setShowConsultationForm(true);
    setConsultationForm({
      diagnosis: visit.diagnosis || '',
      prescription: visit.prescription || '',
      labTests: '',
      notes: '',
      followUp: '',
    });
  };

  const handleConsultationChange = (e) => {
    setConsultationForm({ ...consultationForm, [e.target.name]: e.target.value });
  };

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVisit) return;
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      // Update PatientVisit with diagnosis/prescription and move to next stage
      await axios.put(`${API_BASE}/api/patient-visits/${selectedVisit.id}`, {
        diagnosis: consultationForm.diagnosis,
        prescription: consultationForm.prescription,
        request_lab: !!consultationForm.labTests,
        lab_results: consultationForm.labTests ? '' : undefined // If lab requested, clear lab_results
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Consultation completed and sent to next stage');
      setConsultationForm({
        diagnosis: '', prescription: '', labTests: '', notes: '', followUp: '',
      });
      setSelectedVisit(null);
      setShowConsultationForm(false);
      fetchPatientVisits();
    } catch (err) {
      toast.error('Failed to record consultation');
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-lg font-bold text-blue-700 mr-4">Role: Doctor</span>
        <span className="text-gray-700">Review triage notes, order lab tests, prescribe medication, update diagnosis and treatment plans.</span>
      </div>
      
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Doctor Portal</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PatientVisit Queue */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Patient Workflow Queue (Doctor)</h3>
          <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
            {patientVisits.length === 0 ? (
              <p className="text-gray-500">No patients in doctor queue.</p>
            ) : (
              <div className="space-y-3">
                {patientVisits.map((visit) => (
                  <div 
                    key={visit.id}
                    className={`p-3 border rounded cursor-pointer transition-colors ${selectedVisit?.id === visit.id ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'}`}
                    onClick={() => handleVisitSelect(visit)}
                  >
                    <div className="font-medium">Visit ID: {visit.id} | Patient ID: {visit.patient_id}</div>
                    <div className="text-sm text-gray-600">Stage: {visit.current_stage}</div>
                    {visit.triage_notes && <div className="text-xs text-gray-600">Triage: {visit.triage_notes}</div>}
                    {visit.lab_results && <div className="text-xs text-gray-600">Lab: {visit.lab_results}</div>}
                    {visit.diagnosis && <div className="text-xs text-gray-600">Diagnosis: {visit.diagnosis}</div>}
                    {visit.prescription && <div className="text-xs text-gray-600">Prescription: {visit.prescription}</div>}
                    {visit.billing_status && <div className="text-xs text-gray-600">Billing: {visit.billing_status}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Consultation Form */}
        {showConsultationForm && selectedVisit && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Consultation</h3>
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <strong>Selected Visit:</strong> {selectedVisit.id} (Patient ID: {selectedVisit.patient_id})<br/>
              {selectedVisit.triage_notes && <span className="text-xs text-gray-600">Triage: {selectedVisit.triage_notes}</span>}<br/>
              {selectedVisit.lab_results && <span className="text-xs text-gray-600">Lab: {selectedVisit.lab_results}</span>}<br/>
              {selectedVisit.diagnosis && <span className="text-xs text-gray-600">Diagnosis: {selectedVisit.diagnosis}</span>}<br/>
              {selectedVisit.prescription && <span className="text-xs text-gray-600">Prescription: {selectedVisit.prescription}</span>}<br/>
              {selectedVisit.billing_status && <span className="text-xs text-gray-600">Billing: {selectedVisit.billing_status}</span>}
            </div>
            <form onSubmit={handleConsultationSubmit} className="space-y-4 bg-white border rounded-lg p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                <textarea 
                  name="diagnosis" 
                  value={consultationForm.diagnosis} 
                  onChange={handleConsultationChange} 
                  className="w-full border p-2 rounded" 
                  rows="3"
                  placeholder="Enter diagnosis..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Prescription</label>
                <textarea 
                  name="prescription" 
                  value={consultationForm.prescription} 
                  onChange={handleConsultationChange} 
                  className="w-full border p-2 rounded" 
                  rows="3"
                  placeholder="Enter prescription details..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Lab Tests (Optional)</label>
                <select 
                  name="labTests" 
                  value={consultationForm.labTests} 
                  onChange={handleConsultationChange} 
                  className="w-full border p-2 rounded"
                >
                  <option value="">No lab tests</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="Urine Test">Urine Test</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="MRI">MRI</option>
                  <option value="CT Scan">CT Scan</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea 
                  name="notes" 
                  value={consultationForm.notes} 
                  onChange={handleConsultationChange} 
                  className="w-full border p-2 rounded" 
                  rows="3"
                  placeholder="Additional notes..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Follow-up</label>
                <input 
                  type="text" 
                  name="followUp" 
                  value={consultationForm.followUp} 
                  onChange={handleConsultationChange} 
                  className="w-full border p-2 rounded" 
                  placeholder="e.g., Follow up in 1 week"
                />
              </div>
              
              <div className="flex space-x-2">
                <button 
                  type="submit" 
                  className="flex-1 btn-primary"
                >
                  Complete Consultation
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedVisit(null);
                    setShowConsultationForm(false);
                    setConsultationForm({
                      diagnosis: '', prescription: '', labTests: '', notes: '', followUp: '',
                    });
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Appointments */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Today's Appointments</h3>
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Patient ID</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, index) => (
                  <tr key={appt.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-3">{appt.id}</td>
                    <td className="p-3">{appt.patient_id}</td>
                    <td className="p-3">{appt.appointment_time}</td>
                    <td className="p-3">{appt.status}</td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          const visit = patientVisits.find(v => v.patient_id === appt.patient_id);
                          if (visit) handleVisitSelect(visit);
                        }}
                        className="btn-primary text-sm"
                      >
                        Start Consultation
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPortal;