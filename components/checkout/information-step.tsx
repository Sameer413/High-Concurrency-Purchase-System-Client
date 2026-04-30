"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface CheckoutFormData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  country: string;
  stateRegion: string;
  address: string;
  city: string;
  postalCode: string;
}

interface InformationStepProps {
  formData: CheckoutFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InformationStep({
  formData,
  onChange,
}: InformationStepProps) {
  return (
    <div className="space-y-8">
      {/* Contact Info */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

        <FieldGroup>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="your@email.com"
              required
            />
          </Field>

          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              placeholder="+91 98765 43210"
            />
          </Field>
        </FieldGroup>
      </section>

      {/* Shipping Address */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>

        <FieldGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>First Name</FieldLabel>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Last Name</FieldLabel>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                required
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>Country</FieldLabel>
            <Input
              name="country"
              value={formData.country}
              onChange={onChange}
              placeholder="India"
              required
            />
          </Field>

          <Field>
            <FieldLabel>State / Region</FieldLabel>
            <Input
              name="stateRegion"
              value={formData.stateRegion}
              onChange={onChange}
              placeholder="Maharashtra"
            />
          </Field>

          <Field>
            <FieldLabel>Address</FieldLabel>
            <Input
              name="address"
              value={formData.address}
              onChange={onChange}
              placeholder="Street address"
              required
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>City</FieldLabel>
              <Input
                name="city"
                value={formData.city}
                onChange={onChange}
                placeholder="Pune"
                required
              />
            </Field>

            <Field>
              <FieldLabel>Postal Code</FieldLabel>
              <Input
                name="postalCode"
                value={formData.postalCode}
                onChange={onChange}
                placeholder="411001"
                required
              />
            </Field>
          </div>
        </FieldGroup>
      </section>
    </div>
  );
}
