# Payment Flow Diagram

## State Transition Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Payment Flow                             │
└─────────────────────────────────────────────────────────────────┘

                              ┌──────┐
                              │ IDLE │
                              └───┬──┘
                                  │
                    User clicks "Pay Now"
                                  │
                                  ▼
                          ┌───────────┐
                          │ CREATING  │ ◄─── Create order in DB
                          └─────┬─────┘      Store orderId, amount
                                │
                    Create Razorpay order
                                │
                                ▼
                         ┌──────────────┐
                         │ PROCESSING   │ ◄─── Store razorpayOrderId
                         └──────┬───────┘      Open Razorpay modal
                                │
                    User completes payment
                                │
                                ▼
                          ┌───────────┐
                          │ VERIFYING │ ◄─── Store razorpayPaymentId
                          └─────┬─────┘      Verify signature
                                │
                    ┌───────────┴───────────┐
                    │                       │
            Verification Success    Verification Failed
                    │                       │
                    ▼                       ▼
              ┌───────────┐           ┌─────────┐
              │ COMPLETED │           │ FAILED  │
              └───────────┘           └─────────┘
                    │                       │
                    │                       │
                    ▼                       ▼
            Add to history          Add to history
            Reset state             Show error
            Redirect to success     Allow retry
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Redux Store                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Payment Slice                            │ │
│  │  • currentPayment                                           │ │
│  │  • paymentHistory                                           │ │
│  │  • Actions & Reducers                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              │ redux-persist                     │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    localStorage                             │ │
│  │  persist:payment                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ usePaymentState()
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      React Components                            │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  useCheckout     │  │ PaymentStatus    │  │ PaymentRecovery│ │
│  │  Hook            │  │ Indicator        │  │ Modal          │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
│           │                     │                     │          │
│           └─────────────────────┴─────────────────────┘          │
│                              │                                   │
│                              ▼                                   │
│                    Payment State & Actions                       │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Payment Data Flow                           │
└─────────────────────────────────────────────────────────────────┘

User Action
    │
    ▼
┌─────────────────┐
│ useCheckout     │
│ Hook            │
└────────┬────────┘
         │
         │ dispatch action
         ▼
┌─────────────────┐
│ Payment Slice   │
│ Reducer         │
└────────┬────────┘
         │
         │ update state
         ▼
┌─────────────────┐
│ Redux Store     │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         │ persist         │ notify
         ▼                 ▼
┌─────────────────┐  ┌─────────────────┐
│ localStorage    │  │ React Components│
└─────────────────┘  └─────────────────┘
```

## Payment Recovery Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   Payment Recovery Flow                          │
└─────────────────────────────────────────────────────────────────┘

App Load
    │
    ▼
┌─────────────────────┐
│ PersistGate         │
│ Rehydrate State     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Check Payment State │
└──────────┬──────────┘
           │
           ├─────────────────────────────────────┐
           │                                     │
    Status: idle                    Status: creating/processing/verifying
           │                                     │
           ▼                                     ▼
    ┌──────────────┐                  ┌──────────────────┐
    │ Normal Flow  │                  │ Check Timestamp  │
    └──────────────┘                  └────────┬─────────┘
                                               │
                                    ┌──────────┴──────────┐
                                    │                     │
                            < 30 minutes            > 30 minutes
                                    │                     │
                                    ▼                     ▼
                          ┌──────────────────┐   ┌──────────────┐
                          │ Show Recovery    │   │ Auto Reset   │
                          │ Modal            │   │ State        │
                          └────────┬─────────┘   └──────────────┘
                                   │
                        ┌──────────┴──────────┐
                        │                     │
                   User: Resume          User: Discard
                        │                     │
                        ▼                     ▼
              ┌──────────────────┐   ┌──────────────┐
              │ Navigate to      │   │ Reset State  │
              │ Checkout         │   │              │
              └──────────────────┘   └──────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Error Handling Flow                           │
└─────────────────────────────────────────────────────────────────┘

Error Occurs
    │
    ▼
┌─────────────────────┐
│ failPayment(error)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Update State        │
│ • status = 'failed' │
│ • error = message   │
│ • Add to history    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Notify Components   │
└──────────┬──────────┘
           │
           ├─────────────────────────────────────┐
           │                                     │
           ▼                                     ▼
┌─────────────────────┐              ┌─────────────────────┐
│ Show Error Message  │              │ Enable Retry Button │
└─────────────────────┘              └──────────┬──────────┘
                                                │
                                                │ User clicks retry
                                                ▼
                                     ┌─────────────────────┐
                                     │ clearError()        │
                                     │ resetPaymentState() │
                                     └──────────┬──────────┘
                                                │
                                                ▼
                                     ┌─────────────────────┐
                                     │ Start New Payment   │
                                     └─────────────────────┘
```

## Persistence Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Persistence Flow                            │
└─────────────────────────────────────────────────────────────────┘

State Change
    │
    ▼
┌─────────────────────┐
│ Redux Action        │
│ Dispatched          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Reducer Updates     │
│ State               │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ redux-persist       │
│ Middleware          │
└──────────┬──────────┘
           │
           ├─────────────────────────────────────┐
           │                                     │
           ▼                                     ▼
┌─────────────────────┐              ┌─────────────────────┐
│ Serialize State     │              │ Check Whitelist     │
│ to JSON             │              │ • currentPayment    │
│                     │              │ • paymentHistory    │
└──────────┬──────────┘              └──────────┬──────────┘
           │                                     │
           └──────────────┬──────────────────────┘
                          │
                          ▼
                ┌─────────────────────┐
                │ Write to            │
                │ localStorage        │
                │ Key: persist:payment│
                └─────────────────────┘

On App Load:
    │
    ▼
┌─────────────────────┐
│ PersistGate         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Read from           │
│ localStorage        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Deserialize JSON    │
│ to State            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Rehydrate Redux     │
│ Store               │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Render App          │
└─────────────────────┘
```

## API Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   API Integration Flow                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│ User Action     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ useCheckout Hook                                                 │
│                                                                  │
│  1. startPaymentCreation(orderId, amount)                       │
│     │                                                            │
│     ▼                                                            │
│  2. initiateOrder() ──────► Backend API ──────► Database        │
│     │                          │                                 │
│     │                          ▼                                 │
│     │                    Order Created                           │
│     │                          │                                 │
│     ▼                          │                                 │
│  3. setRazorpayOrderDetails()  │                                │
│     │                          │                                 │
│     ▼                          │                                 │
│  4. createPayment() ──────────┴──► Backend API ──► Razorpay API │
│     │                                   │                        │
│     │                                   ▼                        │
│     │                          Razorpay Order Created            │
│     │                                   │                        │
│     ▼                                   │                        │
│  5. startPaymentProcessing()           │                        │
│     │                                   │                        │
│     ▼                                   │                        │
│  6. Open Razorpay Modal ◄──────────────┘                        │
│     │                                                            │
│     │ User completes payment                                    │
│     │                                                            │
│     ▼                                                            │
│  7. startPaymentVerification(paymentId, orderId)                │
│     │                                                            │
│     ▼                                                            │
│  8. verifyPayment() ──────► Backend API ──────► Razorpay API    │
│     │                          │                     │           │
│     │                          ▼                     │           │
│     │                    Verify Signature            │           │
│     │                          │                     │           │
│     │                          ▼                     │           │
│     │                    Update Database             │           │
│     │                          │                     │           │
│     ▼                          │                     │           │
│  9. completePayment() ◄────────┴─────────────────────┘           │
│     │                                                            │
│     ▼                                                            │
│ 10. Redirect to Success Page                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Timeline View

```
Time ──────────────────────────────────────────────────────────────►

T0: User clicks "Pay Now"
│   └─► startPaymentCreation()
│       Status: IDLE → CREATING
│
T1: Order created in database
│   └─► setRazorpayOrderDetails()
│       Status: CREATING → PROCESSING
│
T2: Razorpay modal opens
│   └─► startPaymentProcessing()
│       Status: PROCESSING (modal visible)
│
T3: User enters payment details
│   └─► (User interaction with Razorpay)
│
T4: Payment completed
│   └─► startPaymentVerification()
│       Status: PROCESSING → VERIFYING
│
T5: Signature verified
│   └─► completePayment()
│       Status: VERIFYING → COMPLETED
│
T6: Redirect to success page
│   └─► resetPaymentState()
│       Status: COMPLETED → IDLE

Total Duration: ~30-60 seconds (typical)

If Error at any stage:
│   └─► failPayment(error)
│       Status: * → FAILED
│       Error stored in state
│       User can retry
```

## State Persistence Example

```
┌─────────────────────────────────────────────────────────────────┐
│                localStorage: persist:payment                     │
├─────────────────────────────────────────────────────────────────┤
│ {                                                                │
│   "currentPayment": {                                            │
│     "orderId": "order_abc123",                                   │
│     "razorpayOrderId": "rzp_order_xyz789",                       │
│     "razorpayPaymentId": "rzp_pay_123456",                       │
│     "paymentId": "pay_internal_001",                             │
│     "amount": 10000,                                             │
│     "currency": "INR",                                           │
│     "status": "processing",                                      │
│     "error": null,                                               │
│     "createdAt": "2026-05-02T10:30:00.000Z",                     │
│     "completedAt": null                                          │
│   },                                                             │
│   "paymentHistory": [                                            │
│     {                                                            │
│       "orderId": "order_prev001",                                │
│       "razorpayOrderId": "rzp_order_prev001",                    │
│       "status": "completed",                                     │
│       "amount": 5000,                                            │
│       "completedAt": "2026-05-01T15:20:00.000Z"                  │
│     }                                                            │
│   ]                                                              │
│ }                                                                │
└─────────────────────────────────────────────────────────────────┘
```
