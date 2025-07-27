import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchSettings, updateSystemSettings } from '../slices/settingsSlice';

const SystemSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.settings); // Removed unused 'settings'

  const [formData, setFormData] = useState({
    hospitalName: '',
    contactEmail: '',
    contactPhone: '',
    backupFrequency: 'Daily',
  });

  useEffect(() => {
    if (user && user.role === 'Admin') {
      dispatch(fetchSettings())
        .unwrap()
        .then((data) => setFormData(data))
        .catch((err) => toast.error(`Failed to load settings: ${err}`));
    } else {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (error) toast.error(`Error: ${error}`);
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateSystemSettings(formData)).unwrap();
      toast.success('Settings Updated');
    } catch (err) {
      toast.error(`Failed to update settings: ${err}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">System Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
          <input
            type="text"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Backup Frequency</label>
          <select
            name="backupFrequency"
            value={formData.backupFrequency}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn-primary"
          disabled={status === 'loading'}
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default SystemSettings;
