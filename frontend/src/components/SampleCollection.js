import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addSample } from '../slices/sampleSlice';


const SampleCollection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.samples);
  const [formData, setFormData] = useState({
    patientId: '',
    sampleType: '',
    collectionTime: '',
    collectedBy: '',
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
      await dispatch(addSample({ ...formData, collectedBy: user.username })).unwrap();
      toast.success('Sample recorded successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(`Error recording sample: ${err}`);
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Sample Collection</h2>
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
          <label className="block text-sm font-medium text-gray-700">Sample Type</label>
          <select
            name="sampleType"
            value={formData.sampleType}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          >
            <option value="">Select Sample Type</option>
            <option value="Blood">Blood</option>
            <option value="Urine">Urine</option>
            <option value="Tissue">Tissue</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Collection Time</label>
          <input
            type="datetime-local"
            name="collectionTime"
            value={formData.collectionTime}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={status === 'loading'}>
          Record Sample
        </button>
      </form>
    </div>
  );
};

export default SampleCollection;