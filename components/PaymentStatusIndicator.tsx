"use client";

import { usePaymentState } from "@/features/payment/hooks";
import { Spinner } from "./ui/spinner";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface PaymentStatusIndicatorProps {
  showHistory?: boolean;
}

export function PaymentStatusIndicator({
  showHistory = false,
}: PaymentStatusIndicatorProps) {
  const {
    currentPayment,
    paymentStatus,
    paymentError,
    isPaymentInProgress,
    paymentHistory,
  } = usePaymentState();

  if (paymentStatus === "idle" && !showHistory) {
    return null;
  }

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "creating":
      case "processing":
      case "verifying":
        return <Spinner className="h-5 w-5" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case "creating":
        return "Creating order...";
      case "processing":
        return "Processing payment...";
      case "verifying":
        return "Verifying payment...";
      case "completed":
        return "Payment completed successfully";
      case "failed":
        return `Payment failed: ${paymentError}`;
      default:
        return "Ready to process payment";
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case "creating":
      case "processing":
      case "verifying":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "completed":
        return "bg-green-50 border-green-200 text-green-800";
      case "failed":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Payment Status */}
      {paymentStatus !== "idle" && (
        <div
          className={`flex items-center gap-3 rounded-lg border p-4 ${getStatusColor()}`}
        >
          {getStatusIcon()}
          <div className="flex-1">
            <p className="font-medium">{getStatusText()}</p>
            {currentPayment.orderId && (
              <p className="text-sm opacity-75">
                Order ID: {currentPayment.orderId}
              </p>
            )}
            {currentPayment.razorpayOrderId && (
              <p className="text-sm opacity-75">
                Razorpay Order: {currentPayment.razorpayOrderId}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Payment History */}
      {showHistory && paymentHistory.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-gray-900">
            Recent Payment Attempts
          </h3>
          <div className="space-y-2">
            {paymentHistory.map((payment, index) => (
              <div
                key={`${payment.orderId}-${index}`}
                className="flex items-center justify-between rounded border border-gray-100 p-3 text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    Order: {payment.orderId}
                  </p>
                  <p className="text-gray-500">
                    {new Date(payment.completedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    ₹{(payment.amount / 100).toFixed(2)}
                  </span>
                  {payment.status === "completed" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
