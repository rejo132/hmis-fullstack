import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TriageAssessment = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    blood_pressure: '',
    temperature: '',
    pulse: '',
    respiration: '',
    priority: 'Normal',
    history: '',
    allergies: '',
    referral: '',
    testPreparation: '',
  });
  const [patientVisits, setPatientVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);

  useEffect(() => {
    fetchPatientVisits();
  }, []);

  const fetchPatientVisits = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      console.log('Nurse fetching PatientVisits...');
      const res = await axios.get(`${API_BASE}/api/patient-visits`, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Nurse PatientVisits response:', res.data);
      setPatientVisits(res.data.visits || []);
    } catch (err) {
      console.error('Nurse error fetching PatientVisits:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        toast.error(`Failed to fetch patient visits: ${err.response.data.message || err.message}`);
      } else {
        toast.error(`Failed to fetch patient visits: ${err.message}`);
      }
    }
  };

  const handleVisitSelect = (visit) => {
    setSelectedVisit(visit);
    setFormData(prev => ({ ...prev, patientId: visit.patient_id }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVisit) return;
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      console.log('Nurse submitting triage assessment for visit:', selectedVisit.id);
      
      const triageData = {
        triage_notes: `BP: ${formData.blood_pressure}, Temp: ${formData.temperature}, Pulse: ${formData.pulse}, Resp: ${formData.respiration}, Priority: ${formData.priority}, History: ${formData.history}, Allergies: ${formData.allergies}, Referral: ${formData.referral}, Prep: ${formData.testPreparation}`
      };
      console.log('Triage data being sent:', triageData);
      
      // Update PatientVisit with triage notes and move to doctor stage
      const response = await axios.put(`${API_BASE}/api/patient-visits/${selectedVisit.id}`, triageData, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Triage update response:', response.data);
      
      toast.success('Triage assessment recorded and sent to doctor');
      setFormData({
        patientId: '', blood_pressure: '', temperature: '', pulse: '', respiration: '', 
        priority: 'Normal', history: '', allergies: '', referral: '', testPreparation: '',
      });
      setSelectedVisit(null);
      fetchPatientVisits();
    } catch (err) {
      console.error('Nurse error submitting triage:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        toast.error(`Failed to record triage assessment: ${err.response.data.message || err.message}`);
      } else {
        toast.error(`Failed to record triage assessment: ${err.message}`);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-lg font-bold text-blue-700 mr-4">Role: Nurse</span>
        <span className="text-gray-700">Select patient from workflow queue, record vitals, assign priority, and refer to doctor.</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PatientVisit Queue */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Patient Workflow Queue (Triage)</h3>
          <div className="bg-white border rounded-lg p-4">
            {patientVisits.length === 0 ? (
              <p className="text-gray-500">No patients in triage queue.</p>
            ) : (
              <ul className="space-y-2">
                {patientVisits.map((visit) => (
                  <li 
                    key={visit.id} 
                    className={`p-3 border rounded cursor-pointer transition-colors ${selectedVisit?.id === visit.id ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'}`}
                    onClick={() => handleVisitSelect(visit)}
                  >
                    <div className="font-medium">Visit ID: {visit.id} | Patient ID: {visit.patient_id}</div>
                    <div className="text-sm text-gray-600">Stage: {visit.current_stage}</div>
                    {visit.triage_notes && <div className="text-xs text-gray-600">Triage: {visit.triage_notes}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Triage Assessment Form */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Triage Assessment</h3>
          {selectedVisit && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <strong>Selected Visit:</strong> {selectedVisit.id} (Patient ID: {selectedVisit.patient_id})<br/>
              {selectedVisit.triage_notes && <span className="text-xs text-gray-600">Previous Triage: {selectedVisit.triage_notes}</span>}
              {selectedVisit.lab_results && <span className="text-xs text-gray-600">Lab: {selectedVisit.lab_results}</span>}
              {selectedVisit.diagnosis && <span className="text-xs text-gray-600">Diagnosis: {selectedVisit.diagnosis}</span>}
              {selectedVisit.prescription && <span className="text-xs text-gray-600">Prescription: {selectedVisit.prescription}</span>}
              {selectedVisit.billing_status && <span className="text-xs text-gray-600">Billing: {selectedVisit.billing_status}</span>}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-lg p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient ID</label>
              <input 
                type="text" 
                name="patientId" 
                value={formData.patientId} 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
                required 
                readOnly={!!selectedVisit}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
                <input 
                  type="text" 
                  name="blood_pressure" 
                  value={formData.blood_pressure} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded" 
                  placeholder="e.g., 120/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
                <input 
                  type="text" 
                  name="temperature" 
                  value={formData.temperature} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded" 
                  placeholder="e.g., 37.0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Pulse (bpm)</label>
                <input 
                  type="text" 
                  name="pulse" 
                  value={formData.pulse} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded" 
                  placeholder="e.g., 72"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Respiration (rpm)</label>
                <input 
                  type="text" 
                  name="respiration" 
                  value={formData.respiration} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded" 
                  placeholder="e.g., 16"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority Level</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange} 
                className="w-full border p-2 rounded"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Medical History</label>
              <textarea 
                name="history" 
                value={formData.history} 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
                rows="3"
                placeholder="Brief medical history..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Allergies</label>
              <input 
                type="text" 
                name="allergies" 
                value={formData.allergies} 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
                placeholder="e.g., Penicillin, Latex"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Preparation</label>
              <input 
                type="text" 
                name="testPreparation" 
                value={formData.testPreparation} 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
                placeholder="e.g., Fasting required"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Referral to Doctor/Department</label>
              <input 
                type="text" 
                name="referral" 
                value={formData.referral} 
                onChange={handleChange} 
                className="w-full border p-2 rounded" 
                placeholder="e.g., Dr. Smith, Cardiology"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full btn-primary"
              disabled={!selectedVisit}
            >
              Submit Assessment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TriageAssessment; 