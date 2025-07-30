# Payment API Integration Guide for HMIS

## Overview

Your HMIS (Hospital Management Information System) is **highly suitable** for payment API integration. The current system has a solid foundation with billing models, invoice management, and basic payment tracking. This guide outlines the complete payment API implementation.

## Current System Analysis ✅

### Backend Infrastructure
- **Database Models**: `Bill`, `Invoice`, `PatientVisit` with payment tracking
- **Existing Endpoints**: Basic payment processing, refunds, insurance claims
- **Authentication**: JWT-based with role-based access control
- **Logging**: Comprehensive audit logging system

### Frontend Components
- **BillingManagement.js**: Main billing interface
- **BillForm.js**: Bill creation and management
- **Payment UI**: Basic payment acceptance buttons

## Payment API Implementation ✅

### 1. Backend Enhancements

#### New Database Model: `PaymentTransaction`
```python
class PaymentTransaction(db.Model):
    __tablename__ = 'payment_transaction'
    id = db.Column(db.Integer, primary_key=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoice.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='KES')
    payment_method = db.Column(db.String(50), nullable=False)  # stripe, mpesa, cash
    gateway_reference = db.Column(db.String(100))  # External gateway reference
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed, refunded
    gateway_response = db.Column(db.JSON)  # Store full gateway response
    processed_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = db.Column(db.DateTime)
```

#### New API Endpoints

1. **Stripe Integration**
   - `POST /api/payments/create-intent` - Create Stripe payment intent
   - Supports card payments with secure tokenization

2. **M-Pesa Integration**
   - `POST /api/payments/mpesa/initiate` - Initiate M-Pesa STK Push
   - `POST /api/payments/mpesa/callback` - Handle M-Pesa callbacks
   - Perfect for Kenyan market

3. **Payment Management**
   - `POST /api/payments/confirm` - Manual payment confirmation
   - `GET /api/payments/transactions` - List payment transactions
   - `POST /api/payments/refund` - Process refunds

### 2. Frontend Enhancements

#### New Components
1. **PaymentProcessor.js** - Modal for processing payments
   - Multiple payment methods (Cash, M-Pesa, Stripe)
   - Real-time payment status
   - Form validation and error handling

2. **PaymentTransactions.js** - Transaction management
   - Filter and search transactions
   - Refund processing
   - Detailed transaction history

#### Enhanced API Integration
```javascript
// Payment API functions
export const createPaymentIntent = (data) => api.post('/api/payments/create-intent', data);
export const initiateMpesaPayment = (data) => api.post('/api/payments/mpesa/initiate', data);
export const confirmPayment = (data) => api.post('/api/payments/confirm', data);
export const getPaymentTransactions = (params) => api.get('/api/payments/transactions', { params });
export const refundPayment = (data) => api.post('/api/payments/refund', data);
```

## Payment Gateway Options

### 1. M-Pesa (Recommended for Kenya) 🏆
**Pros:**
- Most popular mobile money in Kenya
- Excellent for healthcare payments
- High user adoption
- Good documentation and SDKs

**Implementation:**
- STK Push for seamless payments
- Callback handling for payment confirmations
- Business-to-customer (B2C) transfers for refunds

### 2. Stripe
**Pros:**
- International card payments
- Excellent developer experience
- Webhook support
- Comprehensive fraud protection

**Implementation:**
- Payment Intents API
- Elements for secure card input
- Webhook handling for payment events

### 3. PayPal
**Pros:**
- Global reach
- Easy integration
- Good for international patients

## Environment Configuration

### Required Environment Variables
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# M-Pesa Configuration
MPESA_API_URL=https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest
MPESA_BUSINESS_SHORTCODE=174379
MPESA_PASSKEY=your_mpesa_passkey
MPESA_ACCESS_TOKEN=your_mpesa_access_token

# General Configuration
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
```

## Implementation Steps

### Phase 1: Backend Setup
1. ✅ Install payment dependencies (stripe, requests)
2. ✅ Create PaymentTransaction model
3. ✅ Implement payment API endpoints
4. ✅ Add environment variables
5. ✅ Run database migrations

### Phase 2: Frontend Integration
1. ✅ Add payment API functions
2. ✅ Create PaymentProcessor component
3. ✅ Create PaymentTransactions component
4. ✅ Integrate with existing billing interface

### Phase 3: Testing & Deployment
1. Test payment flows in sandbox environment
2. Configure webhook endpoints
3. Set up production environment variables
4. Deploy to production

## Security Considerations

### Payment Security
- **PCI Compliance**: Stripe handles card data securely
- **Tokenization**: No card data stored in your database
- **Encryption**: All sensitive data encrypted in transit
- **Audit Logging**: Complete payment audit trail

### API Security
- **JWT Authentication**: All payment endpoints protected
- **Role-based Access**: Only billing/admin users can process payments
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Implement rate limiting for payment endpoints

## Usage Examples

### Processing a Payment
```javascript
// In BillingManagement.js
const handlePayment = async (invoice) => {
  setShowPaymentModal(true);
  setSelectedInvoice(invoice);
};

const onPaymentComplete = (paymentResult) => {
  toast.success(`Payment completed via ${paymentResult.method}`);
  fetchInvoices(); // Refresh invoice list
  setShowPaymentModal(false);
};
```

### M-Pesa Payment Flow
1. User selects M-Pesa payment method
2. Enters phone number
3. System initiates STK Push
4. User receives SMS prompt on phone
5. User enters M-Pesa PIN
6. Payment confirmed via callback
7. Invoice marked as paid

### Stripe Payment Flow
1. User selects card payment
2. Enters card details (secured by Stripe Elements)
3. System creates payment intent
4. Card payment processed by Stripe
5. Payment confirmed via webhook
6. Invoice marked as paid

## Monitoring & Analytics

### Payment Metrics
- Total revenue by payment method
- Payment success rates
- Average transaction value
- Refund rates and reasons

### Error Tracking
- Failed payment attempts
- Gateway errors
- Network timeouts
- User abandonment rates

## Cost Considerations

### M-Pesa Fees
- Transaction fee: ~KES 1-50 depending on amount
- No setup fees
- No monthly fees

### Stripe Fees
- 3.5% + KES 2.90 per successful card charge
- No setup fees
- No monthly fees

### PayPal Fees
- 4.4% + fixed fee per transaction
- No setup fees
- No monthly fees

## Next Steps

1. **Choose Payment Gateway**: Recommend M-Pesa for Kenya market
2. **Set Up Accounts**: Register with chosen payment provider
3. **Configure Environment**: Set up environment variables
4. **Test Integration**: Test in sandbox environment
5. **Deploy**: Deploy to production with monitoring

## Support & Maintenance

### Regular Tasks
- Monitor payment success rates
- Review failed transactions
- Update payment gateway SDKs
- Backup transaction data
- Review security logs

### Troubleshooting
- Check payment gateway status
- Verify webhook configurations
- Review error logs
- Test payment flows
- Contact payment provider support

## Conclusion

Your HMIS application is **excellently positioned** for payment API integration. The existing billing infrastructure provides a solid foundation, and the new payment system will significantly enhance the user experience and operational efficiency.

The implementation supports multiple payment methods, provides comprehensive transaction tracking, and maintains security best practices. This will make your hospital management system more competitive and user-friendly.

**Recommendation**: Start with M-Pesa integration for the Kenyan market, then add Stripe for international payments as your patient base grows. 