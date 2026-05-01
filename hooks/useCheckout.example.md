# useCheckout Hook - Usage Example

## Overview
The `useCheckout` hook manages a two-step checkout process:
1. **Address Step**: Collect shipping/billing information
2. **Payment Step**: Process payment and create order

The hook uses React Hook Form with Zod validation for robust form handling.

## Installation

Required packages (already installed):
```bash
npm install react-hook-form @hookform/resolvers zod
```

## Basic Usage

```tsx
"use client";

import { useCheckout } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const {
    form,
    handleAddressSubmit,
    handlePaymentSubmit,
    currentStep,
    cart,
    cartTotal,
    total,
    stockErrors,
    isProcessing,
    goBackToAddress,
  } = useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="checkout-container">
      {/* Step Indicator */}
      <div className="steps">
        <div className={currentStep === "address" ? "active" : ""}>
          1. Address
        </div>
        <div className={currentStep === "payment" ? "active" : ""}>
          2. Payment
        </div>
      </div>

      {/* Stock Errors */}
      {stockErrors.length > 0 && (
        <div className="error-messages">
          {stockErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      {/* Address Step */}
      {currentStep === "address" && (
        <form onSubmit={handleSubmit(handleAddressSubmit)}>
          <h2>Shipping Information</h2>

          <div className="form-group">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              disabled={isProcessing}
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              disabled={isProcessing}
            />
            {errors.phone && (
              <span className="error">{errors.phone.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                disabled={isProcessing}
              />
              {errors.firstName && (
                <span className="error">{errors.firstName.message}</span>
              )}
            </div>

            <div className="form-group">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                disabled={isProcessing}
              />
              {errors.lastName && (
                <span className="error">{errors.lastName.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register("address")}
              disabled={isProcessing}
            />
            {errors.address && (
              <span className="error">{errors.address.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register("city")}
                disabled={isProcessing}
              />
              {errors.city && (
                <span className="error">{errors.city.message}</span>
              )}
            </div>

            <div className="form-group">
              <Label htmlFor="stateRegion">State/Region</Label>
              <Input
                id="stateRegion"
                {...register("stateRegion")}
                disabled={isProcessing}
              />
              {errors.stateRegion && (
                <span className="error">{errors.stateRegion.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                {...register("postalCode")}
                disabled={isProcessing}
              />
              {errors.postalCode && (
                <span className="error">{errors.postalCode.message}</span>
              )}
            </div>

            <div className="form-group">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register("country")}
                disabled={isProcessing}
              />
              {errors.country && (
                <span className="error">{errors.country.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                {...register("agreeToTerms")}
                disabled={isProcessing}
              />
              I agree to the terms and conditions
            </label>
            {errors.agreeToTerms && (
              <span className="error">{errors.agreeToTerms.message}</span>
            )}
          </div>

          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? "Validating..." : "Continue to Payment"}
          </Button>
        </form>
      )}

      {/* Payment Step */}
      {currentStep === "payment" && (
        <div className="payment-step">
          <h2>Payment Information</h2>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <p>Subtotal: ${cartTotal.toFixed(2)}</p>
            <p>Total: ${total.toFixed(2)}</p>
          </div>

          {/* Payment form would go here */}
          <PaymentForm
            onSubmit={handlePaymentSubmit}
            isProcessing={isProcessing}
          />

          <Button
            variant="outline"
            onClick={goBackToAddress}
            disabled={isProcessing}
          >
            Back to Address
          </Button>
        </div>
      )}

      {/* Cart Summary Sidebar */}
      <aside className="cart-summary">
        <h3>Your Order</h3>
        {cart.map((item) => (
          <div key={item.productId} className="cart-item">
            <img src={item.product.image} alt={item.product.name} />
            <div>
              <p>{item.product.name}</p>
              <p>
                {item.quantity} x ${item.product.price}
              </p>
              <p>
                Size: {item.selectedSize}, Color: {item.selectedColor}
              </p>
            </div>
          </div>
        ))}
        <div className="totals">
          <p>Subtotal: ${cartTotal.toFixed(2)}</p>
          <p className="total">Total: ${total.toFixed(2)}</p>
        </div>
      </aside>
    </div>
  );
}
```

## Hook Return Values

### Form Management
- **`form`**: React Hook Form instance with all methods
  - `register`: Register input fields
  - `handleSubmit`: Form submission handler
  - `formState`: Form state including errors
  - `getValues`: Get current form values
  - `setValue`: Set form values programmatically
  - `reset`: Reset form to default values

### Handlers
- **`handleAddressSubmit(data)`**: Submit address form and move to payment step
- **`handlePaymentSubmit(paymentData)`**: Process payment and create order

### State
- **`cart`**: Array of cart items
- **`currentStep`**: Current checkout step ("address" | "payment")
- **`stockErrors`**: Array of stock validation error messages
- **`isProcessing`**: Boolean indicating if a request is in progress

### Calculations
- **`cartTotal`**: Sum of all cart items (price × quantity)
- **`total`**: Final total (currently same as cartTotal, no shipping)

### Flags
- **`isBuyNow`**: Boolean indicating if this is a "Buy Now" checkout

### Actions
- **`validateStock()`**: Manually trigger stock validation
- **`goBackToAddress()`**: Return to address step from payment
- **`setCurrentStep(step)`**: Manually change checkout step

## Form Validation Schema

The form uses Zod schema defined in `schemas/checkout.schema.ts`:

```typescript
{
  email: string (valid email format)
  phone: string (min 10 digits, numeric only)
  firstName: string (required)
  lastName: string (required)
  country: string (required)
  stateRegion: string (required)
  address: string (min 5 characters)
  city: string (required)
  postalCode: string (min 4 characters)
  agreeToTerms: boolean (must be true)
}
```

## Validation Modes

The form validates on blur (`mode: "onBlur"`), providing immediate feedback when users leave a field.

## Stock Validation

Stock validation occurs:
1. Before moving from address to payment step
2. Before final payment processing

If stock validation fails:
- Error messages are displayed in `stockErrors`
- User cannot proceed to next step
- User is redirected back to address step if payment fails

## Payment Integration

The `handlePaymentSubmit` function should receive payment data from your payment component:

```typescript
const paymentData = {
  paymentMethodToken: "tok_xxx", // From Stripe/PayPal
  cardLast4: "4242",
  cardBrand: "visa",
};

handlePaymentSubmit(paymentData);
```

## Order Creation Flow

1. User fills address form → validates → moves to payment
2. User enters payment details
3. `handlePaymentSubmit` is called:
   - Validates stock one final time
   - Creates order with address and cart data
   - Processes payment
   - Updates order with payment info
   - Clears cart
   - Redirects to success page

## Error Handling

```tsx
const { stockErrors, isProcessing } = useCheckout();

// Display stock errors
{stockErrors.length > 0 && (
  <div className="alert alert-error">
    {stockErrors.map((error, i) => (
      <p key={i}>{error}</p>
    ))}
  </div>
)}

// Disable buttons during processing
<Button disabled={isProcessing}>
  {isProcessing ? "Processing..." : "Continue"}
</Button>
```

## Buy Now vs Cart Checkout

The hook automatically detects "Buy Now" mode from URL parameters:

```
/checkout?buyNow=true&product={"productId":"123",...}
```

In Buy Now mode:
- Cart is populated from URL parameter
- Regular cart is not loaded
- Cart is not cleared from localStorage (since it wasn't used)

## TypeScript Types

```typescript
import { CheckoutStep } from "@/app/checkout/types";
import { CheckoutFormData } from "@/schemas/checkout.schema";

// CheckoutStep = "address" | "payment"
// CheckoutFormData = inferred from Zod schema
```

## Related Files

- `client/hooks/useCheckout.ts` - Main hook implementation
- `client/schemas/checkout.schema.ts` - Zod validation schema
- `client/app/checkout/types.ts` - TypeScript types
- `client/docs/ORDER_AND_PAYMENT_FLOW.md` - Complete flow documentation
