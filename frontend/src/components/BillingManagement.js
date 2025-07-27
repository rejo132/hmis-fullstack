import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { processRefund, submitClaim } from '../slices/billingSlice';
import axios from 'axios';
import { getBills } from '../api/api';

const BillingManagement = () => {
  const dispatch = useDispatch();
  const { user, access_token } = useSelector((state) => state.auth);
  const [patients, setPatients] = useState([]);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [formData, setFormData] = useState({
    billId: '',
    refundAmount: '',
    claimId: '',
    insuranceProvider: '',
    claimAmount: '',
  });
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [patientVisits, setPatientVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);

  useEffect(() => {
    fetchPatients();
    fetchPatientVisits();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      const res = await axios.get(`${API_BASE}/api/patients`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setPatients(res.data.patients || []);
    } catch (err) {
      toast.error('Failed to fetch patients');
    }
  };

  const fetchPatientVisits = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      const res = await axios.get(`${API_BASE}/api/patient-visits`, { headers: { Authorization: `Bearer ${token}` } });
      setPatientVisits(res.data.visits || []);
    } catch (err) {
      // handle error
    }
  };

  const handleVisitSelect = (visit) => {
    setSelectedVisit(visit);
  };

  const handleGenerateInvoice = async () => {
    if (!selectedVisit) {
      toast.error('No visit selected');
      return;
    }

    try {
      // Fetch patient details
      const patient = patients.find(p => p.id === selectedVisit.patient_id);
      if (!patient) {
        toast.error('Patient not found');
        return;
      }

      // Calculate services based on visit data
      const services = [];
      let totalAmount = 0;

      // Add consultation fee
      if (selectedVisit.diagnosis) {
        services.push({
          type: 'Consultation',
          description: 'Doctor consultation and diagnosis',
          amount: 5000,
          date: selectedVisit.created_at
        });
        totalAmount += 5000;
      }

      // Add lab test fee
      if (selectedVisit.lab_results) {
        services.push({
          type: 'Laboratory',
          description: 'Laboratory tests and results',
          amount: 3000,
          date: selectedVisit.created_at
        });
        totalAmount += 3000;
      }

      // Add triage fee
      if (selectedVisit.triage_notes) {
        services.push({
          type: 'Triage',
          description: 'Nurse triage assessment',
          amount: 2000,
          date: selectedVisit.created_at
        });
        totalAmount += 2000;
      }

      // Add prescription fee
      if (selectedVisit.prescription) {
        services.push({
          type: 'Pharmacy',
          description: 'Medication and prescription',
          amount: 4000,
          date: selectedVisit.created_at
        });
        totalAmount += 4000;
      }

      // Call backend API to create invoice
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      
      const invoiceData = {
        patient_id: selectedVisit.patient_id,
        visit_id: selectedVisit.id,
        total_amount: totalAmount,
        services: services
      };

      const response = await axios.post(`${API_BASE}/api/invoices`, invoiceData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const backendInvoice = response.data;

    const invoice = {
        patientId: selectedVisit.patient_id,
        patientName: patient.name,
        visitId: selectedVisit.id,
        services: services,
        totalAmount: totalAmount,
        invoiceNumber: backendInvoice.invoice_number,
        generatedDate: backendInvoice.generated_at,
        status: backendInvoice.status,
        visitDetails: {
          diagnosis: selectedVisit.diagnosis,
          prescription: selectedVisit.prescription,
          triageNotes: selectedVisit.triage_notes,
          labResults: selectedVisit.lab_results
        }
    };

    setGeneratedInvoice(invoice);
      toast.success('Invoice generated successfully and saved to database');
    } catch (err) {
      console.error('Error generating invoice:', err);
      toast.error('Failed to generate invoice');
    }
  };

  const handleAcceptPayment = async (paymentMethod) => {
    if (!selectedVisit) {
      toast.error('No visit selected');
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      // Update PatientVisit billing_status to 'paid'
      await axios.put(`${API_BASE}/api/patient-visits/${selectedVisit.id}`, {
        billing_status: 'paid'
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedVisit(null);
      fetchPatientVisits();
      toast.success(`Payment accepted via ${paymentMethod}`);
    } catch (err) {
      toast.error('Failed to process payment');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        processRefund({
          billId: formData.billId,
          refundAmount: formData.refundAmount,
          processedBy: user.username,
          token: access_token,
        })
      ).unwrap();
      toast.success('Refund processed successfully');
      setFormData({ ...formData, billId: '', refundAmount: '' });
    } catch (err) {
      toast.error(`Error processing refund: ${err}`);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        submitClaim({
          claimId: formData.claimId,
          insuranceProvider: formData.insuranceProvider,
          claimAmount: formData.claimAmount,
          processedBy: user.username,
          token: access_token,
        })
      ).unwrap();
      toast.success('Insurance claim submitted successfully');
      setFormData({ ...formData, claimId: '', insuranceProvider: '', claimAmount: '' });
    } catch (err) {
      toast.error(`Error submitting claim: ${err}`);
    }
  };

  const handleGenerateReport = async () => {
    setReportLoading(true);
    setReportError(null);
    try {
      let page = 1;
      let allBills = [];
      let hasMore = true;
      while (hasMore) {
        const res = await getBills(page);
        allBills = allBills.concat(res.data.bills || []);
        if (res.data.page >= res.data.pages) {
          hasMore = false;
        } else {
          page++;
        }
      }
      // Calculate totals
      let totalIncome = 0;
      let pendingPayments = 0;
      let insuranceClaims = 0;
      let refunded = 0;
      let paid = 0;
      let claimed = 0;
      allBills.forEach(bill => {
        const amount = Number(bill.amount) || 0;
        if (bill.payment_status === 'Paid') {
          totalIncome += amount;
          paid += amount;
        } else if (bill.payment_status === 'Pending') {
          pendingPayments += amount;
        } else if (bill.payment_status === 'Claimed') {
          insuranceClaims += amount;
          claimed += amount;
        } else if (bill.payment_status === 'Refunded') {
          refunded += amount;
        }
      });
      setReport({
        totalIncome,
        pendingPayments,
        insuranceClaims,
        refunded,
        paid,
        claimed,
        totalBills: allBills.length,
        billsByStatus: {
          Paid: paid,
          Pending: pendingPayments,
          Claimed: claimed,
          Refunded: refunded,
        },
      });
    } catch (err) {
      setReportError('Failed to generate report');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-lg font-bold text-blue-700 mr-4">Role: Billing Officer</span>
        <span className="text-gray-700">Access patient workflow, auto-generate invoice, accept payment, and mark as paid.</span>
      </div>
      <h2 className="text-2xl font-bold mb-4">Billing Workflow</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PatientVisit Queue */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Patient Workflow Queue (Billing)</h3>
          <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
            {patientVisits.length === 0 ? (
              <p className="text-gray-500">No patients in billing queue.</p>
            ) : (
              <div className="space-y-3">
                {patientVisits.map((visit) => (
                  <div 
                    key={visit.id}
                    className={`p-3 border rounded cursor-pointer transition-colors ${selectedVisit?.id === visit.id ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'}`}
                    onClick={() => handleVisitSelect(visit)}
                  >
                    <div className="font-medium">Visit ID: {visit.id} | Patient ID: {visit.patient_id}</div>
                    <div className="text-sm text-gray-600">Stage: {visit.current_stage}</div>
                    {visit.triage_notes && <div className="text-xs text-gray-600">Triage: {visit.triage_notes}</div>}
                    {visit.lab_results && <div className="text-xs text-gray-600">Lab: {visit.lab_results}</div>}
                    {visit.diagnosis && <div className="text-xs text-gray-600">Diagnosis: {visit.diagnosis}</div>}
                    {visit.prescription && <div className="text-xs text-gray-600">Prescription: {visit.prescription}</div>}
                    {visit.billing_status && <div className="text-xs text-gray-600">Billing: {visit.billing_status}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Payment Form */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Accept Payment</h3>
          {selectedVisit && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <strong>Selected Visit:</strong> {selectedVisit.id} (Patient ID: {selectedVisit.patient_id})<br/>
              {selectedVisit.triage_notes && <span className="text-xs text-gray-600">Triage: {selectedVisit.triage_notes}</span>}<br/>
              {selectedVisit.lab_results && <span className="text-xs text-gray-600">Lab: {selectedVisit.lab_results}</span>}<br/>
              {selectedVisit.diagnosis && <span className="text-xs text-gray-600">Diagnosis: {selectedVisit.diagnosis}</span>}<br/>
              {selectedVisit.prescription && <span className="text-xs text-gray-600">Prescription: {selectedVisit.prescription}</span>}<br/>
              {selectedVisit.billing_status && <span className="text-xs text-gray-600">Billing: {selectedVisit.billing_status}</span>}
            </div>
          )}
          {selectedVisit && (
            <div className="flex flex-col space-y-2">
              <button className="btn-primary" onClick={() => handleAcceptPayment('Cash')}>Accept Cash</button>
              <button className="btn-primary" onClick={() => handleAcceptPayment('Card')}>Accept Card</button>
              <button className="btn-primary" onClick={() => handleAcceptPayment('Insurance')}>Accept Insurance</button>
            </div>
          )}
        </div>
      </div>

      {/* Reports and Other Functions */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Reports & Other Functions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <button className="btn-primary mb-4" onClick={handleGenerateReport} disabled={reportLoading}>
              {reportLoading ? 'Generating...' : 'Generate Billing Report'}
            </button>
            <button className="btn-primary mb-4 ml-2" onClick={handleGenerateInvoice} disabled={!selectedVisit}>
              Generate Invoice
            </button>
            {reportError && <div className="text-red-600 mb-2">{reportError}</div>}
            {generatedInvoice && (
              <div className="p-4 border rounded bg-green-50 mb-4">
                <div className="font-semibold mb-2">Generated Invoice</div>
                <div>Invoice Number: {generatedInvoice.invoiceNumber}</div>
                <div>Patient: {generatedInvoice.patientName}</div>
                <div>Total Amount: KES {generatedInvoice.totalAmount.toLocaleString()}</div>
                <div>Status: {generatedInvoice.status}</div>
                <div>Generated: {new Date(generatedInvoice.generatedDate).toLocaleDateString()}</div>
                <div className="mt-2">
                  <strong>Services:</strong>
                  <ul className="list-disc list-inside">
                    {generatedInvoice.services.map((service, index) => (
                      <li key={index}>
                        {service.type}: {service.description} - KES {service.amount.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {report && (
              <div className="p-4 border rounded bg-gray-50">
                <div className="font-semibold mb-2">Summary</div>
                <div>Total Bills: {report.totalBills}</div>
                <div>Total Income (Paid): KES {report.totalIncome.toLocaleString()}</div>
                <div>Pending Payments: KES {report.pendingPayments.toLocaleString()}</div>
                <div>Insurance Claims: KES {report.insuranceClaims.toLocaleString()}</div>
                <div>Refunded: KES {report.refunded.toLocaleString()}</div>
                <div className="mt-3 font-semibold">Breakdown by Status</div>
                <table className="w-full text-sm mt-2 border">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-1 border">Status</th>
                      <th className="p-1 border">Total (KES)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(report.billsByStatus).map(([status, amount]) => (
                      <tr key={status}>
                        <td className="p-1 border">{status}</td>
                        <td className="p-1 border">{amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Process Refund</h4>
              <form onSubmit={handleRefundSubmit} className="space-y-2">
                <input
                  type="text"
                  name="billId"
                  placeholder="Bill ID"
                  value={formData.billId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="refundAmount"
                  placeholder="Refund Amount"
                  value={formData.refundAmount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <button type="submit" className="btn-primary w-full">
                  Process Refund
                </button>
              </form>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Submit Insurance Claim</h4>
              <form onSubmit={handleClaimSubmit} className="space-y-2">
                <input
                  type="text"
                  name="claimId"
                  placeholder="Claim ID"
                  value={formData.claimId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="insuranceProvider"
                  placeholder="Insurance Provider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="claimAmount"
                  placeholder="Claim Amount"
                  value={formData.claimAmount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <button type="submit" className="btn-primary w-full">
                  Submit Claim
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingManagement;