# Payment State Management - Usage Examples

## Basic Usage

### 1. Simple Payment Flow

```typescript
import { usePaymentState } from '@/features/payment/hooks';

function CheckoutPage() {
  const {
    paymentStatus,
    isPaymentInProgress,
    startPaymentCreation,
    completePayment,
    failPayment,
  } = usePaymentState();

  const handlePayment = async () => {
    try {
      // Start payment
      startPaymentCreation('order-123', 10000);
      
      // Process payment
      await processPayment();
      
      // Complete
      completePayment();
    } catch (error) {
      failPayment(error.message);
    }
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={isPaymentInProgress}
    >
      {isPaymentInProgress ? 'Processing...' : 'Pay Now'}
    </button>
  );
}
```

### 2. Display Payment Status

```typescript
import { usePaymentState } from '@/features/payment/hooks';

function PaymentStatus() {
  const { paymentStatus, paymentError, currentPayment } = usePaymentState();

  return (
    <div>
      <p>Status: {paymentStatus}</p>
      {paymentError && <p className="error">{paymentError}</p>}
      {currentPayment.orderId && <p>Order: {currentPayment.orderId}</p>}
    </div>
  );
}
```

### 3. Payment History

```typescript
import { usePaymentState } from '@/features/payment/hooks';

function PaymentHistory() {
  const { paymentHistory } = usePaymentState();

  return (
    <div>
      <h2>Recent Payments</h2>
      {paymentHistory.map((payment, index) => (
        <div key={index}>
          <p>Order: {payment.orderId}</p>
          <p>Amount: ₹{payment.amount / 100}</p>
          <p>Status: {payment.status}</p>
          <p>Date: {new Date(payment.completedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

## Advanced Usage

### 4. Complete Razorpay Integration

```typescript
import { usePaymentState } from '@/features/payment/hooks';
import { useCreatePaymentMutation, useVerifyPaymentMutation } from '@/features/payment/paymentApi';

function RazorpayCheckout() {
  const {
    startPaymentCreation,
    setRazorpayOrderDetails,
    startPaymentProcessing,
    startPaymentVerification,
    completePayment,
    failPayment,
  } = usePaymentState();

  const [createPayment] = useCreatePaymentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const handleRazorpayPayment = async (orderId: string, amount: number) => {
    try {
      // 1. Start payment creation
      startPaymentCreation(orderId, amount);

      // 2. Create Razorpay order
      const response = await createPayment({
        orderId,
        amount,
        currency: 'INR',
      }).unwrap();

      // 3. Update with Razorpay details
      setRazorpayOrderDetails(
        response.data.razorpayOrderId,
        response.data.paymentId,
        response.data.currency
      );

      // 4. Load Razorpay SDK
      const isLoaded = await loadRazorpaySDK();
      if (!isLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // 5. Start processing
      startPaymentProcessing();

      // 6. Open Razorpay modal
      const rzp = new window.Razorpay({
        key: response.data.razorpayKeyId,
        amount: response.data.amount,
        currency: response.data.currency,
        order_id: response.data.razorpayOrderId,
        
        handler: async (razorpayResponse: any) => {
          // 7. Start verification
          startPaymentVerification(
            razorpayResponse.razorpay_payment_id,
            razorpayResponse.razorpay_order_id
          );

          try {
            // 8. Verify payment
            await verifyPayment({
              orderId,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            }).unwrap();

            // 9. Complete payment
            completePayment();
            
            // 10. Redirect to success page
            router.push(`/checkout/success?orderId=${orderId}`);
          } catch (error) {
            failPayment('Payment verification failed');
          }
        },

        modal: {
          ondismiss: () => {
            failPayment('Payment cancelled by user');
          },
        },
      });

      rzp.on('payment.failed', (response: any) => {
        failPayment(response.error.description);
      });

      rzp.open();
    } catch (error: any) {
      failPayment(error.message || 'Payment failed');
    }
  };

  return (
    <button onClick={() => handleRazorpayPayment('order-123', 10000)}>
      Pay with Razorpay
    </button>
  );
}
```

### 5. Payment Recovery

```typescript
import { useEffect } from 'react';
import { usePaymentState } from '@/features/payment/hooks';

function PaymentRecovery() {
  const {
    currentPayment,
    paymentStatus,
    resetPaymentState,
  } = usePaymentState();

  useEffect(() => {
    // Check for interrupted payment
    if (
      currentPayment.orderId &&
      (paymentStatus === 'creating' || 
       paymentStatus === 'processing' || 
       paymentStatus === 'verifying')
    ) {
      // Check if payment is recent (within 30 minutes)
      const createdAt = new Date(currentPayment.createdAt!);
      const now = new Date();
      const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

      if (diffMinutes > 30) {
        // Payment too old, reset
        resetPaymentState();
      } else {
        // Show recovery modal
        showRecoveryModal();
      }
    }
  }, []);

  const showRecoveryModal = () => {
    const shouldResume = confirm(
      `Found incomplete payment for order ${currentPayment.orderId}. Resume?`
    );

    if (shouldResume) {
      // Navigate to checkout with order ID
      router.push(`/checkout?orderId=${currentPayment.orderId}`);
    } else {
      // Reset payment state
      resetPaymentState();
    }
  };

  return null;
}
```

### 6. Error Handling

```typescript
import { usePaymentState } from '@/features/payment/hooks';
import { useEffect } from 'react';

function PaymentErrorHandler() {
  const { paymentError, clearError } = usePaymentState();

  useEffect(() => {
    if (paymentError) {
      // Show error notification
      toast.error(paymentError);

      // Clear error after 5 seconds
      const timer = setTimeout(() => {
        clearError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [paymentError]);

  return null;
}
```

### 7. Payment Status Indicator

```typescript
import { usePaymentState } from '@/features/payment/hooks';

function PaymentStatusBadge() {
  const { paymentStatus } = usePaymentState();

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'creating':
      case 'processing':
      case 'verifying':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'creating':
        return 'Creating Order';
      case 'processing':
        return 'Processing Payment';
      case 'verifying':
        return 'Verifying Payment';
      case 'completed':
        return 'Payment Completed';
      case 'failed':
        return 'Payment Failed';
      default:
        return 'Ready';
    }
  };

  return (
    <span className={`badge ${getStatusColor()}`}>
      {getStatusText()}
    </span>
  );
}
```

### 8. Prevent Duplicate Payments

```typescript
import { usePaymentState } from '@/features/payment/hooks';

function CheckoutButton() {
  const { isPaymentInProgress, paymentStatus } = usePaymentState();

  const handleClick = () => {
    if (isPaymentInProgress) {
      alert('Payment already in progress');
      return;
    }

    // Proceed with payment
    initiatePayment();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPaymentInProgress}
      className={isPaymentInProgress ? 'opacity-50 cursor-not-allowed' : ''}
    >
      {isPaymentInProgress ? (
        <>
          <Spinner />
          {paymentStatus === 'creating' && 'Creating Order...'}
          {paymentStatus === 'processing' && 'Processing Payment...'}
          {paymentStatus === 'verifying' && 'Verifying Payment...'}
        </>
      ) : (
        'Pay Now'
      )}
    </button>
  );
}
```

### 9. Payment Analytics

```typescript
import { usePaymentState } from '@/features/payment/hooks';
import { useEffect } from 'react';

function PaymentAnalytics() {
  const { paymentStatus, currentPayment } = usePaymentState();

  useEffect(() => {
    // Track payment status changes
    if (paymentStatus === 'creating') {
      analytics.track('Payment Started', {
        orderId: currentPayment.orderId,
        amount: currentPayment.amount,
      });
    }

    if (paymentStatus === 'completed') {
      analytics.track('Payment Completed', {
        orderId: currentPayment.orderId,
        amount: currentPayment.amount,
        duration: calculateDuration(),
      });
    }

    if (paymentStatus === 'failed') {
      analytics.track('Payment Failed', {
        orderId: currentPayment.orderId,
        error: currentPayment.error,
      });
    }
  }, [paymentStatus]);

  const calculateDuration = () => {
    if (!currentPayment.createdAt || !currentPayment.completedAt) {
      return 0;
    }
    const start = new Date(currentPayment.createdAt).getTime();
    const end = new Date(currentPayment.completedAt).getTime();
    return (end - start) / 1000; // seconds
  };

  return null;
}
```

### 10. Custom Payment Hook

```typescript
import { usePaymentState } from '@/features/payment/hooks';
import { useCreatePaymentMutation, useVerifyPaymentMutation } from '@/features/payment/paymentApi';

export function usePaymentFlow() {
  const paymentState = usePaymentState();
  const [createPayment] = useCreatePaymentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const processPayment = async (orderId: string, amount: number) => {
    try {
      paymentState.startPaymentCreation(orderId, amount);

      const response = await createPayment({
        orderId,
        amount,
        currency: 'INR',
      }).unwrap();

      paymentState.setRazorpayOrderDetails(
        response.data.razorpayOrderId,
        response.data.paymentId,
        response.data.currency
      );

      return response.data;
    } catch (error: any) {
      paymentState.failPayment(error.message);
      throw error;
    }
  };

  const verifyPaymentSignature = async (
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) => {
    try {
      paymentState.startPaymentVerification(razorpayPaymentId, razorpayOrderId);

      const response = await verifyPayment({
        orderId,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      }).unwrap();

      paymentState.completePayment();

      return response;
    } catch (error: any) {
      paymentState.failPayment(error.message);
      throw error;
    }
  };

  return {
    ...paymentState,
    processPayment,
    verifyPaymentSignature,
  };
}
```

## Testing Examples

### 11. Unit Test

```typescript
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { usePaymentState } from '@/features/payment/hooks';

describe('usePaymentState', () => {
  const wrapper = ({ children }: any) => (
    <Provider store={store}>{children}</Provider>
  );

  it('should start payment creation', () => {
    const { result } = renderHook(() => usePaymentState(), { wrapper });

    act(() => {
      result.current.startPaymentCreation('order-123', 10000);
    });

    expect(result.current.paymentStatus).toBe('creating');
    expect(result.current.currentPayment.orderId).toBe('order-123');
    expect(result.current.currentPayment.amount).toBe(10000);
  });

  it('should complete payment', () => {
    const { result } = renderHook(() => usePaymentState(), { wrapper });

    act(() => {
      result.current.startPaymentCreation('order-123', 10000);
      result.current.completePayment();
    });

    expect(result.current.paymentStatus).toBe('completed');
    expect(result.current.paymentHistory).toHaveLength(1);
  });

  it('should handle payment failure', () => {
    const { result } = renderHook(() => usePaymentState(), { wrapper });

    act(() => {
      result.current.startPaymentCreation('order-123', 10000);
      result.current.failPayment('Payment failed');
    });

    expect(result.current.paymentStatus).toBe('failed');
    expect(result.current.paymentError).toBe('Payment failed');
  });
});
```

### 12. Integration Test

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import CheckoutPage from '@/app/checkout/page';

describe('Checkout Payment Flow', () => {
  it('should process payment successfully', async () => {
    render(
      <Provider store={store}>
        <CheckoutPage />
      </Provider>
    );

    // Click pay button
    fireEvent.click(screen.getByText('Pay Now'));

    // Check creating status
    await waitFor(() => {
      expect(screen.getByText('Creating Order...')).toBeInTheDocument();
    });

    // Check processing status
    await waitFor(() => {
      expect(screen.getByText('Processing Payment...')).toBeInTheDocument();
    });

    // Check completed status
    await waitFor(() => {
      expect(screen.getByText('Payment Completed')).toBeInTheDocument();
    });
  });
});
```

## Common Patterns

### 13. Loading States

```typescript
const { isPaymentInProgress, paymentStatus } = usePaymentState();

if (isPaymentInProgress) {
  return <LoadingSpinner message={`${paymentStatus}...`} />;
}
```

### 14. Conditional Rendering

```typescript
const { paymentStatus } = usePaymentState();

return (
  <>
    {paymentStatus === 'idle' && <PaymentForm />}
    {paymentStatus === 'processing' && <PaymentProcessing />}
    {paymentStatus === 'completed' && <PaymentSuccess />}
    {paymentStatus === 'failed' && <PaymentError />}
  </>
);
```

### 15. Reset on Unmount

```typescript
const { resetPaymentState } = usePaymentState();

useEffect(() => {
  return () => {
    resetPaymentState();
  };
}, []);
```
