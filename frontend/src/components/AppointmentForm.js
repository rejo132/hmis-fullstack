import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPatients } from '../api/api'; // Use api.js client
import { fetchPatients } from '../slices/patientSlice';
import { createAppointment } from '../api/api'; // Use api.js client
import { scheduleAppointment } from '../slices/appointmentSlice';

const AppointmentForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector((state) => state.patients);
  const { user } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.appointments);
  const [formData, setFormData] = useState({
    patient_id: '',
    appointment_time: '',
  });

  useEffect(() => {
    if (user) {
      getPatients(1).then((response) => {
        dispatch(fetchPatients.fulfilled(response.data.patients, 'fetchPatients'));
      }).catch((err) => {
        console.error('Failed to fetch patients:', err);
      });
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`); // Debug log
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting appointment:', formData); // Debug log
      const response = await createAppointment({ ...formData, status: 'Scheduled' }); // Call real API
      await dispatch(scheduleAppointment({ ...formData, id: response.data.id, status: 'Scheduled' })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to schedule appointment:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Schedule Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="patient_id">
              Patient
            </label>
            <select
              id="patient_id"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="appointment_time">
              Appointment Time
            </label>
            <input
              id="appointment_time"
              name="appointment_time"
              type="datetime-local"
              value={formData.appointment_time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={status === 'loading'}
          >
            Schedule Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;