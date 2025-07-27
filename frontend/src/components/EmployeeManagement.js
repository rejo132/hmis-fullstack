import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchEmployees, addEmployee } from '../slices/employeeSlice';

const EmployeeManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { employees, status, error } = useSelector((state) => state.employees);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    role: 'Doctor',
    schedule: '',
    salary: '',
  });

  useEffect(() => {
    if (user && user.role === 'Admin') {
      dispatch(fetchEmployees())
        .unwrap()
        .then(() => toast.success('Employees Loaded'))
        .catch((err) => toast.error(`Failed to load employees: ${err}`));
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
      const payload = {
        username: formData.name,
        password: formData.password,
        role: formData.role,
      };
      await dispatch(addEmployee(payload)).unwrap();
      toast.success('Employee Added');
      setFormData({ name: '', password: '', role: 'Doctor', schedule: '', salary: '' });
    } catch (err) {
      toast.error(`Failed to add employee: ${err}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Employee Management</h2>
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Add Employee</h3>
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
            <label className="block text-gray-700 text-sm font-medium" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Admin">Admin</option>
              <option value="Lab">Lab</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="schedule">
              Schedule
            </label>
            <input
              id="schedule"
              name="schedule"
              type="text"
              value={formData.schedule}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="salary">
              Salary
            </label>
            <input
              id="salary"
              name="salary"
              type="number"
              value={formData.salary}
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
              Add Employee
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
      <h3 className="text-xl font-semibold mb-4">Employee List</h3>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Schedule</th>
            <th className="border p-2">Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="border p-2">{employee.id}</td>
              <td className="border p-2">{employee.name}</td>
              <td className="border p-2">{employee.role}</td>
              <td className="border p-2">{employee.schedule}</td>
              <td className="border p-2">{employee.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;