# Payment State Management

This module provides Redux-based state management for payment processing with persistence support.

## Features

- **Centralized Payment State**: All payment-related state is managed in Redux
- **Persistence**: Payment state is persisted to localStorage for recovery
- **Payment Flow Tracking**: Track payment through all stages (creating → processing → verifying → completed/failed)
- **Error Handling**: Comprehensive error tracking and recovery
- **Payment History**: Keep track of recent payment attempts
- **Interrupted Payment Recovery**: Detect and recover from interrupted payments

## Architecture

### Payment Slice (`paymentSlice.ts`)

The payment slice manages the following state:

```typescript
interface PaymentState {
  currentPayment: {
    orderId: string | null;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
    paymentId: string | null;
    amount: number | null;
    currency: string | null;
    status: 'idle' | 'creating' | 'processing' | 'verifying' | 'completed' | 'failed';
    error: string | null;
    createdAt: string | null;
    completedAt: string | null;
  };
  paymentHistory: Array<{
    orderId: string;
    razorpayOrderId: string;
    status: PaymentStatus;
    amount: number;
    completedAt: string;
  }>;
}
```

### Payment Status Flow

```
idle → creating → processing → verifying → completed
                                         ↘ failed
```

1. **idle**: No payment in progress
2. **creating**: Order is being created in the database
3. **processing**: Razorpay order created, payment modal opened
4. **verifying**: Payment completed, verifying signature
5. **completed**: Payment verified successfully
6. **failed**: Payment failed at any stage

### Actions

- `setPaymentCreating`: Start payment creation (when order is initiated)
- `setRazorpayOrder`: Set Razorpay order details
- `setPaymentProcessing`: Mark payment as processing (modal opened)
- `setPaymentVerifying`: Start payment verification
- `setPaymentCompleted`: Mark payment as completed
- `setPaymentFailed`: Mark payment as failed with error message
- `resetPayment`: Reset payment state
- `clearPaymentError`: Clear payment error
- `recoverPayment`: Recover interrupted payment

### Selectors

- `selectCurrentPayment`: Get current payment details
- `selectPaymentStatus`: Get current payment status
- `selectPaymentError`: Get payment error message
- `selectPaymentHistory`: Get payment history
- `selectIsPaymentInProgress`: Check if payment is in progress

## Usage

### Using the Payment Hook

```typescript
import { usePaymentState } from '@/features/payment/hooks';

function CheckoutComponent() {
  const {
    // State
    currentPayment,
    paymentStatus,
    paymentError,
    isPaymentInProgress,
    paymentHistory,
    
    // Actions
    startPaymentCreation,
    setRazorpayOrderDetails,
    startPaymentProcessing,
    startPaymentVerification,
    completePayment,
    failPayment,
    resetPaymentState,
    clearError,
  } = usePaymentState();

  // Use the state and actions...
}
```

### Payment Flow Example

```typescript
// 1. Create order
const orderResponse = await initiateOrder(payload).unwrap();
startPaymentCreation(orderResponse.data.id, orderResponse.data.totalAmount);

// 2. Create Razorpay order
const paymentResponse = await createPayment({
  amount: orderResponse.data.totalAmount,
  currency: "INR",
  orderId: orderResponse.data.id,
});
setRazorpayOrderDetails(
  paymentResponse.data.razorpayOrderId,
  paymentResponse.data.paymentId,
  paymentResponse.data.currency
);

// 3. Open Razorpay modal
startPaymentProcessing();
rzp.open();

// 4. On payment success
startPaymentVerification(razorpayPaymentId, razorpayOrderId);
await verifyPayment({ ... });
completePayment();

// 5. On payment failure
failPayment("Payment failed: " + error.message);
```

## Persistence

Payment state is automatically persisted to localStorage using `redux-persist`. This allows:

- **Recovery from page refresh**: If user refreshes during payment, state is preserved
- **Interrupted payment detection**: Detect if user closed browser during payment
- **Payment history**: Keep track of recent payment attempts

### Persisted Fields

- `currentPayment`: Current payment in progress
- `paymentHistory`: Last 10 payment attempts

### Storage Key

Payment state is stored in localStorage under the key: `persist:payment`

## Error Handling

The payment slice provides comprehensive error handling:

```typescript
// Set error
failPayment("Payment verification failed");

// Clear error
clearError();

// Check for error
if (paymentError) {
  console.error("Payment error:", paymentError);
}
```

## Payment Recovery

Detect interrupted payments on component mount:

```typescript
useEffect(() => {
  if (
    currentPayment.orderId &&
    (paymentStatus === 'creating' || 
     paymentStatus === 'processing' || 
     paymentStatus === 'verifying')
  ) {
    // Show recovery UI or automatically retry
    console.log('Interrupted payment detected:', currentPayment);
  }
}, []);
```

## Payment History

The slice maintains a history of the last 10 payment attempts:

```typescript
const { paymentHistory } = usePaymentState();

paymentHistory.forEach(payment => {
  console.log(`Order ${payment.orderId}: ${payment.status}`);
});
```

## Best Practices

1. **Always update state at each step**: This ensures accurate tracking and recovery
2. **Clear errors when appropriate**: Clear errors when user navigates or retries
3. **Reset state after completion**: Call `resetPaymentState()` after successful payment
4. **Handle all failure cases**: Update state with `failPayment()` for all error scenarios
5. **Use selectors**: Use provided selectors instead of accessing state directly
6. **Check payment status**: Use `isPaymentInProgress` to prevent duplicate payments

## Integration with RTK Query

The payment slice works alongside RTK Query APIs:

```typescript
// RTK Query for API calls
const [createPayment] = useCreatePaymentMutation();
const [verifyPayment] = useVerifyPaymentMutation();

// Redux slice for state management
const { startPaymentCreation, completePayment } = usePaymentState();

// Combine both
const response = await createPayment(data);
startPaymentCreation(orderId, amount);
```

## Testing

When testing components that use payment state:

```typescript
import { renderWithProviders } from '@/test-utils';
import { store } from '@/store';
import { setPaymentCreating } from '@/features/payment/paymentSlice';

test('handles payment creation', () => {
  store.dispatch(setPaymentCreating({ orderId: '123', amount: 1000 }));
  
  const { getByText } = renderWithProviders(<CheckoutPage />);
  expect(getByText('Processing payment...')).toBeInTheDocument();
});
```

## Migration from Local State

Before (local state):
```typescript
const [isProcessing, setIsProcessing] = useState(false);
```

After (Redux with persistence):
```typescript
const { isPaymentInProgress } = usePaymentState();
```

Benefits:
- State persists across page refreshes
- Centralized state management
- Better error tracking
- Payment recovery support
- Payment history tracking
