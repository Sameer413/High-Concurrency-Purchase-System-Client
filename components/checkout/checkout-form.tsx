"use client";

import { Button } from "@/components/ui/button";
import InformationStep from "./information-step";
import PaymentStep from "./payment-step";
import { UseFormReturn } from "react-hook-form";
import { CheckoutFormData } from "@/schemas/checkout.schema";
import { CheckoutStep } from "@/app/checkout/types";

interface CheckoutFormProps {
  currentStep: CheckoutStep;
  form: UseFormReturn<CheckoutFormData>;
  handleAddressSubmit: (data: CheckoutFormData) => Promise<void>;
  handlePaymentSubmit: (paymentData: any) => Promise<void>;
  isProcessing: boolean;
  goBackToAddress: () => void;
  stockErrors: string[];
}

export default function CheckoutForm({
  currentStep,
  form,
  handleAddressSubmit,
  handlePaymentSubmit,
  isProcessing,
  goBackToAddress,
  stockErrors,
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

          {/* Terms and Conditions */}
          <div className="mt-6">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1"
                disabled={isProcessing}
                {...form.register("agreeToTerms")}
              />
              <span className="text-sm">
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  terms and conditions
                </a>{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>
            {form.formState.errors.agreeToTerms && (
              <p className="text-sm text-red-500 mt-1 ml-6">
                {form.formState.errors.agreeToTerms.message}
              </p>
            )}
          </div>

          <div className="mt-8">
            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? "Validating..." : "Continue to Payment"}
            </Button>
          </div>
        </form>
      )}

      {/* Payment Step */}
      {currentStep === "payment" && (
        <div>
          <PaymentStep
            onSubmit={handlePaymentSubmit}
            isProcessing={isProcessing}
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