# Frontend Payment Implementation Guide

## Quick Start - 3 Steps to Complete Payment Flow

### Step 1: Add Razorpay Script to Layout

**File**: `client/app/layout.tsx`

Add this import at the top:
```typescript
import Script from "next/script";
```

Add this script tag before the closing `</body>` tag:
```tsx
<Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="lazyOnload"
/>
```

---

### Step 2: Update useCheckout Hook

**File**: `client/hooks/useCheckout.ts`

Add these imports:
```typescript
import { useInitiateOrderMutation } from "@/features/order/orderApi";
import {
  useCreatePaymentMutation,
  useVerifyPaymentMutation,
} from "@/features/payment/paymentApi";
```

Add these mutations after the form initialization:
```typescript
const [initiateOrder] = useInitiateOrderMutation();
const [createPayment] = useCreatePaymentMutation();
const [verifyPayment] = useVerifyPaymentMutation();
```

Replace the `handlePaymentSubmit` function with:
```typescript
const handlePaymentSubmit = async (paymentData: any) => {
  setIsProcessing(true);

  try {
    // Final stock validation before payment
    const stockValid = await validateStock();
    if (!stockValid) {
      setCurrentStep("address");
      setIsProcessing(false);
      return;
    }

    const addressData = form.getValues();

    // Step 1: Create order
    console.log("Creating order...");
    const orderResult = await initiateOrder({
      reservationId: reservationId!,
      customerEmail: addressData.email,
      customerPhone: addressData.phone,
      shippingAddress: {
        fullName: `${addressData.firstName} ${addressData.lastName}`,
        phone: addressData.phone,
        line1: addressData.address,
        line2: "",
        landmark: "",
        city: addressData.city,
        state: addressData.stateRegion,
        postalCode: addressData.postalCode,
        country: addressData.country,
        isDefault: false,
      },
      sameAsShipping: true,
    }).unwrap();

    const orderId = orderResult.data.id;
    console.log("Order created:", orderId);

    // Step 2: Create payment
    console.log("Creating payment...");
    const paymentResult = await createPayment({
      orderId,
      amount: total,
      currency: "INR",
    }).unwrap();

    console.log("Payment created:", paymentResult.data);

    // Step 3: Open Razorpay checkout
    const options = {
      key: paymentResult.data.razorpayKeyId,
      amount: paymentResult.data.amount * 100, // Convert to paise
      currency: paymentResult.data.currency,
      order_id: paymentResult.data.razorpayOrderId,
      name: "Your Store Name",
      description: "Order Payment",
      image: "/placeholder-logo.png", // Your logo
      handler: async function (response: any) {
        console.log("Payment successful, verifying...");
        
        // Step 4: Verify payment
        try {
          const verifyResult = await verifyPayment({
            orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }).unwrap();

          console.log("Payment verified:", verifyResult.data);

          // Step 5: Navigate to success page
          router.push(
            `/checkout/success?orderNumber=${verifyResult.data.orderNumber}`
          );
        } catch (error: any) {
          console.error("Payment verification failed:", error);
          alert(
            error?.data?.message ||
              "Payment verification failed. Please contact support with your order ID."
          );
        }
      },
      modal: {
        ondismiss: function () {
          console.log("Payment modal closed by user");
          setIsProcessing(false);
        },
      },
      theme: {
        color: "#000000",
      },
      prefill: {
        name: `${addressData.firstName} ${addressData.lastName}`,
        email: addressData.email,
        contact: addressData.phone,
      },
    };

    const rzp = new (window as any).Razorpay(options);
    
    rzp.on("payment.failed", function (response: any) {
      console.error("Payment failed:", response.error);
      alert(`Payment failed: ${response.error.description}`);
      setIsProcessing(false);
    });

    rzp.open();
  } catch (error: any) {
    console.error("Error during payment process:", error);
    alert(
      error?.data?.message ||
        "Failed to process payment. Please try again."
    );
    setIsProcessing(false);
  }
};
```

---

### Step 3: Create Success Page

**File**: `client/app/checkout/success/page.tsx`

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="text-center max-w-md px-4">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. We've received your order and will
              process it shortly.
            </p>
          </div>

          {/* Order Number */}
          <div className="bg-secondary p-6 rounded-xl mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              Order Number
            </p>
            <p className="text-2xl font-bold">{orderNumber}</p>
            <p className="text-xs text-muted-foreground mt-2">
              A confirmation email has been sent to your email address
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/orders" className="block">
              <Button className="w-full" size="lg">
                View Order Details
              </Button>
            </Link>
            <Link href="/products" className="block">
              <Button variant="outline" className="w-full" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>What's next?</strong>
              <br />
              We'll send you shipping updates via email and SMS.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

---

## Environment Variables

Make sure you have Razorpay credentials in your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

---

## Testing

### Test Mode Credentials
Use these Razorpay test credentials:

**Test Cards:**
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

**Test UPI:**
- Success: `success@razorpay`
- Failure: `failure@razorpay`

### Test Flow:
1. Go to product page
2. Click "Buy Now"
3. Fill checkout form
4. Click "Complete Order"
5. Use test card in Razorpay modal
6. Verify success page shows
7. Check order in database

---

## Troubleshooting

### Razorpay script not loading
- Check browser console for errors
- Verify script tag is in layout.tsx
- Try hard refresh (Ctrl+Shift+R)

### Payment modal not opening
- Check if `window.Razorpay` is defined
- Verify Razorpay script loaded successfully
- Check console for JavaScript errors

### Payment verification fails
- Check backend logs for signature verification
- Verify Razorpay secret key is correct
- Check network tab for API errors

### Order not created
- Check if reservation is still valid (not expired)
- Verify order API endpoint is working
- Check backend logs for errors

---

## Console Logs to Watch

During payment flow, you should see:
```
Creating order...
Order created: {orderId}
Creating payment...
Payment created: {paymentData}
Payment successful, verifying...
Payment verified: {verifyData}
```

If you see errors, check:
1. Network tab for failed API calls
2. Backend logs for server errors
3. Razorpay dashboard for payment status

---

## Next Steps After Implementation

1. ✅ Test with Razorpay test mode
2. ✅ Verify stock conversion works
3. ✅ Test payment failure scenarios
4. ⏳ Add order history page
5. ⏳ Add email notifications
6. ⏳ Switch to production Razorpay keys
7. ⏳ Add webhook handling

---

## Production Checklist

Before going live:
- [ ] Replace test keys with production keys
- [ ] Test with real payment methods
- [ ] Set up Razorpay webhooks
- [ ] Add proper error tracking (Sentry)
- [ ] Test on mobile devices
- [ ] Verify HTTPS is enabled
- [ ] Add payment receipt generation
- [ ] Set up refund process

---

## Support

If you need help:
1. Check Razorpay dashboard for payment status
2. Check backend logs: `docker-compose logs -f server`
3. Check browser console for frontend errors
4. Verify environment variables are set
5. Test with Razorpay test credentials first

---

## Summary

You need to:
1. ✅ Add Razorpay script to layout
2. ✅ Update `useCheckout.ts` with payment logic
3. ✅ Create success page

That's it! Your payment flow will be complete. 🎉
