import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchExpenses, fetchReimbursements, fetchPayroll, addExpense } from '../slices/financeSlice';

const FinanceManagement = () => {
  const dispatch = useDispatch();
  const { expenses, reimbursements, payroll, status, error } = useSelector((state) => state.finance || {});
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
  });
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchExpenses()).unwrap(),
          dispatch(fetchReimbursements()).unwrap(),
          dispatch(fetchPayroll()).unwrap(),
        ]);
      } catch (err) {
        toast.error(`Error fetching financial data: ${err}`);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(`Error: ${error}`);
  }, [error]);

  useEffect(() => {
    // Fetch users for dropdown (mock or real API)
    setUsers([
      { id: 1, username: 'admin' },
      { id: 2, username: 'doctor1' },
      { id: 3, username: 'nurse1' },
    ]);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addExpense({ user_id: selectedUser, amount: formData.amount })).unwrap();
      toast.success('Expense recorded successfully');
      setFormData({ description: '', amount: '', date: '' });
      setSelectedUser('');
    } catch (err) {
      toast.error(`Error recording expense: ${err}`);
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Finance Management</h2>
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Record Expense</h3>
          <form onSubmit={handleExpenseSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
              />
            </div>
            <div>
              <label>User</label>
              <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required className="w-full border p-2 rounded">
                <option value="">Select User</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={status === 'loading'}>
              Record Expense
            </button>
          </form>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Expenses</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Description</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(expenses) ? expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="py-2 px-4 border">{exp.description}</td>
                    <td className="py-2 px-4 border">{exp.amount}</td>
                    <td className="py-2 px-4 border">{exp.date}</td>
                  </tr>
                )) : expenses?.expenses?.map((exp) => (
                  <tr key={exp.id}>
                    <td className="py-2 px-4 border">{exp.description}</td>
                    <td className="py-2 px-4 border">{exp.amount}</td>
                    <td className="py-2 px-4 border">{exp.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Insurance Reimbursements</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Claim ID</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(reimbursements) ? reimbursements.map((reimb) => (
                  <tr key={reimb.id}>
                    <td className="py-2 px-4 border">{reimb.claimId}</td>
                    <td className="py-2 px-4 border">{reimb.amount}</td>
                    <td className="py-2 px-4 border">{reimb.status}</td>
                  </tr>
                )) : reimbursements?.reimbursements?.map((reimb) => (
                  <tr key={reimb.id}>
                    <td className="py-2 px-4 border">{reimb.claimId}</td>
                    <td className="py-2 px-4 border">{reimb.amount}</td>
                    <td className="py-2 px-4 border">{reimb.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Payroll</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Employee</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(payroll) ? payroll.map((pay) => (
                  <tr key={pay.id}>
                    <td className="py-2 px-4 border">{pay.employee}</td>
                    <td className="py-2 px-4 border">{pay.amount}</td>
                    <td className="py-2 px-4 border">{pay.date}</td>
                  </tr>
                )) : payroll?.payroll?.map((pay) => (
                  <tr key={pay.id}>
                    <td className="py-2 px-4 border">{pay.employee}</td>
                    <td className="py-2 px-4 border">{pay.amount}</td>
                    <td className="py-2 px-4 border">{pay.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceManagement;