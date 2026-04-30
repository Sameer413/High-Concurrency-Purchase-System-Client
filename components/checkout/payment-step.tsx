"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function PaymentStep({ formData, setFormData }: any) {
  return (
    <div className="space-y-4">
      <Input placeholder="Card Number" />
      <Input placeholder="MM/YY" />
      <Input placeholder="CVC" />

      <div className="flex gap-2">
        <Checkbox
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) =>
            setFormData((prev: any) => ({
              ...prev,
              agreeToTerms: checked as boolean,
            }))
          }
        />

        <span className="text-sm">Accept Terms</span>
      </div>
    </div>
  );
}
