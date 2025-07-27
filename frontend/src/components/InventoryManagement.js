import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchInventory, dispenseItem } from '../slices/inventorySlice';
import axios from 'axios';

const InventoryManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, status, error } = useSelector((state) => state.inventory);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [dispenseForm, setDispenseForm] = useState({
    itemId: '',
    quantity: '',
    patientId: '',
  });
  const [counselingNote, setCounselingNote] = useState('');
  const [interactionAlert, setInteractionAlert] = useState('');
  const [dosageInstructions, setDosageInstructions] = useState('');

  const knownInteractions = [
    { drugs: ['DrugA', 'DrugB'], message: 'DrugA and DrugB should not be used together.' },
    { drugs: ['Aspirin', 'Warfarin'], message: 'Increased risk of bleeding when taken together.' },
    { drugs: ['Amoxicillin', 'Birth Control'], message: 'Birth control may be less effective.' },
  ];

  useEffect(() => {
    dispatch(fetchInventory())
      .unwrap()
      .catch((err) => toast.error(`Error fetching inventory: ${err}`));
    fetchPrescriptions();
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(`Error: ${error}`);
  }, [error]);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_BASE = 'http://localhost:5000';
      const res = await axios.get(`${API_BASE}/api/patient-visits`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      // Filter PatientVisit records that are in pharmacy stage and have prescriptions
      const visitsWithPrescriptions = (res.data.visits || []).filter(visit => 
        visit.current_stage === 'pharmacy' && visit.prescription && visit.prescription.trim() !== ''
      );
      setPrescriptions(visitsWithPrescriptions);
    } catch (err) {
      toast.error('Failed to fetch prescriptions');
    }
  };

  const handlePrescriptionSelect = (prescription) => {
    setSelectedPrescription(prescription);
    setDispenseForm(prev => ({ 
      ...prev, 
      patientId: prescription.patient_id,
      itemId: prescription.prescription.split(' ')[0] // Extract first word as medication name
    }));
  };

  const handleDispenseChange = (e) => {
    setDispenseForm({ ...dispenseForm, [e.target.name]: e.target.value });
    // Drug interaction check
    if (e.target.name === 'itemId') {
      const found = knownInteractions.find((i) => i.drugs.includes(e.target.value));
      setInteractionAlert(found ? found.message : '');
    }
  };

  const handleDispenseSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(dispenseItem({ 
        ...dispenseForm, 
        dispensedBy: user.username,
        counselingNote,
        dosageInstructions,
        prescriptionId: selectedPrescription?.id
      })).unwrap();
      
      // Update PatientVisit to move to billing stage
      if (selectedPrescription) {
        const token = localStorage.getItem('access_token');
        const API_BASE = 'http://localhost:5000';
        await axios.put(`${API_BASE}/api/patient-visits/${selectedPrescription.id}`, {}, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
      }
      
      toast.success('Medication dispensed successfully and patient moved to billing stage');
      setDispenseForm({ itemId: '', quantity: '', patientId: '' });
      setCounselingNote('');
      setInteractionAlert('');
      setDosageInstructions('');
      setSelectedPrescription(null);
      fetchPrescriptions(); // Refresh prescriptions
    } catch (err) {
      toast.error(`Error dispensing medication: ${err}`);
    }
  };

  // Helper function to get status based on quantity
  const getItemStatus = (quantity) => {
    if (quantity === 0) {
      return <span className="text-red-600 font-semibold">Out of Stock</span>;
    } else if (quantity <= 10) {
      return <span className="text-yellow-600 font-semibold">Low Stock</span>;
    } else {
      return <span className="text-green-600 font-semibold">In Stock</span>;
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-lg font-bold text-blue-700 mr-4">Role: Pharmacist</span>
        <span className="text-gray-700">View e-prescriptions, update inventory, record dosage/counseling, and dispense medication.</span>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Pharmacy Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prescriptions List */}
        <div>
          <h3 className="text-xl font-semibold mb-4">E-Prescriptions</h3>
          <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
            {prescriptions.length === 0 ? (
              <p className="text-gray-500">No prescriptions available.</p>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((prescription) => (
                  <div 
                    key={prescription.id}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedPrescription?.id === prescription.id 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handlePrescriptionSelect(prescription)}
                  >
                    <div className="font-medium">Visit ID: {prescription.id} | Patient ID: {prescription.patient_id}</div>
                    <div className="text-sm text-gray-600">Stage: {prescription.current_stage}</div>
                    <div className="text-sm text-gray-600">Prescription: {prescription.prescription}</div>
                    <div className="text-sm text-gray-500">Diagnosis: {prescription.diagnosis}</div>
                    {prescription.triage_notes && <div className="text-xs text-gray-600">Triage: {prescription.triage_notes}</div>}
                    {prescription.lab_results && <div className="text-xs text-gray-600">Lab: {prescription.lab_results}</div>}
                    <div className="text-sm text-gray-500">Date: {prescription.created_at}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dispensing Form */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Dispense Medication</h3>
          {selectedPrescription && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <strong>Selected Visit:</strong> {selectedPrescription.id} (Patient ID: {selectedPrescription.patient_id})<br/>
              <strong>Stage:</strong> {selectedPrescription.current_stage}<br/>
              {selectedPrescription.triage_notes && <span className="text-xs text-gray-600">Triage: {selectedPrescription.triage_notes}</span>}<br/>
              {selectedPrescription.lab_results && <span className="text-xs text-gray-600">Lab: {selectedPrescription.lab_results}</span>}<br/>
              {selectedPrescription.diagnosis && <span className="text-xs text-gray-600">Diagnosis: {selectedPrescription.diagnosis}</span>}<br/>
              <strong>Prescription:</strong> {selectedPrescription.prescription}
            </div>
          )}
          
          <form onSubmit={handleDispenseSubmit} className="space-y-4 bg-white border rounded-lg p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Medication Name</label>
              <input
                type="text"
                name="itemId"
                value={dispenseForm.itemId}
                onChange={handleDispenseChange}
                className="mt-1 p-2 block w-full border rounded-md"
                placeholder="e.g., Amoxicillin, Ibuprofen"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={dispenseForm.quantity}
                onChange={handleDispenseChange}
                className="mt-1 p-2 block w-full border rounded-md"
                placeholder="Number of units"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient ID</label>
              <input
                type="text"
                name="patientId"
                value={dispenseForm.patientId}
                onChange={handleDispenseChange}
                className="mt-1 p-2 block w-full border rounded-md"
                required
                readOnly={!!selectedPrescription}
              />
            </div>
            
            {interactionAlert && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 font-semibold">
                ⚠️ Drug Interaction Alert: {interactionAlert}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Dosage Instructions</label>
              <textarea
                name="dosageInstructions"
                value={dosageInstructions}
                onChange={(e) => setDosageInstructions(e.target.value)}
                className="mt-1 p-2 block w-full border rounded-md"
                rows="3"
                placeholder="e.g., Take 1 tablet twice daily with food"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Counseling Note</label>
              <textarea
                name="counselingNote"
                value={counselingNote}
                onChange={(e) => setCounselingNote(e.target.value)}
                className="mt-1 p-2 block w-full border rounded-md"
                rows="3"
                placeholder="e.g., Side effects, storage instructions, when to contact doctor"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full btn-primary" 
              disabled={status === 'loading'}
            >
              Dispense Medication
            </button>
          </form>
        </div>
      </div>

      {/* Inventory Management */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Inventory Status</h3>
        <div className="bg-white border rounded-lg overflow-hidden">
          {status === 'loading' ? (
            <div className="text-center py-4">Loading inventory...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 border text-left">ID</th>
                    <th className="py-2 px-4 border text-left">Item Name</th>
                    <th className="py-2 px-4 border text-left">Quantity</th>
                    <th className="py-2 px-4 border text-left">Last Updated</th>
                    <th className="py-2 px-4 border text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(items) && items.length > 0 ? (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border">{item.id}</td>
                        <td className="py-2 px-4 border">{item.item_name}</td>
                        <td className="py-2 px-4 border">{item.quantity}</td>
                        <td className="py-2 px-4 border">
                          {new Date(item.last_updated).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border">
                          {getItemStatus(item.quantity)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-4 px-4 border text-center text-gray-500">
                        No inventory items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;