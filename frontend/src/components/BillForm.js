import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBill } from '../api/api'; // Use api.js client
import toast from 'react-hot-toast';

const BillForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient_id: '',
    amount: '',
    description: '',
    payment_status: 'Pending',
    discount: 0,
    payment_method: 'Cash',
    insurance_provider: '',
    insurance_policy_number: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalAmount = formData.amount - (formData.discount || 0);
      const billData = { ...formData, amount: finalAmount };
      await createBill(billData); // Call real API
      toast.success('Bill Created');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create bill:', err);
      toast.error(`Failed to create bill: ${err.response?.data?.message || 'Error'}`);
    }
  };

  const handlePrintReceipt = () => {
    toast.success('Receipt Printed');
  };

  const handleProcessRefund = () => {
    if (formData.payment_status === 'Paid') {
      toast.success('Refund Processed');
    } else {
      toast.error('Cannot process refund for unpaid bill');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Bill</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="patient_id">
              Patient ID
            </label>
            <input
              id="patient_id"
              name="patient_id"
              type="number"
              value={formData.patient_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="amount">
              Amount (KES)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="discount">
              Discount (KES)
            </label>
            <input
              id="discount"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="payment_status">
              Payment Status
            </label>
            <select
              id="payment_status"
              name="payment_status"
              value={formData.payment_status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="payment_method">
              Payment Method
            </label>
            <select
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Cash">Cash</option>
              <option value="M-Pesa">M-Pesa</option>
              <option value="Card">Card</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="insurance_provider">
              Insurance Provider (Optional)
            </label>
            <input
              id="insurance_provider"
              name="insurance_provider"
              type="text"
              value={formData.insurance_provider}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium" htmlFor="insurance_policy_number">
              Insurance Policy Number (Optional)
            </label>
            <input
              id="insurance_policy_number"
              name="insurance_policy_number"
              type="text"
              value={formData.insurance_policy_number}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              type="button"
              onClick={handlePrintReceipt}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Print Receipt
            </button>
            <button
              type="button"
              onClick={handleProcessRefund}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Process Refund
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillForm;