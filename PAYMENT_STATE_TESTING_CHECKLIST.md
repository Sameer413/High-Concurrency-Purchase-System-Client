# Payment State Management - Testing Checklist

## Pre-Testing Setup

- [ ] Ensure development server is running: `npm run dev`
- [ ] Open browser DevTools (F12)
- [ ] Open Redux DevTools extension
- [ ] Open Application tab → Local Storage
- [ ] Clear existing payment state: `localStorage.removeItem('persist:payment')`

## 1. Basic Payment Flow

### Test: Complete Payment Successfully
- [ ] Navigate to checkout page
- [ ] Fill in address details
- [ ] Click "Pay Now"
- [ ] **Verify**: Payment status changes to "creating"
- [ ] **Verify**: Redux state shows `status: 'creating'`
- [ ] **Verify**: localStorage has `persist:payment` entry
- [ ] Wait for Razorpay modal to open
- [ ] **Verify**: Payment status changes to "processing"
- [ ] Complete payment in Razorpay modal
- [ ] **Verify**: Payment status changes to "verifying"
- [ ] Wait for verification
- [ ] **Verify**: Payment status changes to "completed"
- [ ] **Verify**: Redirected to success page
- [ ] **Verify**: Payment added to history in Redux state

### Test: Payment Failure
- [ ] Navigate to checkout page
- [ ] Click "Pay Now"
- [ ] Close Razorpay modal without paying
- [ ] **Verify**: Payment status changes to "failed"
- [ ] **Verify**: Error message is displayed
- [ ] **Verify**: Payment added to history with "failed" status
- [ ] **Verify**: Can retry payment

## 2. State Persistence

### Test: Page Refresh During Payment
- [ ] Start payment flow
- [ ] Wait for status to be "processing"
- [ ] Refresh the page (F5)
- [ ] **Verify**: Payment state is restored
- [ ] **Verify**: Status is still "processing"
- [ ] **Verify**: Order ID is preserved
- [ ] **Verify**: Amount is preserved

### Test: Browser Close and Reopen
- [ ] Start payment flow
- [ ] Wait for status to be "processing"
- [ ] Close browser tab
- [ ] Reopen application
- [ ] **Verify**: Payment recovery modal appears
- [ ] **Verify**: Payment details are shown
- [ ] **Verify**: Can resume or start fresh

### Test: localStorage Persistence
- [ ] Start payment flow
- [ ] Open DevTools → Application → Local Storage
- [ ] **Verify**: `persist:payment` key exists
- [ ] **Verify**: Contains `currentPayment` object
- [ ] **Verify**: Contains `paymentHistory` array
- [ ] Complete payment
- [ ] **Verify**: localStorage is updated
- [ ] **Verify**: Payment added to history

## 3. Payment Recovery

### Test: Recent Interrupted Payment
- [ ] Start payment flow
- [ ] Wait for status to be "processing"
- [ ] Close browser
- [ ] Reopen within 30 minutes
- [ ] **Verify**: Recovery modal appears
- [ ] **Verify**: Shows correct order ID
- [ ] **Verify**: Shows correct amount
- [ ] **Verify**: Shows correct status
- [ ] Click "Resume Payment"
- [ ] **Verify**: Navigates to checkout with order ID
- [ ] **Verify**: Can continue payment

### Test: Old Interrupted Payment
- [ ] Manually set payment createdAt to >30 minutes ago in localStorage
- [ ] Refresh page
- [ ] **Verify**: No recovery modal appears
- [ ] **Verify**: Payment state is auto-reset
- [ ] **Verify**: Status is "idle"

### Test: Discard Interrupted Payment
- [ ] Start payment flow
- [ ] Close browser
- [ ] Reopen application
- [ ] **Verify**: Recovery modal appears
- [ ] Click "Start Fresh"
- [ ] **Verify**: Payment state is reset
- [ ] **Verify**: Status is "idle"
- [ ] **Verify**: Can start new payment

## 4. Error Handling

### Test: Network Error During Order Creation
- [ ] Disconnect network
- [ ] Click "Pay Now"
- [ ] **Verify**: Error is caught
- [ ] **Verify**: Status changes to "failed"
- [ ] **Verify**: Error message is displayed
- [ ] Reconnect network
- [ ] **Verify**: Can retry payment

### Test: Razorpay SDK Load Failure
- [ ] Block Razorpay script in DevTools
- [ ] Click "Pay Now"
- [ ] **Verify**: Error message shown
- [ ] **Verify**: Status changes to "failed"
- [ ] **Verify**: Error stored in state

### Test: Payment Verification Failure
- [ ] Complete payment in Razorpay
- [ ] Simulate verification API failure
- [ ] **Verify**: Status changes to "failed"
- [ ] **Verify**: Error message shown
- [ ] **Verify**: User can contact support

## 5. UI Components

### Test: PaymentStatusIndicator
- [ ] Add `<PaymentStatusIndicator />` to checkout page
- [ ] Start payment flow
- [ ] **Verify**: Shows "Creating order..." with spinner
- [ ] **Verify**: Shows "Processing payment..." with spinner
- [ ] **Verify**: Shows "Verifying payment..." with spinner
- [ ] **Verify**: Shows "Payment completed" with checkmark
- [ ] **Verify**: Color changes based on status
- [ ] **Verify**: Shows order ID and Razorpay order ID

### Test: PaymentStatusIndicator with History
- [ ] Add `<PaymentStatusIndicator showHistory={true} />`
- [ ] Complete multiple payments
- [ ] **Verify**: Shows payment history
- [ ] **Verify**: Shows last 10 payments
- [ ] **Verify**: Shows amount, status, and date
- [ ] **Verify**: Shows correct icons for each status

### Test: PaymentRecoveryModal
- [ ] Add `<PaymentRecoveryModal />` to layout
- [ ] Start payment and close browser
- [ ] Reopen application
- [ ] **Verify**: Modal appears automatically
- [ ] **Verify**: Shows payment details
- [ ] **Verify**: Shows order ID, amount, status
- [ ] **Verify**: Shows created timestamp
- [ ] **Verify**: Has "Resume" and "Start Fresh" buttons
- [ ] **Verify**: Modal styling is correct

## 6. Redux Integration

### Test: Redux DevTools
- [ ] Open Redux DevTools
- [ ] Start payment flow
- [ ] **Verify**: Can see `payment/setPaymentCreating` action
- [ ] **Verify**: Can see `payment/setRazorpayOrder` action
- [ ] **Verify**: Can see `payment/setPaymentProcessing` action
- [ ] **Verify**: Can see `payment/setPaymentVerifying` action
- [ ] **Verify**: Can see `payment/setPaymentCompleted` action
- [ ] **Verify**: Can inspect state at each step
- [ ] **Verify**: Can time-travel through states

### Test: State Selectors
- [ ] Use `selectCurrentPayment` selector
- [ ] **Verify**: Returns current payment object
- [ ] Use `selectPaymentStatus` selector
- [ ] **Verify**: Returns current status
- [ ] Use `selectIsPaymentInProgress` selector
- [ ] **Verify**: Returns true when payment in progress
- [ ] Use `selectPaymentHistory` selector
- [ ] **Verify**: Returns payment history array

## 7. Hook Integration

### Test: usePaymentState Hook
- [ ] Use hook in component
- [ ] **Verify**: Returns all state values
- [ ] **Verify**: Returns all action functions
- [ ] Call `startPaymentCreation()`
- [ ] **Verify**: State updates correctly
- [ ] Call `completePayment()`
- [ ] **Verify**: State updates correctly
- [ ] Call `failPayment()`
- [ ] **Verify**: State updates correctly
- [ ] Call `resetPaymentState()`
- [ ] **Verify**: State resets to initial

### Test: useCheckout Hook Integration
- [ ] Use `useCheckout` hook
- [ ] **Verify**: `isProcessing` uses `isPaymentInProgress`
- [ ] **Verify**: Payment state is updated at each step
- [ ] **Verify**: Errors are handled correctly
- [ ] **Verify**: Success flow works correctly

## 8. Edge Cases

### Test: Multiple Rapid Clicks
- [ ] Click "Pay Now" multiple times rapidly
- [ ] **Verify**: Only one payment is created
- [ ] **Verify**: Button is disabled during processing
- [ ] **Verify**: No duplicate orders

### Test: Browser Back Button
- [ ] Start payment flow
- [ ] Click browser back button
- [ ] **Verify**: Payment state is preserved
- [ ] **Verify**: Can navigate back to checkout
- [ ] **Verify**: Can resume payment

### Test: Multiple Tabs
- [ ] Open checkout in two tabs
- [ ] Start payment in tab 1
- [ ] Switch to tab 2
- [ ] **Verify**: State is synced (may need refresh)
- [ ] Complete payment in tab 1
- [ ] **Verify**: Tab 2 can see updated state

### Test: localStorage Full
- [ ] Fill localStorage to capacity
- [ ] Try to save payment state
- [ ] **Verify**: Error is handled gracefully
- [ ] **Verify**: Payment can still proceed

### Test: Invalid State in localStorage
- [ ] Manually corrupt `persist:payment` in localStorage
- [ ] Refresh page
- [ ] **Verify**: App doesn't crash
- [ ] **Verify**: State is reset to initial
- [ ] **Verify**: Can start new payment

## 9. Performance

### Test: State Update Performance
- [ ] Open Performance tab in DevTools
- [ ] Start recording
- [ ] Complete payment flow
- [ ] Stop recording
- [ ] **Verify**: No significant performance issues
- [ ] **Verify**: State updates are fast (<100ms)
- [ ] **Verify**: No memory leaks

### Test: localStorage Write Performance
- [ ] Monitor localStorage writes
- [ ] Complete payment flow
- [ ] **Verify**: Writes are debounced
- [ ] **Verify**: No excessive writes
- [ ] **Verify**: Writes complete quickly

## 10. Accessibility

### Test: Keyboard Navigation
- [ ] Navigate using Tab key
- [ ] **Verify**: Can reach all interactive elements
- [ ] **Verify**: Focus indicators are visible
- [ ] **Verify**: Can trigger actions with Enter/Space

### Test: Screen Reader
- [ ] Enable screen reader
- [ ] Navigate through payment flow
- [ ] **Verify**: Status changes are announced
- [ ] **Verify**: Error messages are announced
- [ ] **Verify**: Button states are announced

## 11. Cross-Browser Testing

### Test: Chrome
- [ ] Complete payment flow
- [ ] **Verify**: All features work
- [ ] **Verify**: State persists
- [ ] **Verify**: Recovery works

### Test: Firefox
- [ ] Complete payment flow
- [ ] **Verify**: All features work
- [ ] **Verify**: State persists
- [ ] **Verify**: Recovery works

### Test: Safari
- [ ] Complete payment flow
- [ ] **Verify**: All features work
- [ ] **Verify**: State persists
- [ ] **Verify**: Recovery works

### Test: Edge
- [ ] Complete payment flow
- [ ] **Verify**: All features work
- [ ] **Verify**: State persists
- [ ] **Verify**: Recovery works

## 12. Mobile Testing

### Test: Mobile Chrome
- [ ] Complete payment flow on mobile
- [ ] **Verify**: Responsive design works
- [ ] **Verify**: Touch interactions work
- [ ] **Verify**: State persists

### Test: Mobile Safari
- [ ] Complete payment flow on mobile
- [ ] **Verify**: Responsive design works
- [ ] **Verify**: Touch interactions work
- [ ] **Verify**: State persists

## Test Results

### Summary
- Total Tests: ___
- Passed: ___
- Failed: ___
- Skipped: ___

### Issues Found
1. ___
2. ___
3. ___

### Notes
___

---

**Tested By:** ___  
**Date:** ___  
**Environment:** ___  
**Browser:** ___  
**Version:** ___
