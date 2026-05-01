"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface PaymentStepProps {
  onSubmit: (paymentData: any) => Promise<void>;
  isProcessing: boolean;
}

export default function PaymentStep({ onSubmit, isProcessing }: PaymentStepProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
      newErrors.cardNumber = "Valid card number is required";
    }

    if (!paymentData.cardHolderName) {
      newErrors.cardHolderName = "Card holder name is required";
    }

    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = "Valid expiry date is required (MM/YY)";
    }

    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = "Valid CVV is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(paymentData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Payment Information</h2>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="cardHolderName">
              Card Holder Name <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="cardHolderName"
              name="cardHolderName"
              value={paymentData.cardHolderName}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={isProcessing}
              className={errors.cardHolderName ? "border-red-500" : ""}
            />
            {errors.cardHolderName && (
              <p className="text-sm text-red-500 mt-1">{errors.cardHolderName}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="cardNumber">
              Card Number <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="cardNumber"
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              maxLength={16}
              disabled={isProcessing}
              className={errors.cardNumber ? "border-red-500" : ""}
            />
            {errors.cardNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="expiryDate">
                Expiry Date <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="expiryDate"
                name="expiryDate"
                value={paymentData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                maxLength={5}
                disabled={isProcessing}
                className={errors.expiryDate ? "border-red-500" : ""}
              />
              {errors.expiryDate && (
                <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="cvv">
                CVV <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="cvv"
                name="cvv"
                type="password"
                value={paymentData.cvv}
                onChange={handleChange}
                placeholder="123"
                maxLength={4}
                disabled={isProcessing}
                className={errors.cvv ? "border-red-500" : ""}
              />
              {errors.cvv && (
                <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>
              )}
            </Field>
          </div>
        </FieldGroup>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">🔒 Secure Payment</p>
          <p>Your payment information is encrypted and secure.</p>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing Payment..." : "Complete Order"}
        </Button>
      </div>
    </form>
  );
}
