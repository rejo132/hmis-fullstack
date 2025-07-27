import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchPatients } from '../slices/patientSlice';
import { fetchBills } from '../slices/billingSlice';
import { fetchAppointments } from '../slices/appointmentSlice';
import { getAuditLogs } from '../api/api';


const ReportsDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { patients, error: patientError } = useSelector((state) => state.patients || {});
  const { bills, error: billError } = useSelector((state) => state.bills || {});
  const { appointments, error: appointmentError } = useSelector((state) => state.appointments || {});
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditError, setAuditError] = useState(null);

  useEffect(() => {
    if (
      user && [
        'Admin',
        'Doctor',
        'Nurse',
        'Lab Tech',
        'Pharmacist',
        'Receptionist',
        'Billing',
      ].includes(user.role)
    ) {
      dispatch(fetchPatients(1))
        .unwrap()
        .catch((err) => toast.error(`Failed to load patients: ${err}`));
      dispatch(fetchBills(1))
        .unwrap()
        .catch((err) => toast.error(`Failed to load bills: ${err}`));
      dispatch(fetchAppointments(1))
        .unwrap()
        .catch((err) => toast.error(`Failed to load appointments: ${err}`));
      getAuditLogs(user.access_token)
        .then((response) => {
          // Handle both array and object responses
          const logsData = Array.isArray(response.data) ? response.data : response.data.logs || response.data.auditLogs || [];
          setAuditLogs(logsData);
        })
        .catch((err) => setAuditError(err.response?.data?.message || 'Failed to fetch audit logs'));
    } else {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (patientError) toast.error(`Error: ${patientError}`);
    if (billError) toast.error(`Error: ${billError}`);
    if (appointmentError) toast.error(`Error: ${appointmentError}`);
    if (auditError) toast.error(`Error: ${auditError}`);
  }, [patientError, billError, appointmentError, auditError]);

  // Helper function to get array from potential object
  const getArrayFromData = (data) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      // Try common property names
      return data.patients || data.bills || data.appointments || data.items || [];
    }
    return [];
  };

  // Role-based report visibility matrix
  const canSee = {
    Admin: { patients: true, bills: true, appointments: true, audit: true },
    Doctor: { patients: true, appointments: true },
    Nurse: { patients: true, appointments: true },
    'Lab Tech': { appointments: true },
    Pharmacist: {},
    Receptionist: { patients: true, appointments: true },
    Billing: { bills: true },
    Accountant: { bills: true },
    IT: { audit: true },
    Patient: { patients: true },
  };
  const role = user?.role;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Reports Dashboard</h2>
      <div className="space-y-8">
        {canSee[role]?.patients && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Patient Report</h3>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Contact</th>
                </tr>
              </thead>
              <tbody>
                {getArrayFromData(patients).map((patient) => (
                  <tr key={patient.id}>
                    <td className="border p-2">{patient.id}</td>
                    <td className="border p-2">{patient.name}</td>
                    <td className="border p-2">{patient.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {canSee[role]?.bills && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Billing Report</h3>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Bill ID</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {getArrayFromData(bills).map((bill) => (
                  <tr key={bill.id}>
                    <td className="border p-2">{bill.id}</td>
                    <td className="border p-2">{bill.amount}</td>
                    <td className="border p-2">{bill.payment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {canSee[role]?.appointments && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Appointment Report</h3>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Patient</th>
                  <th className="border p-2">Doctor</th>
                </tr>
              </thead>
              <tbody>
                {getArrayFromData(appointments).map((appt) => (
                  <tr key={appt.id}>
                    <td className="border p-2">{appt.date}</td>
                    <td className="border p-2">{appt.patient_name}</td>
                    <td className="border p-2">{appt.doctor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {canSee[role]?.audit && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Audit Logs</h3>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Timestamp</th>
                  <th className="border p-2">User</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(auditLogs) && auditLogs.length > 0 ? auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="border p-2">{log.timestamp}</td>
                    <td className="border p-2">{log.user}</td>
                    <td className="border p-2">{log.action}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="border p-2 text-center text-gray-500">
                      No audit logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;