import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchShifts, addShift } from '../slices/shiftSlice';

const ShiftManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { shifts, status, error } = useSelector((state) => state.shifts);
  const [formData, setFormData] = useState({
    employeeId: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    if (user && user.role === 'Admin') {
      dispatch(fetchShifts())
        .unwrap()
        .catch((err) => toast.error(`Failed to load shifts: ${err}`));
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
      await dispatch(addShift(formData)).unwrap();
      toast.success('Shift Added');
      setFormData({ employeeId: '', startTime: '', endTime: '' });
    } catch (err) {
      toast.error(`Failed to add shift: ${err}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shift Management</h2>
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Add Shift</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="employeeId">
              Employee ID
            </label>
            <input
              id="employeeId"
              name="employeeId"
              type="number"
              value={formData.employeeId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="startTime">
              Start Time
            </label>
            <input
              id="startTime"
              name="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="endTime">
              End Time
            </label>
            <input
              id="endTime"
              name="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={status === 'loading'}
            >
              Add Shift
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
      <h3 className="text-xl font-semibold mb-4">Shift List</h3>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Employee ID</th>
            <th className="border p-2">Start Time</th>
            <th className="border p-2">End Time</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift) => (
            <tr key={shift.id}>
              <td className="border p-2">{shift.employeeId}</td>
              <td className="border p-2">{shift.startTime}</td>
              <td className="border p-2">{shift.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftManagement;