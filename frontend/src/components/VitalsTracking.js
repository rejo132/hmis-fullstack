import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addVitals } from '../slices/vitalsSlice';


const VitalsTracking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.vitals);
  const [formData, setFormData] = useState({
    patientId: '',
    bloodPressure: '',
    temperature: '',
    pulse: '',
    respiration: '',
    recordedAt: '',
  });

  useEffect(() => {
    if (error) toast.error(`Error: ${error}`);
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addVitals({ ...formData, recordedBy: user.username })).unwrap();
      toast.success('Vitals recorded successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(`Error recording vitals: ${err}`);
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Record Vitals</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Patient ID</label>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
          <input
            type="text"
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
          <input
            type="number"
            step="0.1"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pulse (bpm)</label>
          <input
            type="number"
            name="pulse"
            value={formData.pulse}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Respiration Rate</label>
          <input
            type="number"
            name="respiration"
            value={formData.respiration}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Recorded At</label>
          <input
            type="datetime-local"
            name="recordedAt"
            value={formData.recordedAt}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={status === 'loading'}>
          Record Vitals
        </button>
      </form>
    </div>
  );
};

export default VitalsTracking;