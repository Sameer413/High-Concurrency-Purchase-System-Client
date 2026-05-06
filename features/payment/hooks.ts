import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
  setPaymentCreating,
  setRazorpayOrder,
  setPaymentProcessing,
  setPaymentVerifying,
  setPaymentCompleted,
  setPaymentFailed,
  resetPayment,
  clearPaymentError,
  selectCurrentPayment,
  selectPaymentStatus,
  selectPaymentError,
  selectIsPaymentInProgress,
  selectPaymentHistory,
} from "./paymentSlice";

/**
 * Custom hook for payment state management
 * Provides actions and selectors for managing payment flow
 */
export const usePaymentState = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const currentPayment = useSelector(selectCurrentPayment);
  const paymentStatus = useSelector(selectPaymentStatus);
  const paymentError = useSelector(selectPaymentError);
  const isPaymentInProgress = useSelector(selectIsPaymentInProgress);
  const paymentHistory = useSelector(selectPaymentHistory);

  // Actions
  const startPaymentCreation = (orderId: string, amount: number) => {
    dispatch(setPaymentCreating({ orderId, amount }));
  };

  const setRazorpayOrderDetails = (
    razorpayOrderId: string,
    paymentId: string,
    currency: string
  ) => {
    dispatch(setRazorpayOrder({ razorpayOrderId, paymentId, currency }));
  };

  const startPaymentProcessing = () => {
    dispatch(setPaymentProcessing());
  };

  const startPaymentVerification = (
    razorpayPaymentId: string,
    razorpayOrderId: string
  ) => {
    dispatch(setPaymentVerifying({ razorpayPaymentId, razorpayOrderId }));
  };

  const completePayment = () => {
    dispatch(setPaymentCompleted());
  };

  const failPayment = (error: string) => {
    dispatch(setPaymentFailed(error));
  };

  const resetPaymentState = () => {
    dispatch(resetPayment());
  };

  const clearError = () => {
    dispatch(clearPaymentError());
  };

  return {
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
  };
};
