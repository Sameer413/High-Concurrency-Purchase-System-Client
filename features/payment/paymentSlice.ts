import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

export type PaymentStatus =
  | "idle"
  | "creating"
  | "processing"
  | "verifying"
  | "completed"
  | "failed";

export interface CurrentPayment {
  orderId: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  paymentId: string | null;
  amount: number | null;
  currency: string | null;
  status: PaymentStatus;
  error: string | null;
  createdAt: string | null;
  completedAt: string | null;
}

export interface PaymentState {
  currentPayment: CurrentPayment;
  paymentHistory: Array<{
    orderId: string;
    razorpayOrderId: string;
    status: PaymentStatus;
    amount: number;
    completedAt: string;
  }>;
}

const initialState: PaymentState = {
  currentPayment: {
    orderId: null,
    razorpayOrderId: null,
    razorpayPaymentId: null,
    paymentId: null,
    amount: null,
    currency: null,
    status: "idle",
    error: null,
    createdAt: null,
    completedAt: null,
  },
  paymentHistory: [],
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    // Set payment as creating (when initiating order)
    setPaymentCreating: (
      state,
      action: PayloadAction<{ orderId: string; amount: number }>
    ) => {
      state.currentPayment = {
        ...initialState.currentPayment,
        orderId: action.payload.orderId,
        amount: action.payload.amount,
        status: "creating",
        createdAt: new Date().toISOString(),
      };
    },

    // Set Razorpay order details
    setRazorpayOrder: (
      state,
      action: PayloadAction<{
        razorpayOrderId: string;
        paymentId: string;
        currency: string;
      }>
    ) => {
      state.currentPayment.razorpayOrderId = action.payload.razorpayOrderId;
      state.currentPayment.paymentId = action.payload.paymentId;
      state.currentPayment.currency = action.payload.currency;
      state.currentPayment.status = "processing";
    },

    // Set payment as processing (when Razorpay modal opens)
    setPaymentProcessing: (state) => {
      state.currentPayment.status = "processing";
    },

    // Set payment as verifying (when payment handler is called)
    setPaymentVerifying: (
      state,
      action: PayloadAction<{
        razorpayPaymentId: string;
        razorpayOrderId: string;
      }>
    ) => {
      state.currentPayment.razorpayPaymentId =
        action.payload.razorpayPaymentId;
      state.currentPayment.razorpayOrderId = action.payload.razorpayOrderId;
      state.currentPayment.status = "verifying";
    },

    // Set payment as completed
    setPaymentCompleted: (state) => {
      state.currentPayment.status = "completed";
      state.currentPayment.completedAt = new Date().toISOString();
      state.currentPayment.error = null;

      // Add to payment history
      if (
        state.currentPayment.orderId &&
        state.currentPayment.razorpayOrderId &&
        state.currentPayment.amount
      ) {
        state.paymentHistory.unshift({
          orderId: state.currentPayment.orderId,
          razorpayOrderId: state.currentPayment.razorpayOrderId,
          status: "completed",
          amount: state.currentPayment.amount,
          completedAt: state.currentPayment.completedAt,
        });

        // Keep only last 10 payments in history
        if (state.paymentHistory.length > 10) {
          state.paymentHistory = state.paymentHistory.slice(0, 10);
        }
      }
    },

    // Set payment as failed
    setPaymentFailed: (state, action: PayloadAction<string>) => {
      state.currentPayment.status = "failed";
      state.currentPayment.error = action.payload;

      // Add to payment history
      if (
        state.currentPayment.orderId &&
        state.currentPayment.razorpayOrderId &&
        state.currentPayment.amount
      ) {
        state.paymentHistory.unshift({
          orderId: state.currentPayment.orderId,
          razorpayOrderId: state.currentPayment.razorpayOrderId,
          status: "failed",
          amount: state.currentPayment.amount,
          completedAt: new Date().toISOString(),
        });

        // Keep only last 10 payments in history
        if (state.paymentHistory.length > 10) {
          state.paymentHistory = state.paymentHistory.slice(0, 10);
        }
      }
    },

    // Reset payment state (after successful completion or when starting new payment)
    resetPayment: (state) => {
      state.currentPayment = initialState.currentPayment;
    },

    // Clear payment error
    clearPaymentError: (state) => {
      state.currentPayment.error = null;
    },

    // Recover payment (for resuming interrupted payments)
    recoverPayment: (state, action: PayloadAction<CurrentPayment>) => {
      state.currentPayment = action.payload;
    },
  },
});

export const {
  setPaymentCreating,
  setRazorpayOrder,
  setPaymentProcessing,
  setPaymentVerifying,
  setPaymentCompleted,
  setPaymentFailed,
  resetPayment,
  clearPaymentError,
  recoverPayment,
} = paymentSlice.actions;

// Selectors
export const selectCurrentPayment = (state: RootState) =>
  state.payment.currentPayment;
export const selectPaymentStatus = (state: RootState) =>
  state.payment.currentPayment.status;
export const selectPaymentError = (state: RootState) =>
  state.payment.currentPayment.error;
export const selectPaymentHistory = (state: RootState) =>
  state.payment.paymentHistory;
export const selectIsPaymentInProgress = (state: RootState) => {
  const status = state.payment.currentPayment.status;
  return status === "creating" || status === "processing" || status === "verifying";
};

export default paymentSlice.reducer;
