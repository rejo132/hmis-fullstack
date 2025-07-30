import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createPaymentIntent, initiateMpesaPayment, confirmPayment, checkMpesaPaymentStatus } from '../api/api';

const PaymentProcessor = ({ invoice, onPaymentComplete, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [mpesaStatus, setMpesaStatus] = useState(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [statusChecking, setStatusChecking] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // Poll for M-Pesa payment status
  useEffect(() => {
    let interval;
    if (checkoutRequestId && mpesaStatus === 'pending') {
      interval = setInterval(async () => {
        await checkPaymentStatus();
      }, 3000); // Check every 3 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [checkoutRequestId, mpesaStatus]);

  const checkPaymentStatus = async () => {
    if (!checkoutRequestId) return;
    
    setStatusChecking(true);
    try {
      const response = await checkMpesaPaymentStatus(checkoutRequestId);
      const status = response.data.status;
      
      if (status === 'completed') {
        setMpesaStatus('completed');
        toast.success('M-Pesa payment completed successfully!');
        onPaymentComplete({
          method: 'mpesa',
          amount: invoice.total_amount,
          transaction_id: response.data.transaction.id
        });
      } else if (status === 'failed') {
        setMpesaStatus('failed');
        toast.error('M-Pesa payment failed or was cancelled');
      } else {
        setMpesaStatus('pending');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setStatusChecking(false);
    }
  };

  const handlePayment = async () => {
    if (!invoice) {
      toast.error('No invoice selected');
      return;
    }

    setLoading(true);
    try {
      switch (paymentMethod) {
        case 'stripe':
          await handleStripePayment();
          break;
        case 'mpesa':
          await handleMpesaPayment();
          break;
        case 'cash':
          await handleCashPayment();
          break;
        default:
          toast.error('Invalid payment method');
      }
    } catch (error) {
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    try {
      // Create payment intent
      const response = await createPaymentIntent({
        invoice_id: invoice.id,
        amount: invoice.total_amount
      });

      // In a real implementation, you would integrate with Stripe Elements
      // For now, we'll simulate a successful payment
      toast.success('Stripe payment processed successfully');
      onPaymentComplete({
        method: 'stripe',
        amount: invoice.total_amount,
        transaction_id: response.data.transaction_id
      });
    } catch (error) {
      throw new Error('Stripe payment failed');
    }
  };

  const handleMpesaPayment = async () => {
    if (!phoneNumber) {
      toast.error('Please enter phone number');
      return;
    }

    try {
      const response = await initiateMpesaPayment({
        invoice_id: invoice.id,
        phone_number: phoneNumber,
        amount: invoice.total_amount
      });

      setCheckoutRequestId(response.data.checkout_request_id);
      setMpesaStatus('pending');
      
      toast.success(response.data.customer_prompt, {
        duration: 6000,
        icon: '📱'
      });
      
      // Show customer instructions
      toast.success('Customer has been prompted to enter M-Pesa PIN. Waiting for payment confirmation...', {
        duration: 8000
      });
      
    } catch (error) {
      throw new Error('M-Pesa payment failed');
    }
  };

  const handleCashPayment = async () => {
    try {
      // Create a manual payment transaction
      const response = await confirmPayment({
        invoice_id: invoice.id,
        payment_method: 'cash',
        amount: invoice.total_amount
      });

      toast.success('Cash payment confirmed');
      onPaymentComplete({
        method: 'cash',
        amount: invoice.total_amount,
        transaction_id: response.data.transaction_id
      });
    } catch (error) {
      throw new Error('Cash payment confirmation failed');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const getMpesaStatusMessage = () => {
    switch (mpesaStatus) {
      case 'pending':
        return '⏳ Waiting for customer to enter M-Pesa PIN...';
      case 'completed':
        return '✅ Payment completed successfully!';
      case 'failed':
        return '❌ Payment failed or was cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Process Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Invoice Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Invoice Summary</h3>
          <div className="space-y-1 text-sm">
            <div>Invoice #: {invoice.invoice_number}</div>
            <div>Patient ID: {invoice.patient_id}</div>
            <div className="text-lg font-bold">
              Total: {formatCurrency(invoice.total_amount)}
            </div>
          </div>
        </div>

        {/* M-Pesa Status Display */}
        {mpesaStatus && (
          <div className={`p-3 rounded-lg mb-4 ${
            mpesaStatus === 'completed' ? 'bg-green-50 border border-green-200' :
            mpesaStatus === 'failed' ? 'bg-red-50 border border-red-200' :
            'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{getMpesaStatusMessage()}</span>
              {statusChecking && (
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              )}
            </div>
            {mpesaStatus === 'pending' && (
              <div className="mt-2 text-xs text-gray-600">
                Customer should check their phone and enter M-Pesa PIN to complete payment
              </div>
            )}
          </div>
        )}

        {/* Payment Method Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Payment Method</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Cash
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="mpesa"
                checked={paymentMethod === 'mpesa'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              M-Pesa (Mobile Money)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Card (Stripe)
            </label>
          </div>
        </div>

        {/* M-Pesa Phone Number */}
        {paymentMethod === 'mpesa' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Phone Number (M-Pesa)
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="254700000000"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              Enter phone number registered with M-Pesa
            </div>
          </div>
        )}

        {/* Card Details */}
        {paymentMethod === 'stripe' && (
          <div className="mb-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input
                type="text"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <input
                  type="text"
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                  placeholder="MM/YY"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="text"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  placeholder="123"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cardholder Name</label>
              <input
                type="text"
                value={cardDetails.cardholderName}
                onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
                placeholder="John Doe"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            disabled={loading || mpesaStatus === 'pending'}
          >
            Cancel
          </button>
          {mpesaStatus === 'pending' ? (
            <button
              onClick={checkPaymentStatus}
              disabled={statusChecking}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {statusChecking ? 'Checking...' : 'Check Status'}
            </button>
          ) : (
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay ${formatCurrency(invoice.total_amount)}`}
            </button>
          )}
        </div>

        {/* Processing Status */}
        {loading && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <div className="animate-spin inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
            Processing payment...
          </div>
        )}

        {/* M-Pesa Instructions */}
        {paymentMethod === 'mpesa' && !mpesaStatus && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">📱 M-Pesa Payment Instructions</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Customer will receive an M-Pesa prompt on their phone</li>
              <li>• Customer must enter their M-Pesa PIN to complete payment</li>
              <li>• Payment status will be automatically checked</li>
              <li>• You can manually check status if needed</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessor; 