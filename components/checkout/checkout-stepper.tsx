"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckoutStep } from "@/types/types";

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
}

const steps: {
  key: CheckoutStep;
  label: string;
}[] = [
  { key: "information", label: "Information" },
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
];

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-between gap-2 min-w-85 mb-8">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center text-center min-w-22.5">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all",
                    isCompleted &&
                      "bg-primary text-primary-foreground border-primary",
                    isCurrent &&
                      "bg-primary text-primary-foreground border-primary ring-4 ring-primary/10",
                    !isCompleted &&
                      !isCurrent &&
                      "bg-muted text-muted-foreground border-border",
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>

                <span
                  className={cn(
                    "mt-2 text-xs sm:text-sm font-medium",
                    isCompleted || isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-border min-w-6" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
