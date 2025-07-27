import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addMedication } from '../slices/medicationSlice';

const MedicationAdministration = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.medications);
  const [formData, setFormData] = useState({
    patientId: '',
    medication: '',
    dosage: '',
    time: '',
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
      await dispatch(addMedication({ ...formData, administeredBy: user.username })).unwrap();
      toast.success('Medication recorded successfully');
      setFormData({ patientId: '', medication: '', dosage: '', time: '' });
    } catch (err) {
      toast.error(`Error recording medication: ${err}`);
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Administer Medication</h2>
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
          <label className="block text-sm font-medium text-gray-700">Medication</label>
          <input
            type="text"
            name="medication"
            value={formData.medication}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dosage</label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Administration Time</label>
          <input
            type="datetime-local"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md"
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={status === 'loading'}>
          Record Administration
        </button>
      </form>
    </div>
  );
};

export default MedicationAdministration;