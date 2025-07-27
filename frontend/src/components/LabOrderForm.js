import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addLabOrder } from '../slices/labSlice';
import axios from 'axios';

const LabOrderForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [labOrders, setLabOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [patientVisits, setPatientVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    test_type: '',
    status: 'Ordered',
    sample_collected: false,
    results: '',
  });

  useEffect(() => {
    fetchLabOrders();
    fetchPatientVisits();
  }, []);

  const fetchLabOrders = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      const res = await axios.get(`${API_BASE}/api/lab-orders`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setLabOrders(res.data.lab_orders || []);
    } catch (err) {
      toast.error('Failed to fetch lab orders');
    }
  };

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

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setFormData({
      patient_id: order.patient_id,
      test_type: order.test_type,
      status: order.status,
      sample_collected: order.sample_collected || false,
      results: order.results || '',
    });
  };

  const handleVisitSelect = (visit) => {
    setSelectedVisit(visit);
    setFormData({ results: visit.lab_results || '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUploadResults = async (e) => {
    e.preventDefault();
    if (!selectedVisit) return;
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      // Update PatientVisit with lab results and move to doctor stage
      await axios.put(`${API_BASE}/api/patient-visits/${selectedVisit.id}`, {
        lab_results: formData.results
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Lab results uploaded and sent to doctor');
      setSelectedVisit(null);
      fetchPatientVisits();
    } catch (err) {
      toast.error('Failed to upload results');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addLabOrder(formData)).unwrap();
      toast.success('Lab Order Created');
      navigate('/dashboard');
    } catch (err) {
      toast.error(`Failed to create lab order: ${err}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ordered': return 'bg-yellow-100 text-yellow-800';
      case 'Sample Collected': return 'bg-blue-100 text-blue-800';
      case 'Results Ready': return 'bg-green-100 text-green-800';
      case 'Verified': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-lg font-bold text-blue-700 mr-4">Role: Lab Technician</span>
        <span className="text-gray-700">Receive lab requests, upload results, and share with doctor.</span>
      </div>
      <h2 className="text-2xl font-bold mb-4">Laboratory Workflow</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lab Orders List */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Lab Orders</h3>
          <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
            {labOrders.length === 0 ? (
              <p className="text-gray-500">No lab orders available.</p>
            ) : (
              <div className="space-y-3">
                {labOrders.map((order) => (
                  <div 
                    key={order.id}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedOrder?.id === order.id 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOrderSelect(order)}
                  >
                    <div className="font-medium">Patient ID: {order.patient_id}</div>
                    <div className="text-sm text-gray-600">Test: {order.test_type}</div>
                    <div className="text-sm text-gray-500">Ordered: {order.created_at}</div>
                    <span className={`inline-block text-xs px-2 py-1 rounded mt-1 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* PatientVisit Queue */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Patient Workflow Queue (Lab)</h3>
          <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
            {patientVisits.length === 0 ? (
              <p className="text-gray-500">No patients in lab queue.</p>
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
        {/* Lab Results Upload Form */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Lab Results</h3>
          {selectedVisit && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <strong>Selected Visit:</strong> {selectedVisit.id} (Patient ID: {selectedVisit.patient_id})<br/>
              {selectedVisit.triage_notes && <span className="text-xs text-gray-600">Triage: {selectedVisit.triage_notes}</span>}<br/>
              {selectedVisit.diagnosis && <span className="text-xs text-gray-600">Diagnosis: {selectedVisit.diagnosis}</span>}<br/>
              {selectedVisit.prescription && <span className="text-xs text-gray-600">Prescription: {selectedVisit.prescription}</span>}<br/>
              {selectedVisit.billing_status && <span className="text-xs text-gray-600">Billing: {selectedVisit.billing_status}</span>}
            </div>
          )}
          {selectedVisit && (
            <form onSubmit={handleUploadResults} className="space-y-4 bg-white border rounded-lg p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Lab Results</label>
                <textarea 
                  name="results" 
                  value={formData.results} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded" 
                  rows="4"
                  placeholder="Enter lab results..."
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="flex-1 btn-primary">
                  Upload Results
                </button>
                <button 
                  type="button" 
                  onClick={() => setSelectedVisit(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Create New Lab Order Form */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Create New Lab Order</h3>
        <div className="bg-white border rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient ID</label>
              <input
                type="number"
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Type</label>
              <select
                name="test_type"
                value={formData.test_type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Test</option>
                <option value="Blood Test">Blood Test</option>
                <option value="Urine Test">Urine Test</option>
                <option value="Biopsy">Biopsy</option>
                <option value="X-Ray">X-Ray</option>
                <option value="MRI">MRI</option>
                <option value="CT Scan">CT Scan</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                Create Order
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LabOrderForm;