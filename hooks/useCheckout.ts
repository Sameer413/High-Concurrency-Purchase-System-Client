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
import { useGetReservationQuery } from "@/features/products/productsApi";
import { useInitiateOrderMutation } from "@/features/order/orderApi";
import {
  useCreatePaymentMutation,
  useVerifyPaymentMutation,
} from "@/features/payment/paymentApi";
import { usePaymentState } from "@/features/payment/hooks";

export function useCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
  const [stockErrors, setStockErrors] = useState<string[]>([]);

  // Use payment state management hook
  const {
    currentPayment,
    paymentStatus,
    paymentError,
    isPaymentInProgress,
    startPaymentCreation,
    setRazorpayOrderDetails,
    startPaymentProcessing,
    startPaymentVerification,
    completePayment,
    failPayment,
    resetPaymentState,
    clearError,
  } = usePaymentState();

  const reservationId = searchParams.get("reservationId");
  const isBuyNow = !!reservationId;

  // Fetch reservation data if reservationId exists
  const {
    data: reservationData,
    isLoading: isLoadingReservation,
    error: reservationError,
  } = useGetReservationQuery(reservationId!, {
    skip: !reservationId,
    pollingInterval: 30000, // Poll every 30 seconds to check expiration
  });

  // Initiate Order
  const [initiateOrder, { isLoading: initiateOrderLoading }] =
    useInitiateOrderMutation();

  // Create Payment
  const [createPayment, { isLoading: createPaymentLoading }] =
    useCreatePaymentMutation();
  const [verifyPayment, { isLoading: verifyPaymentLoading }] =
    useVerifyPaymentMutation();

  // Initialize React Hook Form with Zod validation
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "Sameer Nimje",
      // email: "sameernimje844@gmail.com",
      phone: "8208643722",
      stateRegion: "Maharashtra",
      line1: "123 Main Street",
      landmark: "",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  // Handle reservation data and convert to cart format
  useEffect(() => {
    if (reservationData?.data) {
      const reservation = reservationData.data;

      // Map reservation items directly (they already have the right structure)
      // No need to convert to nested format since OrderSummary now handles both
      const cartItems = reservation.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      }));

      setCart(cartItems as any);
    }
  }, [reservationData]);

  // Load cart from localStorage if not buy now
  useEffect(() => {
    if (!isBuyNow) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [isBuyNow]);

  // Check for interrupted payment on mount
  useEffect(() => {
    if (
      currentPayment.orderId &&
      (paymentStatus === "creating" ||
        paymentStatus === "processing" ||
        paymentStatus === "verifying")
    ) {
      // Show recovery UI or automatically retry
      console.log("Interrupted payment detected:", currentPayment);
      // You can add logic here to show a modal asking user if they want to resume
    }
  }, []);

  // Clear payment error when component unmounts or step changes
  useEffect(() => {
    return () => {
      if (paymentError) {
        clearError();
      }
    };
  }, [currentStep]);

  // Validate stock availability for all cart items
  const validateStock = async () => {
    const errors: string[] = [];

    // if (isBuyNow && reservationExpired) {
    //   errors.push("Your reservation has expired. Please try again.");
    // }

    // TODO: Validate cart items if not buy now

    setStockErrors(errors);
    return errors.length === 0;
  };

  // Handle address form submission
  const handleAddressSubmit = async (data: CheckoutFormData) => {
    try {
      // Validate stock before proceeding to payment
      const stockValid = await validateStock();
      if (!stockValid) {
        return;
      }

      // Move to payment step
      setCurrentStep("detail");
    } catch (error) {
      console.error("Error during address submission:", error);
    }
  };

  // Handle payment and order creation
  const handlePaymentSubmit = async () => {
    try {
      // Final stock validation before payment
      const stockValid = await validateStock();
      if (!stockValid) {
        setCurrentStep("address");
        return;
      }

      const addressData = form.getValues();

      const payload = {
        ...(reservationId && { reservationId }),
        customerEmail: addressData.email,
        customerPhone: addressData.phone,
        shippingAddress: {
          fullName: addressData.fullName,
          phone: addressData.phone,
          line1: addressData.line1,
          landmark: addressData.landmark,
          city: addressData.city,
          state: addressData.state,
          postalCode: addressData.postalCode,
          country: addressData.country,
        },
        notes: "",
      };

      // 1. Create Order (DB)
      const orderResponse = await initiateOrder(payload).unwrap();

      // Update payment state: creating
      startPaymentCreation(orderResponse.data.id, orderResponse.data.totalAmount);

      // 2. Create Razorpay Order
      const paymentResponse = await createPayment({
        amount: orderResponse.data.totalAmount,
        currency: "INR",
        orderId: orderResponse.data.id,
        notes: orderResponse.data?.notes,
      });

      const paymentData = paymentResponse.data;

      // Update payment state: processing
      setRazorpayOrderDetails(
        paymentData!.data.razorpayOrderId,
        paymentData!.data.paymentId,
        paymentData!.data.currency
      );

      // 3. Load Razorpay SDK
      // - We can use NextJs (<Script /> in checkout page which is much better than attaching script like below)
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        failPayment("Razorpay SDK failed to load");
        alert("Razorpay SDK failed to load");
        return;
      }

      // Update payment state: processing (modal opening)
      startPaymentProcessing();

      // 4. Open Razorpay Checkout
      const options = {
        key: paymentData!.data.razorpayKeyId,
        amount: paymentData!.data.amount,
        currency: paymentData!.data.currency,
        name: "Your Store",
        description: "Order Payment",
        order_id: paymentData!.data.razorpayOrderId,

        handler: async function (response: any) {
          console.log("Payment success:", response);

          // Update payment state: verifying
          startPaymentVerification(
            response.razorpay_payment_id,
            response.razorpay_order_id
          );

          try {
            // 5. VERIFY PAYMENT (VERY IMPORTANT)
            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderResponse.data.id,
            }).unwrap();

            // Update payment state: completed
            completePayment();

            // 6. Success flow
            localStorage.removeItem("cart");
            router.push(`/checkout/success?orderId=${orderResponse.data.id}`);
          } catch (verifyError: any) {
            console.error("Payment verification failed:", verifyError);
            failPayment(
              verifyError?.data?.message || "Payment verification failed"
            );
            alert("Payment verification failed. Please contact support.");
          }
        },

        prefill: {
          name: addressData.fullName,
          email: addressData.email,
          contact: addressData.phone,
        },

        theme: {
          color: "#000000",
        },

        modal: {
          ondismiss: function () {
            console.log("Payment modal closed by user");
            failPayment("Payment cancelled by user");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        failPayment(
          response.error?.description || "Payment failed. Please try again."
        );
        alert("Payment failed. Try again.");
      });

      rzp.open();
    } catch (error: any) {
      console.error("Error during payment processing:", error);
      failPayment(
        error?.data?.message || "Failed to process order. Please try again."
      );
      // Handle payment error - show error message to user
      alert(
        error?.data?.message || "Failed to process order. Please try again."
      );
    }
  };

  // Go back to address step
  const goBackToAddress = () => {
    setCurrentStep("address");
  };

  const cartTotal = cart.reduce((sum, item) => {
    // Handle both reservation format (with totalPrice) and cart format (with product.price)
    const itemTotal =
      (item as any).totalPrice || (item.product?.price ?? 0) * item.quantity;
    return sum + itemTotal;
  }, 0);

  const shipping = 0; // Free shipping for now
  const total = cartTotal + shipping;

  // Razorpay
  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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
    isProcessing: isPaymentInProgress,

    // Payment state
    currentPayment,
    paymentStatus,
    paymentError,

    // Calculations
    cartTotal,
    shipping,
    total,

    // Flags
    isBuyNow,

    isLoadingReservation,

    reservationId,

    // Actions
    validateStock,
    goBackToAddress,
    resetPaymentState,
  };
}
