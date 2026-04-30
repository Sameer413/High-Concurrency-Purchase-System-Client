"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CartItem,
  CheckoutFormData,
  CheckoutStep,
} from "../app/checkout/types";
// import { useGetProductAvailabilityQuery } from "@/features/products/productsApi";

export function useCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  const [stockErrors, setStockErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    country: "",
    stateRegion: "",
    address: "",
    city: "",
    postalCode: "",
    agreeToTerms: false,
  });

  const isBuyNow = searchParams.get("buyNow") === "true";

  // Get product data from URL for buy now
  useEffect(() => {
    if (isBuyNow) {
      const productParam = searchParams.get("product");
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
    
    for (const item of cart) {
      try {
        const response = await fetch(`/api/products/${item.productId}/availability`);
        const data = await response.json();
        
        if (!data.data.canBuy || data.data.availableStock < item.quantity) {
          errors.push(
            `${item.product.name}: Only ${data.data.availableStock} available (requested ${item.quantity})`
          );
        }
      } catch (error) {
        errors.push(`${item.product.name}: Unable to verify stock`);
      }
    }
    
    setStockErrors(errors);
    return errors.length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentStep === "information") {
      // Validate stock before proceeding
      const stockValid = await validateStock();
      if (!stockValid) {
        return; // Don't proceed if stock validation fails
      }
      setCurrentStep("shipping");
      return;
    }

    if (currentStep === "shipping") {
      setCurrentStep("payment");
      return;
    }

    // Final stock validation before payment
    const stockValid = await validateStock();
    if (!stockValid) {
      setCurrentStep("information");
      return;
    }

    localStorage.removeItem("cart");
    router.push("/checkout/success");
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const shipping = 10;
  const total = cartTotal + shipping;

  return {
    cart,
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    cartTotal,
    shipping,
    total,
    isBuyNow,
    stockErrors,
    validateStock,
  };
}
