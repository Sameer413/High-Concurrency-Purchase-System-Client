"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePaymentState } from "@/features/payment/hooks";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { Button } from "./ui/button";

export function PaymentRecoveryModal() {
  const router = useRouter();
  const {
    currentPayment,
    paymentStatus,
    resetPaymentState,
  } = usePaymentState();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if there's an interrupted payment
    if (
      currentPayment.orderId &&
      (paymentStatus === "creating" ||
        paymentStatus === "processing" ||
        paymentStatus === "verifying")
    ) {
      // Check if payment is older than 30 minutes
      const createdAt = currentPayment.createdAt
        ? new Date(currentPayment.createdAt)
        : null;
      const now = new Date();
      const thirtyMinutes = 30 * 60 * 1000;

      if (createdAt && now.getTime() - createdAt.getTime() > thirtyMinutes) {
        // Payment is too old, auto-reset
        resetPaymentState();
      } else {
        // Show recovery modal
        setShowModal(true);
      }
    }
  }, []);

  const handleResume = () => {
    // Navigate to checkout with the order ID
    router.push(`/checkout?orderId=${currentPayment.orderId}`);
    setShowModal(false);
  };

  const handleDiscard = () => {
    resetPaymentState();
    setShowModal(false);
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-full bg-yellow-100 p-2">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Incomplete Payment Detected
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              We found an incomplete payment for your order. Would you like to
              resume or start fresh?
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium text-gray-900">
                {currentPayment.orderId}
              </span>
            </div>
            {currentPayment.amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-900">
                  ₹{(currentPayment.amount / 100).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium capitalize text-gray-900">
                {paymentStatus}
              </span>
            </div>
            {currentPayment.createdAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Started:</span>
                <span className="font-medium text-gray-900">
                  {new Date(currentPayment.createdAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleDiscard}
            variant="outline"
            className="flex-1"
          >
            <X className="mr-2 h-4 w-4" />
            Start Fresh
          </Button>
          <Button
            onClick={handleResume}
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Resume Payment
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          If you've already completed this payment, you can safely start fresh.
        </p>
      </div>
    </div>
  );
}
