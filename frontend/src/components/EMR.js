import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRecords } from '../slices/recordSlice';
import toast from 'react-hot-toast';

const EMR = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { records, error, status } = useSelector((state) => state.records || {});
  const { user } = useSelector((state) => state.auth);

  // Helper function to format vital signs
  const formatVitalSigns = (vitalSigns) => {
    if (!vitalSigns) return 'N/A';
    if (typeof vitalSigns === 'string') return vitalSigns;
    if (typeof vitalSigns === 'object') {
      const { bp, heart_rate, temperature, respiratory_rate } = vitalSigns;
      const parts = [];
      if (bp) parts.push(`BP: ${bp}`);
      if (heart_rate) parts.push(`HR: ${heart_rate}`);
      if (temperature) parts.push(`Temp: ${temperature}°C`);
      if (respiratory_rate) parts.push(`RR: ${respiratory_rate}`);
      return parts.length > 0 ? parts.join(', ') : 'N/A';
    }
    return 'N/A';
  };

  // Mock patient data for UI (replace with real data fetch if available)
  const getPatientData = () => {
    const recordsArray = Array.isArray(records) ? records : records?.records || [];
    return recordsArray.length > 0 ? recordsArray[0] : {
      name: 'Mary Kim',
      age: 32,
      gender: 'Female',
      patient_id: 1,
      vital_signs: 'BP: 120/80, Temp: 37.1°C',
      diagnosis: 'Malaria',
      prescription: 'Artemether 80mg – 3 days',
      notes: 'Follow up in 1 week',
    };
  };

  const patient = getPatientData();

  useEffect(() => {
    if (user && (user.role === 'Admin' || user.role === 'Doctor')) {
      dispatch(fetchRecords(1))
        .unwrap()
        .then(() => toast.success('Records Loaded'))
        .catch((err) => toast.error(`Failed to load records: ${err}`));
    } else {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (error) toast.error(`Error: ${error}`);
  }, [error]);

  const handleAction = (action) => {
    toast.success(`${action} clicked`);
    if (action === 'Edit' || action === 'Add Lab Test') {
      navigate('/records/new');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Electronic Medical Record</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <h3 className="font-bold">Patient</h3>
            <p>{patient.name || `Patient ID: ${patient.patient_id}`}</p>
          </div>
          <div>
            <h3 className="font-bold">Age</h3>
            <p>{patient.age || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-bold">Gender</h3>
            <p>{patient.gender || 'N/A'}</p>
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="font-bold">Vitals</h3>
          <p>{formatVitalSigns(patient.vital_signs)}</p>
        </div>
        <div className="border-t pt-4">
          <h3 className="font-bold">Diagnosis</h3>
          <p>{patient.diagnosis || 'N/A'}</p>
        </div>
        <div className="border-t pt-4">
          <h3 className="font-bold">Prescriptions</h3>
          <p>{patient.prescription || 'N/A'}</p>
        </div>
        <div className="border-t pt-4">
          <h3 className="font-bold">Notes</h3>
          <p>{patient.notes || 'N/A'}</p>
        </div>
        <div className="border-t pt-4 flex space-x-4">
          <button
            onClick={() => handleAction('Edit')}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={status === 'loading'}
          >
            Edit
          </button>
          <button
            onClick={() => handleAction('Print')}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Print
          </button>
          <button
            onClick={() => handleAction('Add Lab Test')}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Add Lab Test
          </button>
          <button
            onClick={() => handleAction('Discharge')}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Discharge
          </button>
        </div>
      </div>
    </div>
  );
};

export default EMR;