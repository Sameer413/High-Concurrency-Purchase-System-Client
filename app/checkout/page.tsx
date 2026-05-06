"use client";

import CheckoutForm from "@/components/checkout/checkout-form";
import CheckoutStepper from "@/components/checkout/checkout-stepper";
import EmptyCart from "@/components/checkout/empty-cart";
import OrderSummary from "@/components/checkout/order-summary";
import { Footer } from "@/components/common/footer";
import { useCheckout } from "@/hooks/useCheckout";
import { Spinner } from "@/components/ui/spinner";

export default function CheckoutPage() {
  const checkout = useCheckout();

  // Show loading state while fetching reservation
  if (checkout.isLoadingReservation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading reservation...</p>
        </div>
      </div>
    );
  }

  if (checkout.cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Checkout</h1>

          <CheckoutStepper currentStep={checkout.currentStep} />

          <div className="grid lg:grid-cols-2 gap-8">
            <CheckoutForm {...checkout} />
            <OrderSummary {...checkout} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
