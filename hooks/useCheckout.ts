"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CartItem, CheckoutStep } from "../app/checkout/types";
import {
  checkoutFormSchema,
  CheckoutFormData,
} from "../schemas/checkout.schema";

export function useCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
  const [stockErrors, setStockErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const isBuyNow = searchParams.get("buyNow") === "true";

  // Initialize React Hook Form with Zod validation
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "sameernimje844@gmail.com",
      phone: "8208643722",
      firstName: "Sameer",
      lastName: "Nimje",
      country: "India",
      stateRegion: "Maharashtra",
      address: "123 Main Street",
      city: "Mumbai",
      postalCode: "400001",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  // Get product data from URL for buy now
  useEffect(() => {
    if (isBuyNow) {
      const productParam = searchParams.get("reservationId");
      if (productParam) {
        try {
          const productData = JSON.parse(decodeURIComponent(productParam));
          setCart([productData]);
        } catch (error) {
          console.error("Failed to parse product data:", error);
        }
      }
    } else {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [isBuyNow, searchParams]);

  // Validate stock availability for all cart items
  const validateStock = async () => {
    const errors: string[] = [];

    // TODO: Validate reservation

    setStockErrors(errors);
    return errors.length === 0;
  };

  // Handle address form submission
  const handleAddressSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    try {
      // Validate stock before proceeding to payment
      const stockValid = await validateStock();
      if (!stockValid) {
        setIsProcessing(false);
        return;
      }

      // Move to payment step
      setCurrentStep("payment");
    } catch (error) {
      console.error("Error during address submission:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment and order creation
  const handlePaymentSubmit = async (paymentData: any) => {
    setIsProcessing(true);

    try {
      // Final stock validation before payment
      const stockValid = await validateStock();
      if (!stockValid) {
        setCurrentStep("address");
        setIsProcessing(false);
        return;
      }

      const addressData = form.getValues();

      console.log(addressData);

      // TODO: Create order with address and cart data
      // const orderResponse = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     items: cart,
      //     shippingAddress: addressData,
      //     billingAddress: addressData,
      //     subtotal: cartTotal,
      //     total: total,
      //   }),
      // });
      // const order = await orderResponse.json();

      // TODO: Process payment
      // const paymentResponse = await fetch('/api/payment/process', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     orderId: order.orderId,
      //     paymentData: paymentData,
      //     amount: total,
      //   }),
      // });
      // const payment = await paymentResponse.json();

      // TODO: Update order with payment info
      // await fetch(`/api/orders/${order.orderId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     paymentId: payment.paymentId,
      //     transactionId: payment.transactionId,
      //     paymentStatus: 'completed',
      //   }),
      // });

      // Clear cart and redirect to success page
      localStorage.removeItem("cart");
      router.push("/checkout/success");
    } catch (error) {
      console.error("Error during payment processing:", error);
      // Handle payment error
    } finally {
      setIsProcessing(false);
    }
  };

  // Go back to address step
  const goBackToAddress = () => {
    setCurrentStep("address");
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const total = cartTotal;

  return {
    // Form
    form,
    handleAddressSubmit,
    handlePaymentSubmit,

    // State
    cart,
    currentStep,
    setCurrentStep,
    stockErrors,
    isProcessing,

    // Calculations
    cartTotal,
    total,

    // Flags
    isBuyNow,

    // Actions
    validateStock,
    goBackToAddress,
  };
}
