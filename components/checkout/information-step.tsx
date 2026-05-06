"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { CheckoutFormData } from "@/schemas/checkout.schema";

interface InformationStepProps {
  form: UseFormReturn<CheckoutFormData>;
  isProcessing?: boolean;
}

export default function InformationStep({
  form,
  isProcessing = false,
}: InformationStepProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-8">
      {/* Contact Info */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">
              Email <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              disabled={isProcessing}
              className={errors.email ? "border-red-500" : ""}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">
              Phone <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              disabled={isProcessing}
              className={errors.phone ? "border-red-500" : ""}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </Field>
        </FieldGroup>
      </section>

      {/* Shipping Address */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>

        <FieldGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="fullName"
                disabled={isProcessing}
                className={errors.fullName ? "border-red-500" : ""}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="country">
              Country <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="country"
              placeholder="India"
              disabled={isProcessing}
              className={errors.country ? "border-red-500" : ""}
              {...register("country")}
            />
            {errors.country && (
              <p className="text-sm text-red-500 mt-1">
                {errors.country.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="stateRegion">
              State / Region <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="stateRegion"
              placeholder="Maharashtra"
              disabled={isProcessing}
              className={errors.stateRegion ? "border-red-500" : ""}
              {...register("stateRegion")}
            />
            {errors.stateRegion && (
              <p className="text-sm text-red-500 mt-1">
                {errors.stateRegion.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="line1">
              Address <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="line1"
              placeholder="Street address"
              disabled={isProcessing}
              className={errors.line1 ? "border-red-500" : ""}
              {...register("line1")}
            />
            {errors.line1 && (
              <p className="text-sm text-red-500 mt-1">
                {errors.line1.message}
              </p>
            )}
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="city">
                City <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="city"
                placeholder="Pune"
                disabled={isProcessing}
                className={errors.city ? "border-red-500" : ""}
                {...register("city")}
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.city.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="postalCode">
                Postal Code <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="postalCode"
                placeholder="411001"
                disabled={isProcessing}
                className={errors.postalCode ? "border-red-500" : ""}
                {...register("postalCode")}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.postalCode.message}
                </p>
              )}
            </Field>
          </div>
        </FieldGroup>
      </section>
    </div>
  );
}
