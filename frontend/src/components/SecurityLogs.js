import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchSecurityLogs } from '../slices/securitySlice';

const SecurityLogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { logs, error } = useSelector((state) => state.security); // Removed unused 'status'

  useEffect(() => {
    if (user && user.role === 'Admin') {
      dispatch(fetchSecurityLogs())
        .unwrap()
        .catch((err) => toast.error(`Failed to load security logs: ${err}`));
    } else {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (error) toast.error(`Error: ${error}`);
  }, [error]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Security Logs</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Timestamp</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Action</th>
            <th className="border p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="border p-2">{log.timestamp}</td>
              <td className="border p-2">{log.user}</td>
              <td className="border p-2">{log.action}</td>
              <td className="border p-2">{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SecurityLogs;
