# Order Creation/Update and Payment Flow - Client Side

## Overview
This document describes the client-side handling of order creation, updates, and payment processing, including what information is saved at each stage.

## Flow Stages

### 1. Direct Purchase ("Buy Now") - Stock Reservation
**When**: User clicks "Buy Now" on a product page

**Information Collected**:
- Product ID
- Quantity (default: 1)
- User authentication status

**API Call**: `POST /api/v1/reservations` (or equivalent endpoint)
- Creates a temporary stock reservation (locks inventory for a specific duration, e.g., 15 minutes)

**Response Received**:
```typescript
{
  id: string
  productId: number
  quantity: number
  expiresAt: string
  status: 'pending'
}
```

**Saved Where**: 
- Local component state during transition or Redux store
- `reservationId` is passed to the checkout page

---

### 2. Cart to Checkout Transition
**When**: User clicks "Proceed to Checkout" from cart page

**Information Collected**:
- Cart items (product IDs, quantities, sizes, colors)
- Subtotal amount
- User authentication status

**Saved Where**: 
- Redux store (`cart` slice)
- Local component state during transition

**API Call**: None at this stage

---

### 3. Checkout Form - Shipping Information
**When**: User fills out shipping details on checkout page

**Information Collected**:
```typescript
{
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}
```

**Saved Where**:
- Form state (React Hook Form / local state)
- Not persisted until order creation

**Validation**: Client-side validation using schema (Zod/Yup)

---

### 4. Checkout Form - Payment Information
**When**: User enters payment details

**Information Collected**:
```typescript
{
  cardNumber: string (masked)
  cardHolderName: string
  expiryDate: string (MM/YY)
  cvv: string (not stored)
  billingAddress: {
    sameAsShipping: boolean
    // If different, same fields as shipping
  }
}
```

**Saved Where**:
- Temporary form state only
- **Never persisted to Redux or localStorage**
- CVV is never stored anywhere

**Security Notes**:
- Card details should be tokenized before sending to server
- Use payment gateway SDK (Stripe, PayPal, etc.) for secure handling
- Only payment token/reference is sent to backend

---

### 5. Order Creation (Pre-Payment)
**When**: User clicks "Place Order" or "Complete Purchase"

**API Endpoint**: `POST /api/orders`

**Request Payload**:
```typescript
{
  items: [
    {
      productId: number
      variantId: number
      quantity: number
      price: number
      size: string
      color: string
    }
  ],
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  },
  billingAddress: {
    // Same structure as shippingAddress
  },
  subtotal: number
  tax: number
  shippingCost: number
  total: number
}
```

**Response Received**:
```typescript
{
  orderId: string
  orderNumber: string
  status: 'pending' | 'awaiting_payment'
  total: number
  createdAt: string
  paymentIntent?: string // If using Stripe
}
```

**Saved Where**:
- Redux store (`order` slice)
- Response includes `orderId` needed for payment processing

---

### 6. Payment Processing
**When**: Immediately after order creation

**Information Sent to Payment Gateway**:
```typescript
{
  orderId: string
  amount: number
  currency: string
  paymentMethodToken: string // From tokenized card
  customerEmail: string
  metadata: {
    orderNumber: string
    customerId: number
  }
}
```

**Payment Gateway Response**:
```typescript
{
  paymentId: string
  status: 'succeeded' | 'failed' | 'requires_action'
  transactionId: string
  receiptUrl?: string
}
```

**Saved Where**:
- Redux store (`payment` slice)
- Payment status tracked for UI updates

---

### 7. Order Update (Post-Payment)
**When**: After successful payment confirmation

**API Endpoint**: `PATCH /api/orders/:orderId`

**Request Payload**:
```typescript
{
  paymentId: string
  transactionId: string
  paymentStatus: 'completed'
  paidAt: string
}
```

**Response Received**:
```typescript
{
  orderId: string
  orderNumber: string
  status: 'confirmed' | 'processing'
  paymentStatus: 'completed'
  total: number
  paidAt: string
  estimatedDelivery: string
}
```

**Saved Where**:
- Redux store (`order` slice) - updated
- Order confirmation details for display

---

### 8. Post-Purchase Actions
**When**: After successful order update

**Actions Performed**:
1. Clear cart from Redux store
2. Clear cart from localStorage
3. Navigate to order confirmation page
4. Display order summary with order number
5. Send confirmation email (backend handles this)

**Information Displayed**:
- Order number
- Order total
- Estimated delivery date
- Shipping address
- Order items summary
- Payment confirmation

---

## State Management

### Redux Store Structure

```typescript
// Order Slice
interface OrderState {
  currentOrder: {
    orderId: string | null
    orderNumber: string | null
    status: OrderStatus
    items: OrderItem[]
    shippingAddress: Address
    billingAddress: Address
    subtotal: number
    tax: number
    shippingCost: number
    total: number
    createdAt: string | null
    paidAt: string | null
  } | null
  orderHistory: Order[]
  loading: boolean
  error: string | null
}

// Payment Slice
interface PaymentState {
  paymentId: string | null
  transactionId: string | null
  status: PaymentStatus
  method: PaymentMethod | null
  loading: boolean
  error: string | null
}

// Cart Slice
interface CartState {
  items: CartItem[]
  subtotal: number
  itemCount: number
}
```

### LocalStorage Keys

```typescript
// Persisted data
'cart_items'          // Cart items array
'checkout_draft'      // Temporary shipping info (optional)
'last_order_id'       // For order tracking

// Cleared after successful order
'cart_items'          // Cleared
'checkout_draft'      // Cleared
```

---

## Error Handling

### Order Creation Failure
**When**: API returns error during order creation

**Client Actions**:
1. Display error message to user
2. Keep form data intact
3. Allow user to retry
4. Log error for debugging

**Saved Where**: Error state in Redux

### Payment Failure
**When**: Payment gateway returns failure

**Client Actions**:
1. Display payment error message
2. Keep order in 'pending' status
3. Allow user to retry payment
4. Option to use different payment method

**Saved Where**: 
- Order remains in Redux with 'pending' status
- Payment error in payment slice

### Order Update Failure
**When**: Order update API fails after successful payment

**Client Actions**:
1. Retry order update automatically (with exponential backoff)
2. If retry fails, show success message with note
3. Backend should handle reconciliation
4. User receives order confirmation email

**Saved Where**: 
- Payment success stored
- Order status may be stale but backend is source of truth

---

## Security Considerations

### Sensitive Data Handling

**Never Store Client-Side**:
- Full credit card numbers
- CVV codes
- Raw payment credentials

**Tokenization**:
- Use payment gateway SDK to tokenize card details
- Only send tokens to backend
- Backend handles actual payment processing

**HTTPS Only**:
- All API calls must use HTTPS
- Payment forms must be on HTTPS pages

### Data Validation

**Client-Side**:
- Validate all form inputs
- Check card number format (Luhn algorithm)
- Validate expiry date
- Validate email format
- Validate phone number format

**Server-Side**:
- Backend must re-validate all data
- Client validation is for UX only

---

## API Integration Points

### Order API
```typescript
// Create Order
POST /api/orders
Headers: { Authorization: 'Bearer <token>' }
Body: { items, shippingAddress, billingAddress, totals }
Response: { orderId, orderNumber, status }

// Update Order
PATCH /api/orders/:orderId
Headers: { Authorization: 'Bearer <token>' }
Body: { paymentId, transactionId, paymentStatus }
Response: { order details }

// Get Order
GET /api/orders/:orderId
Headers: { Authorization: 'Bearer <token>' }
Response: { order details }
```

### Payment API (via Gateway)
```typescript
// Create Payment Intent (Stripe example)
POST /api/payment/create-intent
Body: { orderId, amount }
Response: { clientSecret, paymentIntentId }

// Confirm Payment
POST /api/payment/confirm
Body: { paymentIntentId, paymentMethodId }
Response: { status, transactionId }
```

---

## Checkout Hook Implementation

### useCheckout Hook
Location: `client/hooks/useCheckout.ts`

**Responsibilities**:
1. Manage checkout form state
2. Handle order creation
3. Coordinate payment processing
4. Update order after payment
5. Handle errors and retries
6. Clear cart on success

**Key Methods**:
```typescript
{
  createOrder: (orderData) => Promise<Order>
  processPayment: (paymentData) => Promise<Payment>
  updateOrderWithPayment: (orderId, paymentId) => Promise<Order>
  handleCheckoutComplete: () => void
  isLoading: boolean
  error: string | null
}
```

---

## User Experience Flow

1. **Cart Review** → User reviews items and quantities
2. **Checkout Start** → User clicks "Proceed to Checkout"
3. **Shipping Info** → User fills shipping address
4. **Payment Info** → User enters payment details
5. **Review Order** → User reviews complete order
6. **Place Order** → Order created on backend (status: pending)
7. **Process Payment** → Payment processed via gateway
8. **Confirm Order** → Order updated (status: confirmed)
9. **Show Confirmation** → Display order confirmation page
10. **Clear Cart** → Cart cleared from state and storage

---

## Testing Considerations

### Test Scenarios

1. **Happy Path**: Complete order with successful payment
2. **Payment Failure**: Handle declined card
3. **Network Error**: Handle API timeout during order creation
4. **Partial Failure**: Payment succeeds but order update fails
5. **Duplicate Prevention**: Prevent double-submission
6. **Session Expiry**: Handle token expiration during checkout
7. **Cart Changes**: Handle inventory changes during checkout

### Mock Data

Use test payment credentials provided by payment gateway for development and testing.

---

## Future Enhancements

1. **Save Addresses**: Allow users to save shipping addresses
2. **Multiple Payment Methods**: Support PayPal, Apple Pay, Google Pay
3. **Order Draft**: Save incomplete orders for later
4. **Guest Checkout**: Allow checkout without account
5. **Promo Codes**: Apply discount codes
6. **Split Payment**: Pay with multiple methods
7. **Installments**: Support buy-now-pay-later options

---

## Related Documentation

- [Authentication Flow](../features/auth/README.md)
- [Cart Management](./CART_MANAGEMENT.md)
- [Payment Gateway Integration](./PAYMENT_INTEGRATION.md)
- [Order Status Tracking](./ORDER_TRACKING.md)
