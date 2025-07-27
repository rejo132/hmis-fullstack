import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchAssets, scheduleAssetMaintenance as scheduleMaintenance } from '../slices/assetSlice';

const AssetManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, access_token } = useSelector((state) => state.auth);
  const { assets, status, error } = useSelector((state) => state.assets);

  useEffect(() => {
    if (user && user.role === 'Admin') {
      dispatch(fetchAssets());
    } else {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (error) toast.error(`Failed to load assets: ${error}`);
    else if (assets.assets?.length && status === 'succeeded') toast.success('Assets Loaded');
  }, [error, assets, status]);

  const handleScheduleMaintenance = async (assetId) => {
    try {
      await dispatch(scheduleMaintenance({ assetId, token: access_token })).unwrap();
      toast.success(`Maintenance Scheduled for Asset ${assetId}`);
    } catch (err) {
      toast.error(`Failed to schedule maintenance: ${err}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Asset Management</h2>
      {status === 'loading' && <p>Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.assets?.map((asset) => (
          <div key={asset.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">Asset ID: {asset.id}</h3>
            <p>Name: {asset.name}</p>
            <p>Status: {asset.status}</p>
            <p>Next Maintenance: {asset.maintenance_date || 'N/A'}</p>
            <button
              onClick={() => handleScheduleMaintenance(asset.id)}
              className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={status === 'loading'}
            >
              Schedule Maintenance
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetManagement;