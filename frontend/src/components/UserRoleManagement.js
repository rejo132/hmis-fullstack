import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchUserRoles, updateRole } from '../slices/userRoleSlice';

const UserRoleManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { users, status, error } = useSelector((state) => state.userRoles);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    if (user && user.role === 'Admin') {
      dispatch(fetchUserRoles())
        .unwrap()
        .catch((err) => toast.error(`Failed to load user roles: ${err}`));
    } else {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (error) toast.error(`Error: ${error}`);
  }, [error]);

  const handleRoleChange = async (userId) => {
    try {
      await dispatch(updateRole({ userId, role: newRole })).unwrap();
      toast.success('User Role Updated');
      setSelectedUser(null);
      setNewRole('');
    } catch (err) {
      toast.error(`Failed to update role: ${err}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User Role Management</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Username</th>
            <th className="border p-2">Current Role</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2">
                {selectedUser === u.id ? (
                  <div className="flex space-x-2">
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="p-2 border rounded"
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Patient">Patient</option>
                      <option value="Lab">Lab</option>
                      <option value="Reception">Reception</option>
                    </select>
                    <button
                      onClick={() => handleRoleChange(u.id)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                      disabled={status === 'loading' || !newRole}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedUser(u.id)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    Edit Role
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRoleManagement;