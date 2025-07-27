import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPatient } from '../api/api';
import { addPatient } from '../slices/patientSlice';
import toast from 'react-hot-toast';

const PatientForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.patients);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    contact: '',
    address: '',
    medical_history: '',
    allergies: '',
    age: '',
    gender: 'Male',
    email: '',
    emergencyContact: '',
    insurance: '',
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
      const response = await createPatient(formData);
      await dispatch(addPatient({ ...formData, id: response.data.id })).unwrap();
      toast.success('Patient Added');
      navigate('/dashboard');
    } catch (err) {
      toast.error(`Failed to add patient: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Patient Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="age">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="dob">
              Date of Birth
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="contact">
              Phone
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              value={formData.contact}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="emergencyContact">
              Emergency Contact
            </label>
            <input
              id="emergencyContact"
              name="emergencyContact"
              type="text"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="insurance">
              Insurance
            </label>
            <input
              id="insurance"
              name="insurance"
              type="text"
              value={formData.insurance}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="medical_history">
              Medical History
            </label>
            <textarea
              id="medical_history"
              name="medical_history"
              value={formData.medical_history}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="allergies">
              Allergies
            </label>
            <textarea
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
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

export default PatientForm;