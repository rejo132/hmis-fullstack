import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchBeds, reserveBedAsync as reserveBed } from '../slices/bedSlice';

const BedManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, access_token } = useSelector((state) => state.auth);
  const { beds, status, error } = useSelector((state) => state.beds || {});

  useEffect(() => {
    if (user && user.role === 'Admin') {
      dispatch(fetchBeds());
    } else {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (error) toast.error(`Failed to load beds: ${error}`);
    else if ((Array.isArray(beds) ? beds.length : beds?.beds?.length) && status === 'succeeded') toast.success('Beds Loaded');
  }, [error, beds, status]);

  const handleReserve = async (bedId) => {
    try {
      await dispatch(reserveBed({ bedId, token: access_token })).unwrap();
      toast.success(`Bed ${bedId} Reserved`);
    } catch (err) {
      toast.error(`Failed to reserve bed: ${err}`);
    }
  };

  const bedsList = Array.isArray(beds) ? beds : beds?.beds || [];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Bed Management</h2>
      {status === 'loading' && <p>Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bedsList.map((bed) => (
          <div key={bed.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">Bed ID: {bed.id}</h3>
            <p>Ward: {bed.ward}</p>
            <p>Status: {bed.status}</p>
            <p>Patient ID: {bed.patient_id || 'None'}</p>
            <button
              onClick={() => handleReserve(bed.id)}
              className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={bed.status !== 'Available' || status === 'loading'}
            >
              Reserve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BedManagement;