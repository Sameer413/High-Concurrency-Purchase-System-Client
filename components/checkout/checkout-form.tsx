"use client";

import { Button } from "@/components/ui/button";
import InformationStep from "./information-step";
import ShippingStep from "./shipping-step";
import PaymentStep from "./payment-step";

export default function CheckoutForm({
  currentStep,
  handleSubmit,
  handleInputChange,
  formData,
  setCurrentStep,
  setFormData,
}: any) {
  return (
    <form onSubmit={handleSubmit}>
      {currentStep === "information" && (
        <InformationStep
          formData={formData}
          onChange={handleInputChange}
        />
      )}

      {currentStep === "shipping" && (
        <ShippingStep />
      )}

      {currentStep === "payment" && (
        <PaymentStep
          formData={formData}
          setFormData={setFormData}
        />
      )}

      <div className="mt-8 flex gap-4">
        {currentStep !==
          "information" && (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setCurrentStep(
                currentStep ===
                  "payment"
                  ? "shipping"
                  : "information"
              )
            }
          >
            Back
          </Button>
        )}

        <Button
          type="submit"
          className="flex-1"
        >
          {currentStep ===
          "payment"
            ? "Complete Order"
            : "Continue"}
        </Button>
      </div>
    </form>
  );
}