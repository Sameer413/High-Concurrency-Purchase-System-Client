"use client";

import { Button } from "@/components/ui/button";
import InformationStep from "./information-step";
import PaymentStep from "./order-detail";
import { UseFormReturn } from "react-hook-form";
import { CheckoutFormData } from "@/schemas/checkout.schema";
import { CheckoutStep } from "@/app/checkout/types";
import OrderDetail from "./order-detail";

interface CheckoutFormProps {
  currentStep: CheckoutStep;
  form: UseFormReturn<CheckoutFormData>;
  handleAddressSubmit: (data: CheckoutFormData) => Promise<void>;
  handlePaymentSubmit: () => Promise<void>;
  isProcessing: boolean;
  goBackToAddress: () => void;
  stockErrors: string[];
  reservationExpired?: boolean;
}

export default function CheckoutForm({
  currentStep,
  form,
  handleAddressSubmit,
  handlePaymentSubmit,
  isProcessing,
  goBackToAddress,
  stockErrors,
  reservationExpired = false,
}: CheckoutFormProps) {
  return (
    <div>
      {/* Stock Errors Display */}
      {stockErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">Stock Issues:</h3>
          <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
            {stockErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Address Step */}
      {currentStep === "address" && (
        <form onSubmit={form.handleSubmit(handleAddressSubmit)}>
          <InformationStep form={form} isProcessing={isProcessing} />

          <div className="mt-8">
            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing || reservationExpired}
            >
              {isProcessing ? "Validating..." : "Continue to Payment"}
            </Button>
          </div>
        </form>
      )}

      {/* Order detail Step */}
      {currentStep === "detail" && (
        <div>
          <OrderDetail
            onSubmit={handlePaymentSubmit}
            isProcessing={isProcessing}
            address={form.getValues()}
          />

          <div className="mt-8 flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={goBackToAddress}
              disabled={isProcessing}
              className="flex-1"
            >
              Back to Address
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}