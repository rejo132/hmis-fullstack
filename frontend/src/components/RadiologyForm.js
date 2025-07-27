import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addRadiologyOrder } from '../slices/radiologySlice';

const RadiologyForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.radiology);
  const [formData, setFormData] = useState({
    patient_id: '',
    test_type: '',
    status: 'Ordered',
    results: '',
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
      await dispatch(addRadiologyOrder(formData)).unwrap();
      toast.success('Radiology Order Created');
      navigate('/dashboard');
    } catch (err) {
      toast.error(`Failed to create radiology order: ${err}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Order Radiology Test</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="patient_id">
              Patient ID
            </label>
            <input
              id="patient_id"
              name="patient_id"
              type="number"
              value={formData.patient_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="test_type">
              Test Type
            </label>
            <select
              id="test_type"
              name="test_type"
              value={formData.test_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Test</option>
              <option value="X-Ray">X-Ray</option>
              <option value="MRI">MRI</option>
              <option value="CT Scan">CT Scan</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="results">
              Results (Optional)
            </label>
            <textarea
              id="results"
              name="results"
              value={formData.results}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={status === 'loading'}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RadiologyForm;