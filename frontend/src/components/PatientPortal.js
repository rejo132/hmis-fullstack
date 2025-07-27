import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchAppointments } from '../slices/appointmentSlice';
import { fetchBills, editBill } from '../slices/billingSlice';
import { fetchRecords } from '../slices/recordSlice';

const PatientPortal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { appointments, error: appointmentError } = useSelector((state) => state.appointments);
  const { bills, error: billError } = useSelector((state) => state.bills);
  const { records, error: recordError } = useSelector((state) => state.records);

  useEffect(() => {
    if (user && user.role === 'Patient') {
      dispatch(fetchAppointments(1))
        .unwrap()
        .catch((err) => toast.error(`Failed to load appointments: ${err}`));
      dispatch(fetchBills(1))
        .unwrap()
        .catch((err) => toast.error(`Failed to load bills: ${err}`));
      dispatch(fetchRecords(1))
        .unwrap()
        .catch((err) => toast.error(`Failed to load records: ${err}`));
    } else {
      navigate('/login');
      toast.error('Unauthorized access');
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (appointmentError) toast.error(`Failed to load appointments: ${appointmentError}`);
    if (billError) toast.error(`Failed to load bills: ${billError}`);
    if (recordError) toast.error(`Failed to load records: ${recordError}`);
  }, [appointmentError, billError, recordError]);

  const handlePayBill = async (billId) => {
    try {
      await dispatch(editBill({ billId, data: { payment_status: 'Paid' } })).unwrap();
      toast.success(`Payment Initiated for Bill ${billId}`);
    } catch (err) {
      toast.error(`Failed to pay bill: ${err}`);
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Patient Portal</h2>
      <div className="mb-8">
        <NavLink to="/appointments/new" className="btn-primary inline-flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Book Appointment
        </NavLink>
      </div>
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Appointments</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Time</th>
                  <th className="py-2 px-4 border">Doctor</th>
                  <th className="py-2 px-4 border">Reason</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td className="py-2 px-4 border">{appt.date}</td>
                    <td className="py-2 px-4 border">{appt.time}</td>
                    <td className="py-2 px-4 border">{appt.doctor}</td>
                    <td className="py-2 px-4 border">{appt.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Bills</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Bill ID</th>
                  <th className="py-2 px-4 border">Amount</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="py-2 px-4 border">{bill.id}</td>
                    <td className="py-2 px-4 border">{bill.amount}</td>
                    <td className="py-2 px-4 border">{bill.payment_status}</td>
                    <td className="py-2 px-4 border">
                      {bill.payment_status !== 'Paid' && (
                        <button
                          onClick={() => handlePayBill(bill.id)}
                          className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Medical Records</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Diagnosis</th>
                  <th className="py-2 px-4 border">Prescription</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="py-2 px-4 border">{record.date}</td>
                    <td className="py-2 px-4 border">{record.diagnosis}</td>
                    <td className="py-2 px-4 border">{record.prescription}</td>
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

export default PatientPortal;