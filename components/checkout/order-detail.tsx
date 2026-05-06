"use client";

import { Button } from "@/components/ui/button";
import { CheckoutFormData } from "@/schemas/checkout.schema";

interface OrderDetail {
  onSubmit: () => Promise<void>;
  isProcessing: boolean;
  address: CheckoutFormData;
}

export default function OrderDetail({
  onSubmit,
  isProcessing,
  address,
}: OrderDetail) {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-xl font-semibold">Review & Confirm</h2>
        <p className="text-sm text-muted-foreground">
          Please verify your details before proceeding to payment.
        </p>
      </div>

      {/* Contact Info */}
      <div className="border rounded-2xl p-4 space-y-2">
        <h3 className="font-medium">Contact Information</h3>
        <p className="text-sm">{address.email}</p>
        <p className="text-sm">{address.phone}</p>
      </div>

      {/* Shipping Address */}
      <div className="border rounded-2xl p-4 space-y-2">
        <h3 className="font-medium">Shipping Address</h3>
        <p className="text-sm">{address.fullName}</p>
        <p className="text-sm">{address.line1}</p>
        <p className="text-sm">
          {address.city}, {address.stateRegion} {address.postalCode}
        </p>
        <p className="text-sm">{address.country}</p>
      </div>

      {/* Payment Info Note */}
      <div className="border rounded-2xl p-4 bg-muted/40">
        <p className="text-sm">
          You will be redirected to secure payment via Razorpay after clicking
          “Pay Now”.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        className="w-full h-12 text-base font-semibold"
        onClick={onSubmit}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
}
